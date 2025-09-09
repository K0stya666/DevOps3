import React from 'react';
import { render, screen, act } from '@testing-library/react';
import StatusIndicator from '../StatusIndicator';

describe('StatusIndicator Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    
    // Мокируем navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true
    });
    
    // Мокируем слушатели событий
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('должен регистрировать слушатели событий при монтировании', () => {
    render(<StatusIndicator />);
    
    expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  it('должен удалять слушатели событий при размонтировании', () => {
    const { unmount } = render(<StatusIndicator />);
    
    unmount();
    
    expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  it('не должен отображаться изначально, если онлайн', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true
    });
    
    render(<StatusIndicator />);
    
    expect(screen.queryByText(/Соединение восстановлено/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Нет соединения/)).not.toBeInTheDocument();
  });

  it('должен отображать оффлайн-сообщение, если нет соединения', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false
    });
    
    render(<StatusIndicator />);
    
    expect(screen.getByText(/Нет соединения/)).toBeInTheDocument();
    expect(screen.getByText(/Используются локальные данные/)).toBeInTheDocument();
  });

  it('должен отображать онлайн-сообщение при восстановлении соединения и скрывать его через 3 секунды', () => {
    const { rerender } = render(<StatusIndicator />);
    
    // Симулируем событие online
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true
    });
    
    // Вызываем обработчик события 'online'
    const onlineHandler = window.addEventListener.mock.calls.find(call => call[0] === 'online')[1];
    act(() => {
      onlineHandler();
    });
    
    rerender(<StatusIndicator />);
    
    expect(screen.getByText(/Соединение восстановлено/)).toBeInTheDocument();
    expect(screen.getByText(/Данные будут синхронизированы/)).toBeInTheDocument();
    
    // Проверяем, что сообщение исчезнет через 3 секунды
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    rerender(<StatusIndicator />);
    
    expect(screen.queryByText(/Соединение восстановлено/)).not.toBeInTheDocument();
  });
});