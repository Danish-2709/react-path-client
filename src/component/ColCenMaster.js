import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import baseURL from './apiConfig';

export default function ColCenMaster() {
    const { OID } = useParams();
    const [data, setData] = useState([]);
    const [, setClientdata] = useState([]);
    const [cName, setCName] = useState();
    const [cType, setCType] = useState();
    const type = ['Main Center', 'Collection Center']
    const [cNo, setCNo] = useState();
    const [email, setEmail] = useState();
    const [landmark, setLandmark] = useState();
    const [city, setCity] = useState();
    const [state, setState] = useState();
    const [website, setWebsite] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
  
  
    const handleCNameChange = (e) => {
      setCName(e.target.value);
    };
    const handleCTypeChange = (e) => {
        setCType(e.target.value);
    };
    const handleCNoChange = (e) => {
        setCNo(e.target.value);
    };
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
    const handleLandmarkChange = (e) => {
      setLandmark(e.target.value);
    };
    const handleCityChange = (e) => {
      setCity(e.target.value);
    };
    const handleStateChange = (e) => {
      setState(e.target.value);
    };
    const handleWebsiteChange = (e) => {
      setWebsite(e.target.value);
    };
  
    const removeSuccessMessage = () => {
      setSuccessMessage('');
      setShowModal(false);
    };
    
    const handleSubmit = async (e) => {
      console.log('handlenoticeupload called');
      e.preventDefault();
      if (isSubmitting) {
        return; 
      }
      setIsSubmitting(true); 
      setShowModal(true);
      setTimeout(() => {
        removeSuccessMessage();
      }, 2000); 
  
      const formData = new FormData();
      // Format the date values as YYYY-MM-DD strings
      formData.append('cName', cName);
      formData.append('cType', cType);
      formData.append('cNo', cNo);
      formData.append('email', email);
      formData.append('landmark', landmark);
      formData.append('city', city);
      formData.append('state', state);
      formData.append('website', website);
     if(OID){
      try {
        const response = await fetch(`${baseURL}/api/EditCenter/${OID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cName, cType, cNo, email, landmark, city, state, website}),
        });
    
        if (response.ok) {
          setSuccessMessage('Center Updated successfully.');
          setCName('');
          setCType('');
          setCNo('');
          setEmail('');
          setLandmark('');
          setCity('');
          setState('');
          setWebsite('');
        } else {
          console.log("error in uploading")
        }
      } catch (error) {
        console.error('Error uploading', error);
      }
    } else {
       try {
         const response = await fetch(`${baseURL}/api/CollMaster`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ cName, cType, cNo, email, landmark, city, state, website}),
         });
     
         if (response.ok) {
           console.log('Center Created successfully');
           setSuccessMessage('Center Created successfully.');
           setCName('');
           setCType('');
           setCNo('');
           setEmail('');
           setLandmark('');
           setCity('');
           setState('');
           setWebsite('');
         } else {
           console.log("error in uploading")
         }
       } catch (error) {
         console.error('Error uploading', error);
       }
     }
      setIsSubmitting(false);
    }
    const handleReset = () => {
      setCName('');
      setCName('');
      setCType('');
      setCNo('');
      setEmail('');
      setLandmark('');
      setCity('');
      setState('');
      setWebsite('');
    };

    useEffect(() => {
        fetchData();
      }, []);

    const fetchData = () => {
      fetch(`${baseURL}/api/CenterData`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data.recordset)) {
            setData(data.recordset);
          } else {
            console.error('Invalid data format from the API');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    useEffect(() => {
      if (OID) {
        console.log('Fetching data for OID:', OID);
        fetch(`${baseURL}/api/GetCenters/${OID}`)
          .then((response) => response.json())
          .then((result) => {
            console.log('API response:', result);
            if (result && result.length > 0) {
              const clientdata = result[0]; // Access the first item in the array
    
              // Update state variables
              setClientdata(clientdata);
              setCName(clientdata.CentreName || '');
              setCType(clientdata.CentreType || '');
              setCNo(clientdata.Contact || '');
              setEmail(clientdata.Email || '');
              setLandmark(clientdata.Line1 || '');
              setCity(clientdata.Line2 || '');
              setState(clientdata.Line3 || '');
              setWebsite(clientdata.Website || '');
            } else {
              console.log('No data received');
            }
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      } else {
        console.log('RID is not defined or falsy');
        setCName('');
        setCType('');
        setCNo('');
        setEmail('');
        setLandmark('');
        setCity('');
        setState('');
        setWebsite('');
      }
    }, [OID]);

    const handleEditClick = (OID) => {
      navigate(`/ColCenMaster/${OID}`)
    };
  
  return (
    <>
  {showModal && (
    <div className="modal-backdrop show"></div>
  )}
    <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg p-3 mb-5 bg-white rounded">
            <div className="modal-header">
              <h5 className="modal-title">Success Message</h5>
            </div>
            <div className="modal-body">
              {successMessage && <p className='text-success'>{successMessage}</p>}
            </div>
          </div>
        </div>
    </div>
     <div className='container mt-3 '>
       <div className='shadow-sm p-3 mb-3 bg-body-tertiary rounded'>
       <h5 className='text-center c2'>{OID? 'Update Collection Center' : 'Create Collection Center'}</h5>
        <form className='form-container' onSubmit={handleSubmit}>
            <div className='row'>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Center Name:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={cName}  onChange={handleCNameChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Center Type:</label>
                        <select className="form-control" id="dropdown" name="gender" value={cType} onChange={handleCTypeChange}>
                    <option value="">Select an option</option>
                    {type.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                    </select>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Contact No:</label>
                        <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={cNo}  onChange={handleCNoChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Email:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={email}  onChange={handleEmailChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Landmark:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={landmark}  onChange={handleLandmarkChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">City:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={city}  onChange={handleCityChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">State:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={state}  onChange={handleStateChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Website:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={website}  onChange={handleWebsiteChange} required />
                    </div>
                </div>
            <div className='col-sm-12  text-center' style={{paddingLeft:'0'}}>
                <div>
                    <label  className='form-label text-white' htmlFor="title">:</label>
                    <button className={`btn ${OID ? 'btn-info' : 'btn-warning'}`} onClick={(e) => (OID ? handleSubmit(e) : handleReset())}>{OID? "Update" : "Reset"}</button>
                </div>
            </div>
          </div>
        </form>
       </div>
        <div className='d-felx scrollable-container mt-3'>
          <div className='card shadow p-3 pt-0 mb-5 rounded'>
            <div className='row'>
        <table className='table table-nowrap mb-0 scrollable-table mt-3 col-md-12'>
          <thead className='table-primary'>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Mobile No</th>
              <th>Email Id</th>
              <th>Address</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td>{item.CentreName}</td>
                <td>{item.CentreType}</td>
                <td>{item.Contact}</td>
                <td>{item.Email}</td>
                <td>{item.Line1 + ' ' + item.Line2 + ' ' + item.Line3}</td>
                <td><p className='badge badge-warning-lighten' onClick={() => handleEditClick(item.OID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></p></td>
              </tr>
            ))}
          </tbody>
        </table>
            </div>
          </div>
        </div>  
      </div>
    </>
  );
}
