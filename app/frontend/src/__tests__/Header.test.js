import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

jest.mock('../StatusIndicator', () => () => <div data-testid="status-indicator-mock"></div>);

describe('Header Component', () => {
    const user = userEvent.setup();

    const renderWithRouter = (initialEntries = ['/']) => {
        let renderResult;
        act(() => {
            renderResult = render(
                <MemoryRouter initialEntries={initialEntries}>
                    <Header />
                </MemoryRouter>
            );
        });
        return renderResult
};

    it('should render the logo link', () => {
        renderWithRouter();
        const logoLink = screen.getByRole('link', { name: /Library MS/i });
        expect(logoLink).toBeInTheDocument();
        expect(logoLink).toHaveTextContent('?? Library MS');
        expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should render navigation links', () => {
        renderWithRouter();
        expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /All Books/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Add Book/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Search/i })).toBeInTheDocument();
    });

    it('should highlight the active link', () => {
        renderWithRouter(['/books/add']);
        const homeLink = screen.getByRole('link', { name: /Home/i });
        const allBooksLink = screen.getByRole('link', { name: /All Books/i });
        const addBookLink = screen.getByRole('link', { name: /Add Book/i });
        const searchLink = screen.getByRole('link', { name: /Search/i });

        expect(homeLink).not.toHaveClass('active');
        expect(allBooksLink).not.toHaveClass('active');
        expect(addBookLink).toHaveClass('active');
        expect(searchLink).not.toHaveClass('active');
    });

    it('should highlight the Home link for root path "/"', () => {
        renderWithRouter(['/']);
        const homeLink = screen.getByRole('link', { name: /Home/i });
        expect(homeLink).toHaveClass('active');
    });

    it('should highlight the All Books link for "/books" path', () => {
        renderWithRouter(['/books']);
        const allBooksLink = screen.getByRole('link', { name: /All Books/i });
        expect(allBooksLink).toHaveClass('active');
    });

    describe('Mobile Menu Actions', () => {
        const getMenuElements = () => {
            const header = screen.getByRole('banner');
            const menuIcon = header.querySelector('.menu-icon');
            const navLinks = header.querySelector('.nav-links');
            return { menuIcon, navLinks };
        };

        const clickMenuIcon = async () => {
            const { menuIcon } = getMenuElements();
            if (menuIcon) {
                await act(async () => {
                   await user.click(menuIcon);
                });
                return true;
            }
            return false;
        };

        test('should toggle mobile menu class on icon click', async () => {
            renderWithRouter();
            const { menuIcon, navLinks } = getMenuElements();

            expect(navLinks).not.toHaveClass('show');
            
            if (menuIcon) {
                await clickMenuIcon();
                await waitFor(() => expect(navLinks).toHaveClass('show'));

                await clickMenuIcon();
                await waitFor(() => expect(navLinks).not.toHaveClass('show'));
            }
        });

        test('should close mobile menu when a nav link is clicked', async () => {
            renderWithRouter();
            const { menuIcon, navLinks } = getMenuElements();

            if (menuIcon) {
                await clickMenuIcon();
                await waitFor(() => expect(navLinks).toHaveClass('show'));

                const homeLink = screen.getByRole('link', { name: /Home/i });
                await act(async () => {
                   await user.click(homeLink);
                });

                await waitFor(() => {
                    expect(navLinks).not.toHaveClass('show');
                });

                await clickMenuIcon();
                await waitFor(() => expect(navLinks).toHaveClass('show'));
                const addBookLink = screen.getByRole('link', { name: /Add Book/i });
                await act(async () => {
                  await user.click(addBookLink);
                });
                await waitFor(() => {
                    expect(navLinks).not.toHaveClass('show');
                });
            }
        });
    });
});