    import { useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import '../CSS/Style.css';
    import { useSession } from './SessionContext';
    
    export default function PatientPanel() {
      const { loginNameT, setLoginNameT, loginName, setLoginName } = useSession();
    
    
      useEffect(() => {
        var loginNameT = document.cookie.replace(/(?:(?:^|.*;\s*)loginNameT\s*=\s*([^;]*).*$)|^.*$/, "$1");
        var loginName = document.cookie.replace(/(?:(?:^|.*;\s*)loginName\s*=\s*([^;]*).*$)|^.*$/, "$1");
    
        if ( loginNameT && loginName) {
            setLoginNameT(loginNameT);
            setLoginName(loginName);
        }
      }, [setLoginNameT, setLoginName]);
      
    
      const handleLogout = () => {
        fetch('/Logout', {
          method: 'POST',
        })
          .then((response) => {
            if (response.status === 200) {
              window.location.href = 'http://localhost:3000/';
            }
          })
          .catch((error) => {
            console.error('Logout failed:', error);
          });
      };
    
     return (
        <>
        <nav className="navbar navbar-expand-lg  nav1">
         <div className="container-fluid justify-content-between">
          <span className="navbar-brand mb-0 h1 logo-text">Diagnostic Pathology</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        </div>
        <div className="collapse navbar-collapse" id="navbarScroll">
        <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll sub-menu" style={{ scrollHeight: "100px" }}>
            <li className="nav-item">
              <Link to='/' className="nav-link active text-white" aria-current="page" >Home</Link>
            </li>      
            </ul>
          <div className="dropdown mx-3">
          <p className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
            {loginNameT && loginName && <strong>{loginNameT + ' ' + loginName}</strong>}
          </p>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
            <li><a className="dropdown-item" href="/">New project...</a></li>
            <li><a className="dropdown-item" href="/">Settings</a></li>
            <li><a className="dropdown-item" href="/">Profile</a></li>
            <li><hr className="dropdown-divider"  /></li>
            <li><Link className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            Log out
          </Link></li>
          </ul>
        </div>  
         </div>
        </nav>
        </>
      )
    }
    
