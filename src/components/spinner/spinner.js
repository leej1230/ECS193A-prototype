import React from 'react';
import './spinner.css';
import rabbitImage from './rabbit.png';

const LoadingSpinner = () => {
    return (
        <div className="rabbit-container">
          <img className="rabbit" src={rabbitImage} alt="Dancing Rabbit" />
        </div>
      );
};

export default LoadingSpinner;
