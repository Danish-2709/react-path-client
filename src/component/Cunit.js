import React, { useState, useEffect } from 'react';
import baseURL from './apiConfig';

export default function Cunit() {
  const [data, setData] = useState([]);
  const [unitName, setUnitName] = useState();
  const [, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false); 
  const [updateUnit, setUpdateUnit] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  const handleUnitNameChange = (e) => {
    setUnitName(e.target.value);
  };

  const removeSuccessMessage = () => {
    setSuccessMessage('');
    setShowModal(false);
  };

  const handleEditClick = (unitData) =>{
    setIsEdit(true);
    setUpdateUnit(unitData);
    setUnitName(unitData.UnitName)
  }

  useEffect(() => {
    console.log('baseURL:', baseURL);
    fetch(`${baseURL}/api/UnitData`)
      .then(response => response.json())
      .then(data => {
        // Access the correct property that contains the data array
        const dataArray = data.recordset;
        if (Array.isArray(dataArray)) {
          // Ensure that dataArray is an array before mapping
          setData(dataArray);
        } else {
          console.error('Invalid data format from the API');
        }
      })
      .catch(error => {
        setError(error);
      });
  }, []); 
  
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
    formData.append('UnitName', unitName);
    if(isEdit){
      try{
        const response = await fetch(`${baseURL}/api/UpdateUnit/${updateUnit.UID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ UnitName: unitName })
        });
        if(response.ok){
          // console.log('Unit Name Created successfully');
          setSuccessMessage('Unit Name Updated successfully.');
          setUnitName('');
          setIsEdit(false);
          setUpdateUnit({});
        } else {
          console.error('Error updating Unit');
        }
      } catch (error) {
        console.error('Error updating Unit:', error);
      }
    } else{
    try {
      const response = await fetch(`${baseURL}/api/UnitForm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unitName }),
      });
  
      if (response.ok) {
        // console.log('Unit Name Created successfully');
        setSuccessMessage('Unit Name Created successfully.');
        setUnitName('');
      } else {
        console.log("error in uploading")
      }
    } catch (error) {
      console.error('Error uploading', error);
    }
    setIsSubmitting(false);
  }
}

  const handleDelete = async (UID) => {
    try {
      const response = await fetch(`${baseURL}/api/DeleteUnit/${UID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // If the deletion was successful, update the UI by filtering out the deleted department
        setData((prevData) => prevData.filter(item => item.UID !== UID));
        setSuccessMessage('Unit Deleted successfully.');
        setShowModal(true);
        setTimeout(() => {
          removeSuccessMessage();
        }, 2000);
      } else {
        console.error('Error deleting Unit');
      }
    } catch (error) {
      console.error('Error deleting Unit:', error);
    }
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
   <div className='shadow-sm p-3 mb-5 bg-body-tertiary rounded'>
      <h3 className='text-center c2'>{isEdit ? 'Update Unit' : 'Create Unit'}</h3>
      <div className='row'>
      <form className='form-container col-md-10'>
        <div>
          <label  className='form-label' htmlFor="title">Unit Name:</label>
          <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={unitName}  onChange={handleUnitNameChange} required />
        </div>
      </form>
        <div className='col-md-2'>
          <label  className='form-label text-white' htmlFor="title">:</label>
          <button className='btn btn-info' type="submit" onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</button>
        </div>
      </div>
      </div>
      <div className='d-felx scrollable-container mt-3'>
      <div className='shadow pb-1 mb-5 rounded'>
        <table className='table scrollable-table'>
          <thead className='table-light'>
            <tr>
              <th>Unit Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td>{item.UnitName}</td>
                <td><p className='badge badge-warning-lighten mx-2' onClick={() => handleEditClick(item)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></p>
                <p className='badge badge-danger-lighten mx-2' onClick={() => handleDelete(item.UID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></p></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </>
);
}
