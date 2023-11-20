import React, { useState, useEffect } from 'react';
import baseURL from './apiConfig';
import { useSession } from './SessionContext';

export default function Cdepart() {
  const { userLoginType, setUserLoginType } = useSession();
  const [data, setData] = useState([]);
  const [department, setDepartment] = useState('');
  const [, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false); 
  const [updateDepartment, setEditDepartmentData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    var userLoginType = document.cookie.replace(/(?:(?:^|.*;\s*)userLoginType\s*=\s*([^;]*).*$)|^.*$/, "$1");

    if (userLoginType) {
      setUserLoginType(userLoginType);
    }
  }, [setUserLoginType]);


  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  const removeSuccessMessage = () => {
    setSuccessMessage('');
    setShowModal(false);
  };

  const handleEditClick = (deptData) => {
    // Set edit mode to true and populate the edit data
    setIsEdit(true);
    setEditDepartmentData(deptData);
    // Populate form field with department name
    setDepartment(deptData.Department);
    // console.log('Edit data:', deptData);
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
    }, 1000); 
  
    const formData = new FormData();
    formData.append('Department', department);
    formData.append('userLoginType', userLoginType);

    if (isEdit) {
      try {
        const response = await fetch(`${baseURL}/api/UpdateDepartment/${updateDepartment.DPTID}`, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ department, userLoginType }),
        });
  
        if (response.ok) {
          // console.log('Department Updated successfully');
          setSuccessMessage('Department Updated successfully.');
          setDepartment('');
          setIsEdit(false); 
          setEditDepartmentData({}); 
          fetchData();
        } else {
          console.error('Error updating department');
        }
      } catch (error) {
        console.error('Error updating department:', error);
      }
    } else {
      try {
        const response = await fetch(`${baseURL}/api/DepartForm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ department, userLoginType }),
        });

        if (response.ok) {
          console.log('Department Created successfully');
          setSuccessMessage('Department Created successfully.');
          setDepartment('');
          fetchData();
        } else {
          console.error('Error creating department');
        }
      } catch (error) {
        console.error('Error creating department:', error);
      }
    }

    setIsSubmitting(false);
  };

  const fetchData = () => {
    fetch(`${baseURL}/api/DepartData`)
      .then(response => response.json())
      .then(data => {
        const dataArray = data.recordset;
        if (Array.isArray(dataArray)) {
          setData(dataArray);
        } else {
          console.error('Invalid data format from the API');
        }
      })
      .catch(error => {
        setError(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []); 

  const handleDelete = async (DPTID) => {
    try {
      const response = await fetch(`${baseURL}/api/DeleteDepartment/${DPTID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // If the deletion was successful, update the UI by filtering out the deleted department
        setData((prevData) => prevData.filter(item => item.DPTID !== DPTID));
        setSuccessMessage('Department Deleted successfully.');
        setShowModal(true);
        setTimeout(() => {
          removeSuccessMessage();
        }, 2000);
      } else {
        console.error('Error deleting department');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
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
      <div className='shadow-lg p-3 mb-5 bg-body-tertiary rounded'>
      <h3 className='text-center c2'>{isEdit ? 'Update Department' : 'Create Department'}</h3>
      <div className='row'>
      <form className='form-container col-md-10'>
        <div>
          <label  className='form-label' htmlFor="title">Department Name:</label>
          <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={department}  onChange={handleDepartmentChange} required />
        </div>
      </form>
        <div className='col-md-2'>
          <label  className='form-label text-white' htmlFor="title">:</label>
          <button className='btn btn-info' type="submit" onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</button>
        </div>
      </div>
      </div>
      <div className='d-felx scrollable-container mt-3'>
     <div className='shadow pb-2 mb-5 rounded'>
     <table className='table scrollable-table'>
          <thead className='table-light'>
            <tr>
              <th>Department Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td>{item.Department}</td>
                <td><p className='badge badge-warning-lighten mx-2' onClick={() => handleEditClick(item)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></p>
                <p className='badge badge-danger-lighten mx-2' onClick={() => handleDelete(item.DPTID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></p></td>
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
