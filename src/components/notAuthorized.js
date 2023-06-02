import React, { useEffect, useRef } from 'react';
import CoffeeIcon from '@mui/icons-material/Coffee';


function NotAuthorized() {
  const textsRef = useRef([]);

  useEffect(() => {
    const colors = ['#f00000', '#ff8c00', '#ffef00', '#008000', '#0000f0', '#8b00ff'];

    const changeColors = () => {
      textsRef.current.forEach((textElement) => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        textElement.style.color = randomColor;
      });
    };

    const interval = setInterval(changeColors, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div>
        <h1 ref={(el) => (textsRef.current[0] = el)} className="text-center">You are not authorized uwu</h1>
        <h2 ref={(el) => (textsRef.current[1] = el)} className="text-center">Ask Admins to let you in</h2>
        <h3 ref={(el) => (textsRef.current[2] = el)} className="text-center">For now, enjoy coffee <CoffeeIcon /></h3>
      </div>
    </div>
  );
}

export default NotAuthorized