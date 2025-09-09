import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    // ћокируем new Date() дл€ получени€ посто€нного года
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2023-01-01').valueOf());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('должен отображать информацию о копирайте с текущим годом', () => {
    render(<Footer />);
    
    expect(screen.getByText(/© 2023 Library Management System/)).toBeInTheDocument();
  });

  it('должен отображать имена авторов', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Made by Dzhevelik Anastasiia and Adriyanova Victoria/)).toBeInTheDocument();
  });

  it('должен отображать информацию о лабораторной работе', () => {
    render(<Footer />);
    
    expect(screen.getByText('DevOps Laboratory Work')).toBeInTheDocument();
  });
});