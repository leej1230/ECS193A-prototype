import React from 'react';
import "./navbar.css";

function navbar() {
  return (
    <div>
        <ul className='bar'>
            <li className='bar'><a href='/' className='bar'>Home</a></li>
            <li className='bar'><a href='/' className='bar'>About</a></li>
            <li className='bar'><a href='/' className='bar'>Contact</a></li>
        </ul>
    </div>
  )
}

export default navbar