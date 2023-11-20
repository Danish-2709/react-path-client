import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import baseURL from './apiConfig';

export default function TestWaitingList() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const handleEditClick = (RFIID) => {
        navigate(`/CPRegistration/${RFIID}`)
    };

    const handleResult = (RFIID) => {
        navigate(`/CResult/${RFIID}`)
    };

    useEffect(() => {
        fetch(`${baseURL}/api/getWaitingTestDetails`)
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

        function getStatusColor(status) {
            switch (status) {
              case 'Pending':
                return '#fa6767'; // Red color for pending
              case 'Approved':
                return '#42d29d'; // Green color for approved
              case 'Complete':
                return '#44badc'; // Blue color for complete
              default:
                return ''; // Default color
            }
          }
          
          function getStatusBackgroundColor(status) {
            switch (status) {
              case 'Pending':
                return '#fff0f0'; // Light red background for pending
              case 'Approved':
                return '#ecfbf5'; // Light green background for approved
              case 'Complete':
                return '#ecf8fc'; // Light blue background for complete
              default:
                return ''; // Default background color
            }
          }     
          
  return (
    <>
<div>
<nav className='mt-1'>
<ul className="nav nav-tabs">
  <li className="nav-item">
    <Link className="nav-link" aria-current="page" to="/WaitingList">Patient Wise</Link>
  </li>
  <li className="nav-item">
    <Link className="nav-link active" to="/TestWaitingList">Test Wise</Link>
  </li>
</ul> 
</nav>
<div className='d-felx scrollable-container'>
        <div className='shadow mb-5 rounded'>
        <table className='table  table-nowrap mb-0 scrollable-table mt-3'>
          <thead className='table-light'>
            <tr>
              <th>Date</th>
              <th>Registration No</th>
              <th>Test Name</th>
              <th>Patient Name</th>
              <th>Reffered By</th>
              <th>Client Name</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td>{item.Date.slice(0, 10)}</td>
                <td>{item.RegistrationNo}</td>
                <td>{item.TestName}</td>
                <td>{item.PatientName}</td>
                <td>{item.ReferredBy}</td>
                <td>{item.ClientName}</td>
                <td><span style={{ color: getStatusColor(item.TestStatus),  display: 'inline-block', padding: '0.25em 0.4em', fontSize: '0.75em', fontWeight: 700, lineHeight: 1,     textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'sub', borderRadius: '0.25rem', backgroundColor: getStatusBackgroundColor(item.TestStatus)
                }}>{item.TestStatus}</span></td>
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

