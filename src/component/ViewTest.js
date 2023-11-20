import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import baseURL from './apiConfig';

export default function ViewTest() {
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedTGNameId, setSelectedTGNameId] = useState('');
    const [options, setOptions] = useState([]); 
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const removeSuccessMessage = () => {
      setSuccessMessage('');
      setShowModal(false);
    };

    const handlefilterDataChange = (e) => {
      const selectedValue = e.target.value;
      // console.log('Selected Value:', selectedValue);
      setSelectedOption(selectedValue);
      const selectedTGName = options.find(option => option.name === selectedValue);
      if (selectedTGName) {
      console.log('Selected selectedTGName ID:', selectedTGName.id);
      setSelectedTGNameId(selectedTGName.id); 
      }
    };  

    useEffect(() => {
      fetchOptions();
    }, []);

    const fetchOptions = async () => {
      try {
        const response = await fetch(`${baseURL}/api/CSGData`); 
        if (response.ok) {
          const data = await response.json();
          // console.log(data)
          const filteredOptions = data.recordset.filter(option => option.SGName !== null).map(option=> ({
            name: option.SGName,
            id: option.SGID, 
          }));
          setOptions(filteredOptions);
        //   console.log(filteredOptions) 
        } else {
          console.error('Error fetching options');
        }
      } catch (error) {
          console.error('Error fetching options:', error);
        }
    };

    const handleReset = () => {
      setSelectedOption('');
    };

    const handleStatusChange = (clickedItem) => {
      const newStatus = clickedItem.Tcheck === 'Yes' ? 'No' : 'Yes';
      const updatedStatus = data.map(item =>
        item.TID === clickedItem.TID ? { ...item, Tcheck: newStatus } : item
      );
      setData(updatedStatus);
    
      fetch(`${baseURL}/api/testStatus`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ TID: clickedItem.TID, newStatus })
      })      
        .then(response => response.json())
        .then(data => console.log('Status updated:', data))
        .catch(error => console.error('Error updating status:', error));
    };
    
    const handleSLNoUpdate = (TID, newSLNo) => {
      fetch(`${baseURL}/api/updateSLno`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ TID, newSLNo}),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessage('RValue updated successfully.');
        } else {
          setSuccessMessage('Failed to update RValue.');
        }
      });
    };

    const handleEditClick = (TID, TestType) => {
      let destinationRoute = '';

      switch (TestType) {
        case 'NORMAL RANGE':
          destinationRoute = `/CTNRange/${TID}`;
          break;
        case 'AGE WISE RANGE':
          destinationRoute = `/CAWRange/${TID}`;
          break;
        case 'DESCRIPTIVE RANGE':
          destinationRoute = `/CDRange/${TID}`;
          break;
        case 'TEST WITH LIST OF VALUES':
          destinationRoute = `/CTWLValue/${TID}`;
          break;
        case 'RADIOLOGY':
          destinationRoute = `/CRadiology/${TID}`;
          break;
        default:
          // Handle the default case or unrecognized Test Type
          break;
      }
      console.log('Destination Route:', destinationRoute);
  
      // Navigate to the determined route
      if (destinationRoute) {
        navigate(destinationRoute);
      } else {
        console.warn('Unrecognized Test Type:', TestType);
      }
    };

    const handleDelete = async (TID) => {
      try {
        const response = await fetch(`${baseURL}/api/DeleteTests/${TID}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // If the deletion was successful, update the UI by filtering out the deleted department
          setData((prevData) => prevData.filter(item => item.TID !== TID));
          setSuccessMessage('Tests Deleted successfully.');
          setShowModal(true);
          setTimeout(() => {
            removeSuccessMessage();
          }, 500);
        } else {
          console.error('Error deleting Tests');
        }
      } catch (error) {
        console.error('Error deleting Tests', error);
      }
    };

    const filterTest = async (e) => {
      e.preventDefault();
        try {
          const response = await fetch(`${baseURL}/api/getFilteredTestData`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedTGNameId }),
          });
  
          if (response.ok) {
            const filteredData = await response.json();
            if (Array.isArray(filteredData)) {
              setData(filteredData);
            } else {
              console.error('Filtered data is not an array:', filteredData);
            }
          } else {
            console.error('Error fetching filtered data');
          }
        } catch (error) {
          console.error('Error fetching filtered data:', error);
        }
    };  

    useEffect(() => {
        fetch(`${baseURL}/api/getTest`)
        .then(response => response.json())
        .then(data => {
            const dataArray = data.recordset
            if(Array.isArray(dataArray)){
                setData(dataArray)
            }else {
                console.error('Invalid data format from the API');
              }
            })
            .catch(error => {
              
            });
    }, []); 
    
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
<div>
<div className='shadow-sm p-3 mb-3 bg-body-tertiary rounded'>
    <form>
        <div className='row'>
            <div className='col-md-10'>
                <div>
                    <label  className='form-label' htmlFor="title">Sub Group Name:</label>
                    <input  className='form-input' type="text" id="SGroupName" name='SGroupName' value={selectedOption}  onChange={handlefilterDataChange} list="testNameOptions" placeholder="Type to search..." />
                    <datalist id="testNameOptions">
                      {options.map((option, index) => (
                           <option key={index} value={option.name}>
                               {option.name}
                           </option>
                       ))}
                    </datalist>
                </div>
            </div>
            <div className='col-md-1'>
                <div>
                    <label  className='form-label text-white' htmlFor="title">:</label>
                    <button className='btn btn-info' onClick={filterTest}>Filter</button>
                </div>
            </div>
            <div className='col-md-1'>
                <div>
                    <label  className='form-label text-white' htmlFor="title">:</label>
                    <button className='btn btn-warning' onClick={handleReset}>Reset</button>
                </div>
            </div>
        </div>
    </form>
  </div>
<div className='d-felx scrollable-container form-container'>
  <h5 className='text-center'>View Test</h5>
  <div className='shadow mb-5  rounded'>
        <table className='table table-nowrap mb-0  scrollable-table mp-0'>
          <thead className='table-primary'>
            <tr>
              <th>Sub Group Name</th>
              <th>Test Parameter</th>
              <th>Method Name</th>
              <th>Unit Name</th>
              <th>Test Type</th>
              <th>PSL No</th>
              <th>Test Check</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td>{item.groupname}</td>
                <td>{item.TName}</td>
                <td>{item.Method}</td>
                <td>{item.UName}</td>
                <td>{item.TestType}</td>
                <td><input className='form-input' style={{border: 'none', width: '30%'}} type="text" 
                defaultValue={item.PSLNo || ''} 
                onChange={(e) => { handleSLNoUpdate(item.TID, e.target.value); }} />
                </td>
                <td>
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id={`flexSwitchCheck_${item.TID}`}
                      defaultChecked={item.TCheck === 'Yes'}
                      onChange={() => handleStatusChange(item)}
                    />
                  </div>
                </td>
                <td><p  className='badge badge-warning-lighten' onClick={() => handleEditClick(item.TID, item.TestType)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></p></td>
                <td><p className='badge badge-danger-lighten' onClick={() => handleDelete(item.TID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></p></td>
              </tr>
            ))}
          </tbody>
        </table>
  </div>
  </div>
</div>
    </>
  )
}
