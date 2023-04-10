import React , {useEffect,useState} from 'react';
import "./Navbar.css";

import { Link } from 'react-router-dom';

import { navitems } from './Navitems';

import "./components/bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./components/bootstrap_gene_page/css/sb-admin-2.min.css";


function Navbar() {

  const [dropdown, setDropdown] = useState(false);
  
  return (
    <div>
        <nav class="navbar navbar-expand navbar-light bg-primary topbar static-top shadow">

          <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
              <i class="fa fa-bars"></i>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item active">
                <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Contact Us</a>
              </li>
            </ul>
          </div>

          <ul class="navbar-nav ml-auto">

              <li class="nav-item dropdown no-arrow mx-1">
                  <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i class="fas fa-bell fa-fw"></i>

                      <span class="badge badge-danger badge-counter">3+</span>
                  </a>

                  <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="alertsDropdown">
                      <h6 class="dropdown-header">
                          Alerts Center
                      </h6>
                      <a class="dropdown-item d-flex align-items-center" href="#">
                          <div class="mr-3">
                              <div class="icon-circle bg-primary">
                                  <i class="fas fa-file-alt text-white"></i>
                              </div>
                          </div>
                          <div>
                              <div class="small text-gray-500">December 12, 2019</div>
                              <span class="font-weight-bold">A new monthly report is ready to download!</span>
                          </div>
                      </a>
                      <a class="dropdown-item d-flex align-items-center" href="#">
                          <div class="mr-3">
                              <div class="icon-circle bg-success">
                                  <i class="fas fa-donate text-white"></i>
                              </div>
                          </div>
                          <div>
                              <div class="small text-gray-500">December 7, 2019</div>
                              $290.29 has been deposited into your account!
                          </div>
                      </a>
                      <a class="dropdown-item d-flex align-items-center" href="#">
                          <div class="mr-3">
                              <div class="icon-circle bg-warning">
                                  <i class="fas fa-exclamation-triangle text-white"></i>
                              </div>
                          </div>
                          <div>
                              <div class="small text-gray-500">December 2, 2019</div>
                              Spending Alert: We've noticed unusually high spending for your account.
                          </div>
                      </a>
                      <a class="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                  </div>
              </li>

              <div class="topbar-divider d-none d-sm-block"></div>

              <li class="nav-item dropdown no-arrow">
                  <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <span class="mr-2 d-none d-lg-inline text-white-600 small">Douglas McGee</span>
                  </a>

                  <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="userDropdown">
                      <a class="dropdown-item" href="#">
                          <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                          Profile
                      </a>
                      <a class="dropdown-item" href="#">
                          <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                          Settings
                      </a>
                      <a class="dropdown-item" href="#">
                          <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                          Activity Log
                      </a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                          <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                          Logout
                      </a>
                  </div>
              </li> 

          </ul>

          </nav>

          
    </div>
  )
}

export default Navbar

{/*<ul className='bar'>
            <li className='bar'><a href='/' className='bar'>Home</a></li>
            <li className='bar'><a href='/' className='bar'>About</a></li>
            <li className='bar'><a href='/' className='bar'>Contact</a></li>
          </ul> */}


          /*<div id='logo_header'>
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
      </div> */