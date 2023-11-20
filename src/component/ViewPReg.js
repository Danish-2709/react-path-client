import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import baseURL from './apiConfig';

export default function ViewPReg() {
    const [data, setData] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [cCen, setCCen] = useState('');
    const [selectedStatus, setSelectedStatus] = useState([]);
    const status = ['Done', 'Cancel'];
    const [selectedRefferal, setSelectedRefferal] = useState('');
    const [selectedRefferalId, setselectedRefferalId] = useState([]);
    const [refferal, setRefferal] = useState([]);
    const navigate = useNavigate();

    const handlefromDateChange = (e) => {
      setFromDate(e.target.value);
    }
    const handletoDateChange = (e) => {
      setToDate(e.target.value);
    }
    const handleCCenChange = (e) => {
      setCCen(e.target.value);
    };

    const handleRefferalChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedRefferal(selectedValue);
        const selectedRName = refferal.find(option => option.name === selectedValue);
        if (selectedRName) {
        console.log('Selected selectedRName ID:', selectedRName.id);
        setselectedRefferalId(selectedRName.id); 
        }
    };

    const handleStatusChange = (e) => {
      setSelectedStatus(e.target.value);
    };

    useEffect(() => {
        fetchRefferal();
    }, [] );

    const fetchRefferal = async () => {
      try {
        const response = await fetch(`${baseURL}/api/fetchRefferal`); 
        if (response.ok) {
          const data = await response.json();
          // console.log(data)
          const filteredOptions = data.recordset.filter(option => option.RName !== null).map(option=> ({
            name: option.RName,
            id: option.RID, 
          }));
          setRefferal(filteredOptions);
          // console.log(filteredOptions) 
        } else {
          console.error('Error fetching options');
        }
      } catch (error) {
          console.error('Error fetching options:', error);
        }
    };

    const handleEditClick = (RFIID) => {
        navigate(`/CPRegistration/${RFIID}`)
    };

    const handleResult = (RFIID) => {
        navigate(`/CResult/${RFIID}`)
    };

    const handleReset = () => {
        setFromDate('');
        setToDate('');
        setCCen('');
        setSelectedRefferal([]);
        setselectedRefferalId('');
        setSelectedStatus('');
    };

    useEffect(() => {
        // Create an object with the filter criteria
        const filterCriteria = {
          fromDate,
          toDate,
          cCen,
          selectedRefferalId,
          selectedStatus,
        };
    
        const filterData = async () => {
          try {
            const response = await fetch(`${baseURL}/api/getFilteredPDetails`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(filterCriteria),
            });
    
            if (response.ok) {
              const filteredData = await response.json();
              setData(filteredData);
            } else {
              console.error('Error fetching filtered data');
            }
          } catch (error) {
            console.error('Error fetching filtered data:', error);
          }
        };
    
        filterData(); // Call the filtering function
      }, [fromDate, toDate, cCen, selectedRefferalId, selectedStatus]);
    

    // const handleCancel = async (RFIID) => {
    //   try {
    //     const response = await fetch(`${baseURL}/api/DeletePDetails/${RFIID}`, {
    //       method: 'PUT',
    //     });

    //     if (response.ok) {
    //       // If the deletion was successful, update the UI by filtering out the deleted department
    //       setData((prevData) => prevData.filter(item => item.RFIID !== RFIID));
    //       setSuccessMessage('Patient Details Canceld successfully.');
    //       setShowModal(true);
    //       setTimeout(() => {
    //         removeSuccessMessage();
    //       }, 500);
    //     } else {
    //       console.error('Error deleting Sub Group');
    //     }
    //   } catch (error) {
    //     console.error('Error deleting Sub Group:', error);
    //   }
    // };
    
     useEffect(() => {
        fetch(`${baseURL}/api/getPDetails`)
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
              console.error('Invalid data format from the API');
            });
        }, []); 

   
  return (
    <>
<div>
  <div className='container'>
    <div className='shadow-sm p-3 mb-3 bg-body-tertiary rounded'>
    <h5 className='text-center'>View Patient Details</h5>
    <form>
        <div className='row'>
            <div className='col-md-2'>
                <div>
                    <label  className='form-label' htmlFor="title">From Date:</label>
                    <input  className='form-input' type="Date" id="fromDate" name='fromDate' value={fromDate}  onChange={handlefromDateChange} required />
                </div>
            </div>
            <div className='col-md-2'>
                <div>
                    <label  className='form-label' htmlFor="title">TO Date:</label>
                    <input  className='form-input' type="Date"  name="toDate" id="toDate"  value={toDate} onChange={handletoDateChange} required />
                </div>
            </div>
            <div className='col-md-2'>
                <div>
                    <label  className='form-label' htmlFor="title">Collection Center:</label>
                    <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={cCen}  onChange={handleCCenChange} required />
                </div>
            </div>
            <div className='col-md-2'>
                <div>
                    <label  className='form-label' htmlFor="title">Client:</label>
                    <select className="form-control" id="dropdown" name="gender" value={selectedRefferal} onChange={handleRefferalChange}>
                    <option value="">Select an option</option>
                    {refferal.map((option, index) => (
                        <option key={index} value={option.name}>
                            {option.name}
                        </option>
                    ))}
                    </select>
                </div>
            </div>
            <div className='col-md-2'>
                <div>
                    <label  className='form-label' htmlFor="title">Status:</label>
                    <select className="form-control" id="dropdown" name="gender" value={selectedStatus} onChange={handleStatusChange}>
                    <option value="">Select an option</option>
                    {status.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                    </select>
                </div>
            </div>
            <div className='col-md-1 ' style={{ paddingRight: '0'}}>
                <div>
                    <label  className='form-label text-white' htmlFor="title">:</label>
                    <button className='btn btn-info'>Filter</button>
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
  </div>
    <div className='d-felx scrollable-container'>
        <div className='shadow mb-5 rounded'>
        <table className='table  table-nowrap mb-0 scrollable-table mt-3'>
          <thead className='table-light'>
            <tr>
              <th>Date</th>
              <th>Registration No</th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Reffered By</th>
              <th>Amount</th>
              <th>BalAmt</th>
              <th>Edit</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td>{item.RDate.slice(0, 10)}</td>
                <td>{item.RegNo}</td>
                <td>{item.Title + ' ' + item.PName}</td>
                <td>{item.Year + 'Y'}</td>
                <td>{item.Sex}</td>
                <td>{item.Oref}</td>
                <td>{item.PAmt}</td>
                <td>{item.BalAmt}</td>
                <td><p  className='badge badge-warning-lighten' onClick={() => handleEditClick(item.RFIID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></p></td>
                <td><p className='badge badge-success-lighten' onClick={() => handleResult(item.RFIID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16"><path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/><path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/></svg></p></td>
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
