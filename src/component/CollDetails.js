import React, { useEffect, useState } from 'react'
import baseURL from './apiConfig';

export default function CollDetails() {
    const [data, setData] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [cCen, setCCen] = useState('');
    const [selectedMode, setSelectedMode] = useState([]);
    const status = ['PayTm', 'GooglePay', 'PhonePay', 'AmazonPay', 'BharatPay']
    const [selectedRefferal, setSelectedRefferal] = useState('');
    const [selectedRefferalId, setselectedRefferalId] = useState([]);
    const [refferal, setRefferal] = useState([]);

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

    const handleModeChange = (e) => {
        setSelectedMode(e.target.value);
    };

    const handleReset = () => {
      setFromDate('');
      setToDate('');
      setCCen('');
      setSelectedRefferal([]);
      setselectedRefferalId('');
      setSelectedMode('');
    };

    const filterData = async (event) => {
      event.preventDefault();
      try {
        const response = await fetch(`${baseURL}/api/getFilteredColDetails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fromDate,
            toDate,
            cCen,
            selectedRefferalId,
            selectedMode,
          }),
        });
    
        if (response.ok) {
          const data = await response.json();
          setData(data);
          console.log(data);
        } else {
          console.error('Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    

  return (
    <>
<div>
<div className='container'>
    <div className='shadow-sm p-3 mb-3 bg-body-tertiary rounded'>
    <h5 className='text-center'>View Collection Details</h5>
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
                    <label  className='form-label' htmlFor="title">Payment Mode:</label>
                    <select className="form-control" id="dropdown" name="gender" value={selectedMode} onChange={handleModeChange}>
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
                    <button className='btn btn-info' onClick={filterData}>Filter</button>
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
              <th>Reffered By</th>
              <th>Client Name</th>
              <th>Collected By</th>
              <th>Reciept No</th>
              <th>Mode</th>
              <th>Amount</th>
              <th>BalAmt</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td>{item.Date.slice(0, 10)}</td>
                <td>{item.RegNo}</td>
                <td>{item.PatientName}</td>
                <td>{item.ReferredBy}</td>
                <td>{item.ClientName}</td>
                <td>{item.CollectedBy}</td>
                <td>{item.RecieptNo}</td>
                <td>{item.PMode}</td>
                <td>{item.DR}</td>
                <td>{item.CR}</td>
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
