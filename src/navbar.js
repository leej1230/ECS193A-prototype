import React from 'react';
import "./navbar.css";

import { Link } from 'react-router-dom';

function navbar() {
  return (
    <div>
        {/*<ul className='bar'>
            <li className='bar'><a href='/' className='bar'>Home</a></li>
            <li className='bar'><a href='/' className='bar'>About</a></li>
            <li className='bar'><a href='/' className='bar'>Contact</a></li>
          </ul> */}
        <div id='logo_header'>
            <div id='logo_item'><img id='logo' src={process.env.PUBLIC_URL+ "/davis_logo.jpg"} /></div>
        </div>
        <div  className='outer_bar'>
            <div className='bar_group'>
                <div  className='bar_item'><Link className='bar_link'  to='/' >Home</Link></div>
                <div  className='bar_item'><Link className='bar_link'  to='/' >About</Link></div>
                <div  className='bar_item'><Link  className='bar_link' to='/' >Contact</Link></div>
            </div>
        </div>
    </div>
  )
}

export default navbar