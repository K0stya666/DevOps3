import React, { useState, useEffect } from 'react';

const StatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // ��������� ������ ���������� ��� ��������
    // ���������� try/catch �� ������, ���� navigator �� ��������� (���� � �������� �� ����)
    try {
        setIsOnline(navigator.onLine);
    } catch (e) {
        console.warn("Could not access navigator.onLine");
        // ��������� isOnline ��� true �� ���������
    }


    // ��������� ��������� ������� ��� ������������ ��������� ������� ����������
    const handleOnline = () => {
      setIsOnline(true);
      setShowMessage(true);
      // �������� ��������� �� ������� ����� 3 �������
      setTimeout(() => setShowMessage(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowMessage(true); // ��������� �� �������� �������� �������
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // ������� ���������� ��� ��������������� ����������
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showMessage) return null;

  return (
    // ��������� role="alert" ��� ����������� � ������������
    <div role="alert" className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
      {isOnline
        ? '? ���������� �������������. ������ ����� ����������������.'
        : '?? ��� ����������. ������������ ��������� ������.'}
    </div>
  );
};

export default StatusIndicator;