import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import baseURL from './apiConfig';
import { useSession } from './SessionContext';

export default function CUserLogin() {
    const { userLoginType, setUserLoginType, oID, setOID } = useSession();
    const [data, setData] = useState([]);
    const [frmData, setFrmData] = useState([]);
    const [cType, setCType] = useState();
    const type = ['Admin', 'User']
    const [uName, setUName] = useState();
    const [password, setPassword] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedFRMID, setSelectedFRMID] = useState(null);
    const [selectedfrmSNo, setSelectedFrmSNo] = useState(null);
    const [newARec, setNewARec] = useState(null);
    const [newURec, setNewURec] = useState(null);
    const [newDRec, setNewDRec] = useState(null);
    const [newVRec, setNewVRec] = useState(null);
    const [newPRec, setNewPRec] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        var loginType = document.cookie.replace(/(?:(?:^|.*;\s*)loginType\s*=\s*([^;]*).*$)|^.*$/, "$1");
        var oID = document.cookie.replace(/(?:(?:^|.*;\s*)oID\s*=\s*([^;]*).*$)|^.*$/, "$1");
    
        if (loginType && oID) {
          setUserLoginType(loginType);
          setOID(oID);
        }
    }, []);

    const handleCTypeChange = (e) => {
      setCType(e.target.value);
    };
    const handleUNameChange = (e) => {
      setUName(e.target.value);
    };
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };  
    const removeSuccessMessage = () => {
      setSuccessMessage('');
      setShowModal(false);
    };

    const handleCheckboxChange = (FRMID, frmSNo) => {
      setSelectedFRMID(FRMID);
      setSelectedFrmSNo(frmSNo);
      console.log(FRMID)
      console.log(frmSNo)
    };

    const handleAddNewRecordChange = (newARec) => {
      setNewARec(newARec);
      console.log(newARec)
    };
    const handleUpdateRecordChange = (newURec) => {
      setNewURec(newURec);
      console.log(newURec)
    };
    const handleDeleteRecordChange = (newDRec) => {
      setNewDRec(newDRec);
      console.log(newDRec)
    };
    const handleViewRecordChange = (newVRec) => {
      setNewVRec(newVRec);
      console.log(newVRec)
    };
    const handlePrintRecordChange = (newPRec) => {
      setNewPRec(newPRec);
      console.log(newPRec)
    };
    
    const handleSubmit = async (e) => {
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
        formData.append('cType', cType);
        formData.append('uName', uName);
        formData.append('password', password);
        formData.append('userLoginType', userLoginType);
        formData.append('newARec', newARec);
        formData.append('newURec', newURec);
        formData.append('newDRec', newDRec);
        formData.append('newVRec', newVRec);
        formData.append('newPRec', newPRec);
      
        try {
          const response = await fetch(`${baseURL}/api/frmRecords`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
        body: JSON.stringify({cType, uName, password, userLoginType, selectedFRMID, selectedfrmSNo, oID, newARec, newURec, newDRec, newVRec, newPRec}),
          });
      
          if (response.ok) {
            console.log('Center Created successfully');
            setSuccessMessage('Center Created successfully.');
            setCType('');
            setUName('');
            setPassword('');
          } else {
            console.log('Error in uploading');
          }
        } catch (error) {
          console.error('Error uploading', error);
        }
        setIsSubmitting(false);
    };

    useEffect(() => {
        fetchData();
        fetchFormData();
      }, []);

    const fetchData = () => {
      fetch(`${baseURL}/api/logInDetails`)
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

    const fetchFormData = () => {
      fetch(`${baseURL}/api/formDetails`)
        .then((response) => response.json())
        .then((frmData) => {
          if (Array.isArray(frmData.recordset)) {
            setFrmData(frmData.recordset);
          } else {
            console.error('Invalid data format from the API');
          }
        //   console.log("formData", frmData);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const handleResult = (LoginID) => {
      navigate(`/UUserLogin/${LoginID}`)
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
     <div className='mt-3 '>
       <div className='shadow-sm p-3 mb-3 bg-body-tertiary rounded'>
       <h5 className='text-center c2'>Create Login</h5>
        <form className='form-container'>
            <div className='row'>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Category:</label>
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
                        <label  className='form-label' htmlFor="title">Username:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={uName}  onChange={handleUNameChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Password:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={password}  onChange={handlePasswordChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                <div>
                    <label  className='form-label text-white' htmlFor="title">:</label>
                    <button className='btn btn-info' onClick={handleSubmit}>Create</button>
                </div>
            </div>
          </div>
        </form>
       </div>
       <div className='Drow'>
        <div className='col-md-4 px-1'>
        <div className='shadow-sm p-3 mb-3 bg-body-tertiary rounded'>
       <div className='Drow'>
       <table className='table table-nowrap mb-0 scrollable-table mt-3 col-md-12'>
            <thead className='table-primary'>
                <tr>
                  <th>Name</th>
                  <th>Password</th>
                  <th>View</th>
                </tr>
            </thead>
            <tbody className='text-center'>
                {data.map((item, index) => (
                    <tr key={index} className='text-center'>
                      <td>{item.LoginName}</td>
                      <td>{item.Password}</td>
                      <td><a className='badge badge-info-lighten' onClick={() => handleResult(item.LoginID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16"><path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/><path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/></svg></a></td>
                    </tr>
                 ))}
            </tbody>
        </table>
        </div>
    </div>
    </div>
    <div className='col-md-8'>
    <div className='shadow-sm p-3 mb-3 bg-body-tertiary rounded'>
       <div className='Drow'>
       <table className='table table-nowrap mb-0 scrollable-table mt-3 col-md'>
            <thead className='table-primary'>
                <tr>
                  <th>Select</th>
                  <th>Form Name</th>
                  <th>Add New Record</th>
                  <th>Update Record</th>
                  <th>Delete Record</th>
                  <th>View Record</th>
                  <th>Print Record</th>
                </tr>
            </thead>
            <tbody className='text-center'>
                {frmData.map((item, index) => (
                    <tr key={index} className='text-center'>
                      <td><input type="checkbox" onChange={() => handleCheckboxChange(item.FRMID, item.frmSNo)}/></td>
                      <td>{item.FormName}</td>
                      <td><input type="checkbox" defaultChecked={item.AddNewRecord === 1} onChange={() => handleAddNewRecordChange(item.AddNewRecord === 0 ? 1 : 0) } /></td>
                      <td><input type="checkbox" defaultChecked={item.UpdateRecord === 1} onChange={() => handleUpdateRecordChange(item.UpdateRecord === 0 ? 1 : 0) }/></td>
                      <td><input type="checkbox" defaultChecked={item.DeleteRecord === 1} onChange={() => handleDeleteRecordChange(item.DeleteRecord === 0 ? 1 : 0) }/></td>
                      <td><input type="checkbox" defaultChecked={item.ViewRecord === 1} onChange={() =>  handleViewRecordChange(item.ViewRecord === 0 ? 1 : 0) }  /></td>
                      <td><input type="checkbox" defaultChecked={item.PrintRecord === 1} onChange={() => handlePrintRecordChange(item.PrintRecord === 0 ? 1 : 0) } /></td>
                    </tr>
                 ))}
            </tbody>
         </table>
        </div>
    </div>
</div>
</div> 
      </div>
    </>
  );
}

