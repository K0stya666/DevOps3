import React from 'react';
import { render, screen, act } from '@testing-library/react';
import StatusIndicator from '../StatusIndicator';

describe('StatusIndicator Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    
    // �������� navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true
    });
    
    // �������� ��������� �������
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('������ �������������� ��������� ������� ��� ������������', () => {
    render(<StatusIndicator />);
    
    expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  it('������ ������� ��������� ������� ��� ���������������', () => {
    const { unmount } = render(<StatusIndicator />);
    
    unmount();
    
    expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  it('�� ������ ������������ ����������, ���� ������', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true
    });
    
    render(<StatusIndicator />);
    
    expect(screen.queryByText(/���������� �������������/)).not.toBeInTheDocument();
    expect(screen.queryByText(/��� ����������/)).not.toBeInTheDocument();
  });

  it('������ ���������� �������-���������, ���� ��� ����������', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false
    });
    
    render(<StatusIndicator />);
    
    expect(screen.getByText(/��� ����������/)).toBeInTheDocument();
    expect(screen.getByText(/������������ ��������� ������/)).toBeInTheDocument();
  });

  it('������ ���������� ������-��������� ��� �������������� ���������� � �������� ��� ����� 3 �������', () => {
    const { rerender } = render(<StatusIndicator />);
    
    // ���������� ������� online
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true
    });
    
    // �������� ���������� ������� 'online'
    const onlineHandler = window.addEventListener.mock.calls.find(call => call[0] === 'online')[1];
    act(() => {
      onlineHandler();
    });
    
    rerender(<StatusIndicator />);
    
    expect(screen.getByText(/���������� �������������/)).toBeInTheDocument();
    expect(screen.getByText(/������ ����� ����������������/)).toBeInTheDocument();
    
    // ���������, ��� ��������� �������� ����� 3 �������
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    rerender(<StatusIndicator />);
    
    expect(screen.queryByText(/���������� �������������/)).not.toBeInTheDocument();
  });
});