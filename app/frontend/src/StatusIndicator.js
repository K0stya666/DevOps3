import React, { useState, useEffect } from 'react';

const StatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Проверяем статус соединения при загрузке
    setIsOnline(navigator.onLine);

    // Добавляем слушатели событий для отслеживания изменения статуса соединения
    const handleOnline = () => {
      setIsOnline(true);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showMessage) return null;

  return (
    <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
      {isOnline 
        ? '✅ Соединение восстановлено. Данные будут синхронизированы.' 
        : '⚠️ Нет соединения. Используются локальные данные.'}
    </div>
  );
};

export default StatusIndicator;