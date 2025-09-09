import React, { useState, useEffect } from 'react';

const StatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Проверяем статус соединения при загрузке
    // Используем try/catch на случай, если navigator не определен (хотя в браузере он есть)
    try {
        setIsOnline(navigator.onLine);
    } catch (e) {
        console.warn("Could not access navigator.onLine");
        // Оставляем isOnline как true по умолчанию
    }


    // Добавляем слушатели событий для отслеживания изменения статуса соединения
    const handleOnline = () => {
      setIsOnline(true);
      setShowMessage(true);
      // Скрываем сообщение об онлайне через 3 секунды
      setTimeout(() => setShowMessage(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowMessage(true); // Сообщение об оффлайне остается видимым
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Очистка слушателей при размонтировании компонента
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showMessage) return null;

  return (
    // Добавляем role="alert" для доступности и тестирования
    <div role="alert" className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
      {isOnline
        ? '? Соединение восстановлено. Данные будут синхронизированы.'
        : '?? Нет соединения. Используются локальные данные.'}
    </div>
  );
};

export default StatusIndicator;