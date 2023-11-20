import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import baseURL from './apiConfig';

export default function CRefMaster() {
    const { RID } = useParams();
    const [data, setData] = useState([]);
    const [, setClientdata] = useState([]);
    const [cName, setCName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [dob, setDob] = useState();
    const [mobile, setMobile] = useState();
    const [anniversery, setAnniversery] = useState();
    const [cCateg, setCCateg] = useState();
    const [special, setSpecial] = useState();
    const [routine, setRoutine] = useState();
    const [ecg, setEcg] = useState();
    const [ray, setRay] = useState();
    const [ultrasound, setUltrasound] = useState();
    const [address, setAddress] = useState();
    const [remarks, setRemarks] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
  
  
    const handleCNameChange = (e) => {
      setCName(e.target.value);
    };
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
    const handleDobChange = (e) => {
      setDob(e.target.value);
    };
    const handleMobileChange = (e) => {
      setMobile(e.target.value);
    };
    const handleAnniverseryChange = (e) => {
      setAnniversery(e.target.value);
    };
    const handleCCategChange = (e) => {
      setCCateg(e.target.value);
    };
    const handleSpecialChange = (e) => {
      setSpecial(e.target.value);
    };
    const handleRoutineChange = (e) => {
      setRoutine(e.target.value);
    };
    const handleEcgChange = (e) => {
      setEcg(e.target.value);
    };
    const handleRayChange = (e) => {
      setRay(e.target.value);
    };
    const handleUltrasoundChange = (e) => {
      setUltrasound(e.target.value);
    };
    const handleAddressChange = (e) => {
      setAddress(e.target.value);
    };
    const handleRemarksChange = (e) => {
      setRemarks(e.target.value);
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
      formData.append('email', email);
      formData.append('dob', dob);
      formData.append('mobile', mobile);
      formData.append('anniversery', anniversery);
      formData.append('cCateg', cCateg);
      formData.append('special', special);
      formData.append('routine', routine);
      formData.append('ecg', ecg);
      formData.append('ray', ray);
      formData.append('ultrasound', ultrasound);
      formData.append('address', address);
      formData.append('remarks', remarks);
     if(RID){
      try {
        const response = await fetch(`${baseURL}/api/EditClient/${RID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cName, email, password, dob, mobile, anniversery, cCateg, special, routine, ecg, ray, ultrasound, address, remarks}),
        });
    
        if (response.ok) {
          console.log('Client Updated successfully');
          setSuccessMessage('Client Updated successfully.');
          setCName('');
          setEmail('');
          setPassword('');
          setDob('');
          setMobile('');
          setAnniversery('');
          setCCateg('');
          setSpecial('');
          setRoutine('');
          setEcg('');
          setRay('');
          setUltrasound('');
          setAddress('');
          setRemarks('');
        } else {
          console.log("error in uploading")
        }
      } catch (error) {
        console.error('Error uploading', error);
      }
    } else {
       try {
         const response = await fetch(`${baseURL}/api/CRefMaster`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ cName, email, password, dob, mobile, anniversery, cCateg, special, routine, ecg, ray, ultrasound, address, remarks}),
         });
     
         if (response.ok) {
           console.log('Client Created successfully');
           setSuccessMessage('Client Created successfully.');
           setCName('');
           setEmail('');
           setPassword('');
           setDob('');
           setMobile('');
           setAnniversery('');
           setCCateg('');
           setSpecial('');
           setRoutine('');
           setEcg('');
           setRay('');
           setUltrasound('');
           setAddress('');
           setRemarks('');
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
      setEmail('');
      setPassword('');
      setDob('');
      setMobile('');
      setAnniversery('');
      setCCateg('');
      setSpecial('');
      setRoutine('');
      setEcg('');
      setRay('');
      setUltrasound('');
      setAddress('');
      setRemarks('');
    };

    const handleDelete = async (RID) => {
      try {
        const response = await fetch(`${baseURL}/api/DeleteClients/${RID}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // If the deletion was successful, update the UI by filtering out the deleted department
          setData((prevData) => prevData.filter(item => item.RID !== RID));
          setSuccessMessage('Patient Deleted successfully.');
          setShowModal(true);
          setTimeout(() => {
            removeSuccessMessage();
          }, 500);
        } else {
          console.error('Error deleting Patient');
        }
      } catch (error) {
        console.error('Error deleting Patient:', error);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    const fetchData = () => {
      fetch(`${baseURL}/api/ClientData`)
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
      if (RID) {
        console.log('Fetching data for TID:', RID);
        fetch(`${baseURL}/api/GetClients/${RID}`)
          .then((response) => response.json())
          .then((result) => {
            console.log('API response:', result);
            if (result && result.length > 0) {
              const clientdata = result[0]; // Access the first item in the array
    
              // Update state variables
              setClientdata(clientdata);
              setCName(clientdata.RName || '');
              setEmail(clientdata.Email || '');
              setPassword(clientdata.Pwd || '');
              setDob(clientdata.DOB ? clientdata.DOB.slice(0,10) : '');
              setMobile(clientdata.mobile || '');
              setAnniversery(clientdata.DOA ? clientdata.DOA.slice(0, 10) : '');
              setCCateg(clientdata.RefCat || '');
              setSpecial(clientdata.DSPL || '');
              setRoutine(clientdata.DRTN || '');
              setEcg(clientdata.DOTH || '');
              setRay(clientdata.DXRay || '');
              setUltrasound(clientdata.DUSG || '');
              setAddress(clientdata.RAddress || '');
              setRemarks(clientdata.Remarks || '');
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
        setEmail('');
        setPassword('');
        setDob('');
        setMobile('');
        setAnniversery('');
        setCCateg('');
        setSpecial('');
        setRoutine('');
        setEcg('');
        setRay('');
        setUltrasound('');
        setAddress('');
        setRemarks('');
      }
    }, [RID]);

    const handleEditClick = (RID) => {
      navigate(`/CRefMaster/${RID}`)
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
       <h5 className='text-center c2'>{RID? 'Update Client' : 'Create Client'}</h5>
        <form className='form-container' onSubmit={handleSubmit}>
            <div className='row'>
                <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Client Name:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={cName}  onChange={handleCNameChange} required />
                    </div>
                </div>
                <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Email/User Id:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={email}  onChange={handleEmailChange} required />
                    </div>
                </div>
                <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Password:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={password}  onChange={handlePasswordChange} required />
                    </div>
                </div>
                <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">DOB:</label>
                        <input  className='form-input'  name="newsTitle" type="date" id="newsTitle" value={dob}  onChange={handleDobChange} required />
                    </div>
                </div>
                <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Mobile:</label>
                        <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={mobile}  onChange={handleMobileChange} required />
                    </div>
                </div>
                <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Anniversery:</label>
                        <input  className='form-input'  name="newsTitle" type="date" id="newsTitle" value={anniversery}  onChange={handleAnniverseryChange} required />
                    </div>
                </div>
                <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Client Category:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={cCateg}  onChange={handleCCategChange} required />
                    </div>
                </div>
                <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Special in %:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={special}  onChange={handleSpecialChange} required />
                    </div>
                </div>
                <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Routine in %:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={routine}  onChange={handleRoutineChange} required />
                    </div>
                </div>
          <div className='col-md-2'>
          <div>
            <label  className='form-label' htmlFor="title">Ecg in rs:</label>
            <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={ecg}  onChange={handleEcgChange} required />
          </div>
          </div>
          <div className='col-md-2'>
          <div>
            <label  className='form-label' htmlFor="title">X-ray in rs:</label>
            <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={ray}  onChange={handleRayChange} required />
          </div>
          </div>
          <div className='col-md-2'>
          <div>
            <label  className='form-label' htmlFor="title">Ultrasound in rs:</label>
            <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={ultrasound}  onChange={handleUltrasoundChange} required />
          </div>
          </div>
          <div className='col-md-5'>
          <div>
            <label  className='form-label' htmlFor="title">Address:</label>
            <textarea  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={address}  onChange={handleAddressChange} required ></textarea>
          </div>
          </div>
          <div className='col-md-5'>
          <div>
            <label  className='form-label' htmlFor="title">Remarks:</label>
            <textarea  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={remarks}  onChange={handleRemarksChange} required ></textarea>
          </div>
          </div>
          <div className='col-md-1 ' style={{ paddingRight: '0'}}>
                <div>
                    <label  className='form-label text-white' htmlFor="title">:</label>
                    <button className='btn btn-info'>{RID? "Update" : "Create"}</button>
                </div>
            </div>
            <div className='col-sm-1' style={{paddingLeft:'0'}}>
                <div>
                    <label  className='form-label text-white' htmlFor="title">:</label>
                    <button className='btn btn-warning' onClick={handleReset}>Reset</button>
                </div>
            </div>
          </div>
        </form>
       </div>
        <div className='d-felx scrollable-container mt-3'>
          <div className='card shadow p-3 mb-5 rounded'>
          <h6 className='text-center'>View Client's</h6>
            <div className='row'>
        <table className='table table-nowrap mb-0 scrollable-table mt-3 col-md-12'>
          <thead className='table-primary'>
            <tr>
              <th>Patient Name</th>
              <th>Email Id</th>
              <th>Mobile No</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td>{item.RName}</td>
                <td>{item.Email}</td>
                <td>{item.mobile}</td>
                <td><p className='badge badge-warning-lighten' onClick={() => handleEditClick(item.RID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></p></td>
                <td><p className='badge badge-danger-lighten' onClick={() => handleDelete(item.RID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></p></td>
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
