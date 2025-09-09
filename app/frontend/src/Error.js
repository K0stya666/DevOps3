import React from 'react';
import { Link } from 'react-router-dom';

const Error = ({ message, backLink = '/books', backText = 'Back to Books' }) => {
  return (
    <div className="error">
      <div className="error-icon">⚠️</div>
      {message}
      <div style={{ marginTop: '20px' }}>
        <Link to={backLink} className="btn btn-primary">{backText}</Link>
      </div>
    </div>
  );
};

export default Error;