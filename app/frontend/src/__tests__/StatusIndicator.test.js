import React from 'react';
import { render, screen, act } from '@testing-library/react';
import StatusIndicator from '../StatusIndicator';

jest.useFakeTimers();

describe('StatusIndicator Component', () => {
  let navigatorSpy;

  beforeAll(() => {
    navigatorSpy = jest.spyOn(window.navigator, 'onLine', 'get');
  });

  afterAll(() => {
    navigatorSpy.mockRestore();
  });

  const setNavigatorOnline = (isOnline) => {
    navigatorSpy.mockReturnValue(isOnline);
  };

  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;
  let eventListeners = {};

  beforeEach(() => {
    eventListeners = {};
    window.addEventListener = jest.fn((event, callback) => {
      eventListeners[event] = callback;
    });
    window.removeEventListener = jest.fn((event, callback) => {
       if (eventListeners[event] === callback) {
            delete eventListeners[event];
       }
    });
    jest.clearAllTimers();
  });

  afterEach(() => {
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
    jest.clearAllMocks();
  });

  test('initially renders nothing when online', () => {
    setNavigatorOnline(true);
    act(() => {
        render(<StatusIndicator />);
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('shows offline message when browser goes offline', () => {
    setNavigatorOnline(true);
    act(() => {
        render(<StatusIndicator />);
    });

    act(() => {
      setNavigatorOnline(false);
      if (eventListeners.offline) {
          eventListeners.offline();
      } else {
          throw new Error("Offline event listener was not added");
      }
    });

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/Нет соединения/i);
    expect(alert).toHaveClass('offline');
    expect(alert).not.toHaveClass('online');
  });

  test('shows online message and hides after timeout when browser comes online', () => {
    setNavigatorOnline(false);
    act(() => {
        render(<StatusIndicator />);
    });

    act(() => {
        if (eventListeners.offline) eventListeners.offline();
        else throw new Error("Offline listener missing");
    });
    expect(screen.getByRole('alert')).toHaveTextContent(/Нет соединения/i);

    act(() => {
        setNavigatorOnline(true);
        if (eventListeners.online) eventListeners.online();
        else throw new Error("Online listener missing");
    });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/Соединение восстановлено/i);
    expect(alert).toHaveClass('online');
    expect(alert).not.toHaveClass('offline');

    act(() => {
        jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('removes event listeners on unmount', () => {
    setNavigatorOnline(true);
    let unmountComponent;
    act(() => {
        const { unmount } = render(<StatusIndicator />);
        unmountComponent = unmount;
    });

    const onlineHandler = window.addEventListener.mock.calls.find(call => call[0] === 'online')?.[1];
    const offlineHandler = window.addEventListener.mock.calls.find(call => call[0] === 'offline')?.[1];

    expect(onlineHandler).toBeDefined();
    expect(offlineHandler).toBeDefined();

    unmountComponent();

    expect(window.removeEventListener).toHaveBeenCalledWith('online', onlineHandler);
    expect(window.removeEventListener).toHaveBeenCalledWith('offline', offlineHandler);
  });
});