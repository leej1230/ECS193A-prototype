import React , {useEffect,useState} from 'react';
import "./Navbar.css";

import { Link } from 'react-router-dom';

import { navitems } from './Navitems';


function Navbar() {

  const [dropdown, setDropdown] = useState(false);
  
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
                <li  className='bar_item_right' onMouseEnter={() => {setDropdown(true); console.log("enter")}} onMouseLeave={() => setDropdown(false)} >
                  <Link  className='bar_link' to='/'>My Account</Link>
                  {dropdown && <ul className={"services-submenu"} >
                                  {navitems.map(item => {
                                    return(
                                      <li onClick={() => setDropdown(false)} key={item.id} className={item.cName}><Link className='submenu-link' to={item.path}>{item.title}</Link></li>
                                    )
                                  })}
                                </ul>}
                </li>
                
            </div>
        </div>
    </div>
  )
}

export default Navbar