import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading Component', () => {
  it('������ ���������� ��������� �� ���������', () => {
    render(<Loading />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // ���������� querySelector ������ getByClassName
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('������ ���������� ���������������� ���������', () => {
    const customMessage = '�������� ������...';
    
    render(<Loading message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
    // ���������� querySelector ������ getByClassName
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });
});