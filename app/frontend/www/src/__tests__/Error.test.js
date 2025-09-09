import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Error from '../Error';

describe('Error Component', () => {
  it('������ ���������� ��������� �� ������', () => {
    const errorMessage = '�������� ������';
    
    render(
      <MemoryRouter>
        <Error message={errorMessage} />
      </MemoryRouter>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('Back to Books')).toBeInTheDocument();
    expect(screen.getByText('Back to Books').closest('a')).toHaveAttribute('href', '/books');
  });

  it('������ ���������� ������ ��������������', () => {
    render(
      <MemoryRouter>
        <Error message="������" />
      </MemoryRouter>
    );

    expect(screen.getByText('??')).toBeInTheDocument();
  });

  it('������ ������������ ���������������� ������ � �����, ���� ��� �������������', () => {
    const customLink = '/custom-link';
    const customText = '��������� �� �������';
    
    render(
      <MemoryRouter>
        <Error 
          message="������" 
          backLink={customLink} 
          backText={customText} 
        />
      </MemoryRouter>
    );

    expect(screen.getByText(customText)).toBeInTheDocument();
    expect(screen.getByText(customText).closest('a')).toHaveAttribute('href', customLink);
  });
});