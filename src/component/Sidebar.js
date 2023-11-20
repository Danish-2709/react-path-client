import React from 'react'
import { Link } from 'react-router-dom';
import '../CSS/Style.css'

export default function Sidebar() {
  return (
    <>
<div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark Sidebar" style={{width: '205px',  minHeight: '100vh'}}>
    <hr />
    <ul className="nav nav-pills flex-column mb-auto">
      <li className="nav-item">
        <Link to="/AdminPanel" className="nav-link text-white" aria-current="page">
          Dashboard
        </Link>
      </li>
      <li>
        <Link to='/Cdepart' className="nav-link text-white">
          Create Department
        </Link>
      </li>
      <li>
        <Link to="/Cunit" className="nav-link text-white">
        Create Unit
        </Link>
      </li>
      <li>
        <Link to="/CTGroup" className="nav-link text-white">
          Create Test Group
        </Link>
      </li>
      <li>
        <Link to="/Cpackage" className="nav-link text-white">
          Create Packages
        </Link>
      </li>
      <li>
        <Link to="/CRefMaster" className="nav-link text-white">
          Create Clients
        </Link>
      </li>
      <li>
        <Link to="/CSGMaster" className="nav-link text-white">
          Create Test Sub Group
        </Link>
      </li>
      <li>
        <Link to="/ViewCSG" className="nav-link text-white">
          View Test Sub Group
        </Link>
      </li>
      <li>
        <Link to="/WaitingList" className="nav-link text-white">
          Waiting List
        </Link>
      </li>
      <li className="nav-item">
        <p className="nav-link dropdown-toggle text-white mb-0" role="button" data-bs-toggle="collapse" data-bs-target="#SubMenuMobile">
          Create Test
        </p>
          <ul id='SubMenuMobile' className="collapse">
            <li className="dropdown-submenu">
              <p className="dropdown-item dropdown-toggle nav-link text-white mb-0 px-0" href="#" role="button" data-bs-toggle="collapse" data-bs-target="#SubSubMenu1">
                Pathology
              </p>
              <ul id='SubSubMenu1' className="collapse px-2">
                <li><Link to='/CTNRange' className="dropdown-item nav-link text-white px-0">Normal Range</Link></li>
                <li><Link to='/CAWRange' className="dropdown-item nav-link text-white px-0">Age Wise Range</Link></li>
                <li><Link to='/CDRange' className="dropdown-item nav-link text-white px-0">Descriptive Range</Link></li>
                <li><Link to='/CTWLValue' className="dropdown-item nav-link text-white px-0">Test With List Of Value</Link></li>
              </ul>
            </li>
            <li className="dropdown-submenu">
              <p className="dropdown-item dropdown-toggle nav-link text-white mb-0 px-0" href="#" role="button" data-bs-toggle="collapse" data-bs-target="#SubSubMenu2">
                Radiology
              </p>
              <ul id='SubSubMenu2' className="collapse px-2">
                <li><Link to='/CRadiology' className="dropdown-item nav-link text-white px-0">Radiology</Link></li>
              </ul>
            </li>
          </ul>
        </li>
      <li>
        <Link to="/ViewTest" className="nav-link text-white">
          View Test
        </Link>
      </li>
      <li>
        <Link to="/CPRegistration" className="nav-link text-white">
          Patient Registration
        </Link>
      </li>
      <li>
        <Link to="/ViewPReg" className="nav-link text-white">
        View Patient Details
        </Link>
      </li>
      <li>
        <Link to="/CollDetails" className="nav-link text-white">
        Collection Details
        </Link>
      </li>
      <li>
        <Link to="/ColCenMaster" className="nav-link text-white">
        Create Collection Center
        </Link>
      </li>
      <li>
        <Link to="/CUserLogin" className="nav-link text-white">
        Create user Login
        </Link>
      </li>
    </ul>
    <hr />
    
  </div>      
    </>
  )
}
