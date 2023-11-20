import React, { useState, useEffect } from 'react';
import baseURL from './apiConfig';

export default function CTGroup() {
    const [data, setData] = useState([]);
    const [tGName, setTGName] = useState();
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
    const [options, setOptions] = useState([]); 
    const [, setError] = useState(null);
    const [isEdit, setIsEdit] = useState(false); 
    const [updatetGName, setUpdatetGName] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
  
  
    const handleTGNameChange = (e) => {
      setTGName(e.target.value);
    };
    const handleSelectChange = (e) => {
      const selectedValue = e.target.value;
      // console.log('Selected Value:', selectedValue);
      setSelectedOption(selectedValue);
      // Find the department object that matches the selected name.
      const selectedDepartment = options.find(option => option.name === selectedValue);
      if (selectedDepartment) {
        // console.log('Selected Department ID:', selectedDepartment.id);
        setSelectedDepartmentId(selectedDepartment.id); // Store the PK in state
      }
    };    
    const handleEditClick = (TgData) => {
      setIsEdit(true);
      setUpdatetGName(TgData);
      setTGName(TgData.TGName);
      setSelectedOption(TgData.DepartmentName)
      setSelectedDepartmentId(TgData.DPTID);
    }
    useEffect(() => {
      // Fetch the options from the server when the component loads
      fetchOptions();
    }, []);

    const fetchOptions = async () => {
      try {
        const response = await fetch(`${baseURL}/api/GetOptions`); // Replace with your actual API endpoint
        if (response.ok) {
          const data = await response.json();
          // Filter out objects with null Department values and extract only the Departments
          // console.log(data)
          const filteredOptions = data.recordset.filter(option => option.Department !== null).map(option => ({
            name: option.Department,
            id: option.DPTID, // Assuming DPTID is the primary key for departments
          }));
          setOptions(filteredOptions);
          console.log(filteredOptions) // Update the options state with the filtered data
        } else {
          console.error('Error fetching options');
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    
  
    const removeSuccessMessage = () => {
      setSuccessMessage('');
      setShowModal(false);
    };
    
    const handleSubmit = async (e) => {
      console.log('handleupload called');
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
      formData.append('TGName', tGName);
      formData.append('selectedOption', selectedDepartmentId); // Use the selectedDepartmentId state variable

      if(isEdit){
        try{
          const response = await fetch(`${baseURL}/api/UpdateTgData/${updatetGName.TGID}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ TGName: tGName, DPTID: selectedDepartmentId})
          });
          if(response.ok){
            setSuccessMessage('TGName Updated successfully.');
            setTGName('');
            setSelectedOption('');
            setIsEdit(false);
            setUpdatetGName({});
          } else {
            console.error('Error updating TGName');
          }
        } catch (error) {
          console.error('Error updating TGName:', error);
        }
      } else {
      try {
        const response = await fetch(`${baseURL}/api/TGForm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tGName, selectedDepartmentId }),
        });
    
        if (response.ok) {
          console.log('TGName Created successfully');
          setSuccessMessage('TGName Created successfully.');
          setTGName('');
          setSelectedOption('');
        } else {
          console.log("error in uploading")
        }
      } catch (error) {
        console.error('Error uploading', error);
      }
      setIsSubmitting(false);
    }
  }

    useEffect(() => {
      fetch(`${baseURL}/api/TGData`)
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

    const handleDelete = async (TGID) => {
      try {
        const response = await fetch(`${baseURL}/api/DeleteTest/${TGID}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // If the deletion was successful, update the UI by filtering out the deleted department
          setData((prevData) => prevData.filter(item => item.TGID !== TGID));
          setSuccessMessage('Test Deleted successfully.');
          setShowModal(true);
          setTimeout(() => {
            removeSuccessMessage();
          }, 1000);
        } else {
          console.error('Error deleting Test');
        }
      } catch (error) {
        console.error('Error deleting Test:', error);
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
       <h6 className='text-center c2'>{isEdit ? 'Update Test Group' : 'Create Test Group'}</h6>
        <form className='form-container row' onSubmit={handleSubmit}>
          <div className='col-md-5'>
            <label  className='form-label' htmlFor="title">Select Department:</label>
            <select className="form-control" id="dropdown" name="gender" value={selectedOption} onChange={handleSelectChange}>
               <option value="">Select an option</option>
               {options.map((option, index) => (
                   <option key={index} value={option.name}>
                       {option.name}
                   </option>
               ))}
            </select>
          </div>
          <div className='col-md-5'>
            <label  className='form-label' htmlFor="title">Test Group Name:</label>
            <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={tGName}  onChange={handleTGNameChange} required />
          </div>
          <div className='col-md-2'>
          <label  className='form-label text-white' htmlFor="title">:</label>
            <button className='btn btn-info' type="submit">{isEdit ? 'Update' : 'Create'}</button>
          </div>
        </form>
       </div>
        <div className='d-felx scrollable-container mt-3'>
          <div className='shadow pb-1 mb-5 rounded'>
          <table className='table scrollable-table'>
          <thead className='table-primary'>
            <tr>
              <th>Department</th>
              <th>Test Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td>{item.DepartmentName}</td>
                <td>{item.TGName}</td>
                <td><p className='badge badge-warning-lighten' onClick={() => handleEditClick(item)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></p></td>
                <td><p className='badge badge-danger-lighten' onClick={() => handleDelete(item.TGID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></p></td>
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
