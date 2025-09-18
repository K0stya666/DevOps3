import React from 'react';
import { render, screen } from '@testing-library/react'; // ����������
import Footer from '../Footer'; // ���������, ��� ���� ����������

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
});

describe('Footer Component', () => {
  it('should render the copyright notice with the current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    // ���������� ����� �� ����� ������, ��� ��� ����� �������� ���� �
    expect(screen.getByText(/Library Management System/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument(); // ��������� ������� ����
    expect(screen.getByText(/Made by Dzhevelik Anastasiia and Adriyanova Victoria/i)).toBeInTheDocument();
  });

  it('should render the DevOps lab text', () => {
    render(<Footer />);
    expect(screen.getByText(/DevOps Laboratory Work/i)).toBeInTheDocument();
  });
});