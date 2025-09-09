import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Library Management System. Made by Dzhevelik Anastasiia and Adriyanova Victoria.</p>
        <p>DevOps Laboratory Work</p>
      </div>
    </footer>
  );
};

export default Footer;
