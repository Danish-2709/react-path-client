import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baseURL from './apiConfig';
import '../CSS/Style.css';
import panelImg from'../Images/istockphoto-1225516503-1024x1024 copy.png';

export default function MyLogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [btnloginType, setBtnLoginType] = useState('Admin');
  const navigate = useNavigate();
  
  // const { setUserLoginType, setUserlabName } = useSession();

  const handleSubmit = async () => {
    // e.preventDefault();

    try {
      const response = await fetch(`${baseURL}/api/MyLogIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // const usersYear = data.sYear;
        document.cookie = "sId=" + data.sId;
        document.cookie = "loginType=" + data.loginType;
        document.cookie = "labName=" + data.labName;
        document.cookie = "centreType=" + data.centreType;
        document.cookie = "line1=" + data.line1;
        document.cookie = "oID=" + data.oID;
        navigate('/AdminPanel');
        // setUserLoginType(data.loginType);
        // setUserlabName(data.labName);
      } else {
        setErrorMessage('Username or password is incorrect'); 
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleDoc = async () => {
   try {
      const response = await fetch(`${baseURL}/api/DrLogIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        document.cookie = "rID=" + data.rID;
        document.cookie = "dLoginName=" + data.dLoginName;
        navigate('/DocPanel');
      } else {
        setErrorMessage('Username or password is incorrect'); 
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handlePatient = async () => {
   try {
      const response = await fetch(`${baseURL}/api/PatientLogIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        document.cookie = "rfiID=" + data.rfiID;
        document.cookie = "loginNameT=" + data.loginNameT;
        document.cookie = "loginName=" + data.loginName;
        navigate('/PatientPanel');
      } else {
        setErrorMessage('Username or password is incorrect'); 
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  return (
    <>
    <nav className="navbar bg-body-tertiary">
    <div className="container-fluid">
        <a href='/' className="navbar-brand nav-link">Login</a>
    </div>
    </nav>
      <div className='row MyLogin'>
        <div className='col-md-6 text-center'>
            <img src={panelImg} alt='IMG' className="responsive" width="730" height="100"/>  
        </div>
        <div className='col-md-6 form-section'>
        <div className="auth-wrapper">
          <div className='py-4'><h4 className='d-inline'>Welcome To LogIn Page</h4></div>
          <div className='d-flex justify-content-between lbl-alert'>
            <div className='py-2'>
            <button type="button" className={`btn btn-myPrimary btn-lg text-center ${btnloginType === 'Admin' ? 'active' : ''}`} onClick={() => setBtnLoginType('Admin')}>Admin</button>
            </div>
            <div className='py-2'>
            <button type="button" className={`btn btn-mySecondary btn-lg ${btnloginType === 'Doctor' ? 'active' : ''}`} onClick={() => setBtnLoginType('Doctor')}>Doctor</button>
            </div>
            <div className='py-2'>
            <button type="button" className={`btn btn-myTernary btn-lg ${btnloginType === 'Patient' ? 'active' : ''}`} onClick={() => setBtnLoginType('Patient')}>Patient</button>
            </div>
          </div>
          <h2 className='mat-typography'>Sign In</h2>
          <form>
            <div className="row mb-3">
              <label htmlFor="password">Username:</label>
              <input
                type="text"
                className='form-input col-md-12'
                id="username"
                name="username"
                value={username}
                autoComplete="current-username"
                onChange={(e) => setUsername(e.target.value)}
                required
                />
                <p className='d-flex justify-content-center align-items-center icon'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg></p>
            </div>
            <div className="row mb-3">
              <label htmlFor="password">Password:</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className='form-input col-md-12'
                name="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
               <p className='icon d-flex justify-content-center align-items-center' onClick={togglePasswordVisibility}>
                {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/></svg>
               ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>
               )}
            </p>
            </div>
            <div className="row">
            <div className='col-md-6 mb-5'>
              <input type='checkbox' /> Remember Me
            </div>
            <div className='col-md-6 mb-5'>
              <p style={{textAlign: 'right'}}><span>Forget Password?</span></p>
            </div>
              <div className='col-md-12'>
              <button type="submit" className={`btn btn-lg w-100 ${btnloginType === 'Admin' ? 'btn-myPrimary'  : btnloginType === 'Doctor' ? 'btn-mySecondary' : 'btn-myTernary'}`}
                  value="Login"  onClick={(event) => { event.preventDefault();
                  if (btnloginType === 'Admin') {
                    handleSubmit();
                  } else if (btnloginType === 'Doctor') {
                    handleDoc();
                  } else if (btnloginType === 'Patient') {
                    handlePatient();
                  }
                }}>{btnloginType === 'Admin' ? 'Admin Login' : btnloginType === 'Doctor' ?  'Doctor Login' : 'Patient Login'}</button>
              </div>
            </div>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        </div>
      </div>
    </>
  );
}
