import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-icon">404</div>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">Go to Homepage</Link>
    </div>
  );
};

export default NotFound;