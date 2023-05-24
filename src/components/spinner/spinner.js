import React, { useEffect, useState } from 'react';
import "./spinner.css";



const LoadingSpinner = () => {
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      // Simulate a delay for the splash screen
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Adjust the delay time as needed
    }, []);
  
    return (
        <div className={`splash-screen ${isLoading ? "loading" : ""}`}>
          <video className="splash-video" autoPlay muted loop>
            <source src="https://static.videezy.com/system/resources/previews/000/052/403/original/2020_May_4K_0005.mp4" type="video/mp4" />
          </video>
          <h1>Welcome to Genomics Browser!</h1>
        </div>
      );
};

export default LoadingSpinner;
