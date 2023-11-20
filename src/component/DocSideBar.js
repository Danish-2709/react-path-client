    import React from 'react'
    import { Link } from 'react-router-dom';
    import '../CSS/Style.css'
    
    export default function DocSideBar() {
      return (
        <>
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark Sidebar" style={{width: '205px',  minHeight: '100vh'}}>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li>
            <Link to="/DocViewComponent" className="nav-link text-white">
              Patient List
            </Link>
          </li>
        </ul>
        <hr />
      </div>      
        </>
      )
    }
    