import React from 'react';
import { render, screen } from '@testing-library/react'; // Исправлено
import Footer from '../Footer'; // Убедитесь, что путь правильный

describe('Footer Component', () => {
  it('should render the copyright notice with the current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    // Используем поиск по части строки, так как текст включает знак ©
    expect(screen.getByText(/Library Management System/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument(); // Проверяем наличие года
    expect(screen.getByText(/Made by Dzhevelik Anastasiia and Adriyanova Victoria/i)).toBeInTheDocument();
  });

  it('should render the DevOps lab text', () => {
    render(<Footer />);
    expect(screen.getByText(/DevOps Laboratory Work/i)).toBeInTheDocument();
  });
});