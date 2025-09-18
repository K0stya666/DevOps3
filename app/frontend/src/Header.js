import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import StatusIndicator from './StatusIndicator';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen((v) => !v);

    return (
        <>
            <StatusIndicator />
            <header className="header">
                <div className="header-container">
                    <Link to="/" className="logo-link">
                        {/* Тест ожидает именно этот текст */}
                        <h1 className="logo">?? Library MS</h1>
                    </Link>

                    <div className="menu-icon" onClick={toggleMenu}>
                        <div className={`menu-line ${menuOpen ? 'open' : ''}`}></div>
                        <div className={`menu-line ${menuOpen ? 'open' : ''}`}></div>
                        <div className={`menu-line ${menuOpen ? 'open' : ''}`}></div>
                    </div>

                    <nav className={`nav-links ${menuOpen ? 'show' : ''}`}>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/books"
                            end
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                            onClick={() => setMenuOpen(false)}
                        >
                            All Books
                        </NavLink>
                        <NavLink
                            to="/books/add"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                            onClick={() => setMenuOpen(false)}
                        >
                            Add Book
                        </NavLink>
                        <NavLink
                            to="/search"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                            onClick={() => setMenuOpen(false)}
                        >
                            Search
                        </NavLink>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;
