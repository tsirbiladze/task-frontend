import React from 'react';
import './ErrorMessage.scss';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <i className="fas fa-exclamation-circle"></i>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;