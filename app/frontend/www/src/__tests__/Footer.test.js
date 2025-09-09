import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    // �������� new Date() ��� ��������� ����������� ����
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2023-01-01').valueOf());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('������ ���������� ���������� � ��������� � ������� �����', () => {
    render(<Footer />);
    
    expect(screen.getByText(/� 2023 Library Management System/)).toBeInTheDocument();
  });

  it('������ ���������� ����� �������', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Made by Dzhevelik Anastasiia and Adriyanova Victoria/)).toBeInTheDocument();
  });

  it('������ ���������� ���������� � ������������ ������', () => {
    render(<Footer />);
    
    expect(screen.getByText('DevOps Laboratory Work')).toBeInTheDocument();
  });
});