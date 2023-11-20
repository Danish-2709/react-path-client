import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import baseURL from './apiConfig';
import { useSession } from './SessionContext';

export default function DocViewComponent() {
    const { rID, setRID } = useSession();
    const [data, setData] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const cookieRID = document.cookie.replace(/(?:(?:^|.*;\s*)rID\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (cookieRID) {
          setRID(cookieRID);
          console.log('cookieRID', cookieRID)
        }
    }, [setRID]);
      

    const handlefromDateChange = (e) => {
      setFromDate(e.target.value);
    }
    const handletoDateChange = (e) => {
      setToDate(e.target.value);
    }

    const handleResult = (RFIID) => {
        navigate(`/DrPCPReport/${RFIID}`)
    };

    const handleReset = () => {
        setFromDate('');
        setToDate('');
    };

    useEffect(() => {
        // Create an object with the filter criteria
        const filterCriteria = {
          fromDate,
          toDate,
          rID,
        };

        console.log('filterCriteria', filterCriteria)
    
        const filterData = async () => {
          try {
            const response = await fetch(`${baseURL}/api/getFilteredDrPDetails`, {
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
      }, [fromDate, toDate, rID]);
    
     useEffect(() => {
        console.log('rid', rID)
        fetch(`${baseURL}/api/getDrPDetails/${rID}`)
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
        }, [rID]); 

   
  return (
    <>
<div>
  <div className=''>
    <div className='shadow-sm p-3 mb-3 bg-body-tertiary rounded'>
    <h5 className='text-center'>View Patient Details</h5>
    <form>
        <div className='row'>
            <div className='col-md-5'>
                <div>
                    <label  className='form-label' htmlFor="title">From Date:</label>
                    <input  className='form-input' type="Date" id="fromDate" name='fromDate' value={fromDate}  onChange={handlefromDateChange} required />
                </div>
            </div>
            <div className='col-md-5'>
                <div>
                    <label  className='form-label' htmlFor="title">TO Date:{rID}</label>
                    <input  className='form-input' type="Date"  name="toDate" id="toDate"  value={toDate} onChange={handletoDateChange} required />
                </div>
            </div>
            <div className='col-md-2'>
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
              <th>Reffered By</th>
              <th>Collected By</th>
              <th>Investigation</th>
              <th>Print</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td>{item.Date.slice(0, 10)}</td>
                <td>{item.RegistrationNo}</td>
                <td>{item.PatientName}</td>
                <td>{item.ReferredBy}</td>
                <td>{item.CollectedBy}</td>
                <td>{item.Investigation}</td>
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

