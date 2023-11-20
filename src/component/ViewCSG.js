import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import baseURL from './apiConfig';

export default function ViewCSG() {
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedTNameId, setSelectedTNameId] = useState('');
    const [options, setOptions] = useState([]); 
    const [selectedItems, setSelectedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const removeSuccessMessage = () => {
      setSuccessMessage('');
      setShowModal(false);
    };

    const handleEditClick = (SGID) => {
      navigate(`/EditCSG/${SGID}`)
    };
  
    const handlefilterDataChange = (e) => {
      const selectedValue = e.target.value;
      // console.log('Selected Value:', selectedValue);
      setSelectedOption(selectedValue);
      const selectedTName = options.find(option => option.name === selectedValue);
      if (selectedTName) {
      console.log('Selected selectedTGName ID:', selectedTName.id);
      setSelectedTNameId(selectedTName.id); 
      }
    }

    useEffect(() => {
      fetchOptions();
    }, []);

    const fetchOptions = async () => {
      try {
        const response = await fetch(`${baseURL}/api/GetTGName`); 
        if (response.ok) {
          const data = await response.json();
          // console.log(data)
          const filteredOptions = data.recordset.filter(option => option.SGName !== null).map(option=> ({
            name: option.TGName,
            id: option.TGID, 
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

    const handleRateUpdate = (SGID, newRate) => {
      fetch(`${baseURL}/api/updateRate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({SGID, newRate}),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
            setSuccessMessage('Rates updated successfully.');
          } else {
            setSuccessMessage('Failed to update rates.');
          }
      });
    };
    
    const handleDelete = async (SGID) => {
      try {
        const response = await fetch(`${baseURL}/api/DeleteSubGroup/${SGID}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // If the deletion was successful, update the UI by filtering out the deleted department
          setData((prevData) => prevData.filter(item => item.SGID !== SGID));
          setSuccessMessage('Sub Group Deleted successfully.');
          setShowModal(true);
          setTimeout(() => {
            removeSuccessMessage();
          }, 500);
        } else {
          console.error('Error deleting Sub Group');
        }
      } catch (error) {
        console.error('Error deleting Sub Group:', error);
      }
    };

    const filterTest = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${baseURL}/api/getFilteredSGDetails`, {
          method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedTNameId }),
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
        fetch(`${baseURL}/api/CSGData`)
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
                    <label  className='form-label' htmlFor="title">Group Name:</label>
                    <input  className='form-input' type="text" id="fromDate" name='fromDate' value={selectedOption}  onChange={handlefilterDataChange} list="testNameOptions" placeholder="Type to search..." />
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
<div className='d-felx scrollable-container form-container mt-1'>
  <div className='shadow pb-0 mb-5 rounded'>
  <h5 className='text-center'>View Sub Group</h5>
        <table className='table scrollable-table mt-3'>
          <thead className='table-primary'>
            <tr>
              <th>Group Name</th>
              <th>Test Name</th>
              <th>Test Type</th>
              <th>Test Category</th>
              <th>Sample Type</th>
              <th>Test Code</th>
              <th>Rate</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td style={{textAlign: 'left'}}>{item.TestName}</td>
                <td style={{textAlign: 'left'}}>{item.SGSName}</td>
                <td>{item.TType}</td>
                <td>{item.SGType}</td>
                <td>{item.SampleName}</td>
                <td>{item.TestCode}</td>
                <td><input style={{border: 'none', width: '30%'}} type="text" defaultValue={item.Charges || ''} onChange={(e) => { handleRateUpdate(item.SGID, e.target.value); }} /></td>
                <td><p className='badge badge-warning-lighten' onClick={() => handleEditClick(item.SGID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></p></td>
                <td><p className='badge badge-danger-lighten' onClick={() => handleDelete(item.SGID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></p></td>
              </tr>
            ))}
          </tbody>
        </table>
  </div>
</div>
<div>
</div>
 </div>
    </>
  )
}
