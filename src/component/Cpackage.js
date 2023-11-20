import React, { useState, useEffect } from 'react';
import baseURL from './apiConfig';

export default function Cpackage() {
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedSGNameId, setSelectedSGNameId] = useState('');
    const [options, setOptions] = useState([]); 
    const [selectedData, setSelectedData] = useState([]);
    const [selectedTestIds, setSelectedTestIds] = useState([]);
    const [selectedSGData, setSelectedSGData] = useState([]);
    const [, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
  
    const handleSelectChange = async (e) => {
      const selectedValue = e.target.value;
      // console.log('Selected Value:', selectedValue);
      setSelectedOption(selectedValue);
      // Find the department object that matches the selected name.
      const selectedSGName = options.find(option => option.name === selectedValue);
      if (selectedSGName) {
      // console.log('Selected selectedSGName ID:', selectedTGName.id);
        setSelectedSGNameId(selectedSGName.id); // Store the PK in state
      }
      try {
        const response = await fetch(`${baseURL}/api/SecnSGData/${selectedSGName.id}`);
        if (response.ok) {
          const data = await response.json();
          const dataArray = data.recordset;
          if (Array.isArray(dataArray)) {
            // Update the state with the fetched data
            setSelectedSGData(dataArray);
          } else {
            console.error('Invalid data format from the API');
          }
        } else {
          console.error('Error fetching data based on SGID');
        }
      } catch (error) {
        console.error('Error fetching data based on SGID:', error);
      }
    }; 
    useEffect(() => {
      // Fetch the options from the server when the component loads
    fetchOptions();
    }, []);

    const fetchOptions = async () => {
      try {
        const response = await fetch(`${baseURL}/api/GetSGName`); 
        if (response.ok) {
          const data = await response.json();
          // console.log(data)
          const filteredOptions = data.recordset.filter(option => option.SGName !== null).map(option => ({
            name: option.SGName,
            id: option.SGID, 
          }));
          setOptions(filteredOptions);
          //console.log(filteredOptions) 
        } else {
          console.error('Error fetching options');
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    useEffect(() => {
      fetch(`${baseURL}/api/SGData`)
        .then(response => response.json())
        .then(data => {
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

    const toggleSelectData = (clickedItem) =>{
      setSelectedData((prevSelectedData) => {
        if (prevSelectedData.some(data => data.SGID === clickedItem.SGID)) {
          return prevSelectedData.filter(item => item.SGID !== clickedItem.SGID);
        } else {
          return [...prevSelectedData, clickedItem];
        }
      });
      setSelectedTestIds((prevSelectedTestIds) => {
        if (prevSelectedTestIds.includes(clickedItem.SGID)) {
          return prevSelectedTestIds.filter(id => id !== clickedItem.SGID);
        } else {
          return [...prevSelectedTestIds, clickedItem.SGID];
        }
      });
    }

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
      if (!selectedOption) {
       alert('Please Select An Options!')
        return;
      }    
      if (!selectedTestIds.length) {
    alert('Please select at least one test!');
    return;
  }
       
      setIsSubmitting(true); 
      setSuccessMessage('Package Added successfully.');
      setShowModal(true);
      setTimeout(() => {
        removeSuccessMessage();
      }, 2000); 
  
      const formData = new FormData();
      formData.append('selectedOption', selectedSGNameId);
      formData.append('selectedData', selectedTestIds);
      try {
        const response = await fetch(`${baseURL}/api/CpackForm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selectedSGNameId, selectedTestIds }),
        });
    
        if (response.ok) {
          console.log('Package Added successfully');
        } else {
          console.log("error in uploading")
        }
      } catch (error) {
        console.error('Error uploading', error);
      }
      setIsSubmitting(false);
    }

    const handleDelete = async (PKGID) => {
      try {
        const response = await fetch(`${baseURL}/api/DeletePackage/${PKGID}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // If the deletion was successful, update the UI by filtering out the deleted department
          setSelectedSGData((prevData) => prevData.filter(item => item.PKGID !== PKGID));
          setSuccessMessage('Package Deleted successfully.');
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
        <h5 className='text-center'>Add To Package</h5>
        <div className='row'>
       <div className='col-md-10'>
       <form className='form-container'>
          <div>
            <label  className='form-label' htmlFor="title">Package Name:</label>
                <select className="form-control" id="dropdown" name="gender" value={selectedOption} onChange={handleSelectChange} required>
                 <option value="">Select an option</option>
                 {options.map((option, index) => (
                     <option key={index} value={option.name}>
                         {option.name}
                     </option>
                 ))}
                </select>
          </div>
        </form>
       </div>
          <div className=' col-md-2'>
            <label  className='form-label text-white' htmlFor="title">:</label>
            <button className='btn btn-info' type="submit" onClick={handleSubmit}>Add Test</button>
          </div>
        <div className='col-md-6 mt-3'>
        <div className='d-felx scrollable-container'>
        <div className='shadow pb-0 mb-5 rounded'>
          <table className='table scrollable-table'>
          <thead className='table-primary'>
            <tr>
              <th>Test Name</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {selectedSGData.map((item, index) => (
              <tr key={index} className='text-center'>
                <td>{item.SGName}</td>
                <td><p className='badge badge-danger-lighten' onClick={() => handleDelete(item.PKGID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></p></td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
        </div>
        </div>
        <div className='col-md-6 mt-3'>
        <div className='d-felx scrollable-container'>
        <div className='shadow pb-0 mb-5 rounded'>
        <table className='table scrollable-table'>
          <thead className='table-primary'>
            <tr>
              <th>Select</th>
              <th>Test Name</th>
              <th>Rate</th>
              <th>Test Type</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td><input type="checkbox" checked={selectedData.some(selData => selData.SGID === item.SGID)} onChange={() => toggleSelectData(item)} /></td>
                <td>{item.SGName}</td>
                <td>{item.Charges}</td>
                <td>{item.TType}</td>
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
