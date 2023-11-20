import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import baseURL from './apiConfig';

export default function CResult() {
    const { RFIID } = useParams();
    const [data, setData] = useState([]);
    const [testData, setTestData] = useState([]);
    const [resultData, setResultData] = useState([]);
    const [datalistOptions, setDatalistOptions] = useState([]);
    const [selectedSGID, setSelectedSGID] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();


    const handleFilter = async () => {
      navigate(`/PCPReport/${RFIID}/${selectedSGID}`);
      };

    const handleWhats = () => {
      if (!phoneNumber) {
      } else {
        const whatsappUrl = `https://wa.me/${phoneNumber}`;
        window.open(whatsappUrl, '_blank');
      }
    };

    const handleMail = () => {
      const emailAddress = 'example@example.com';
      const mailtoUrl = `mailto:${emailAddress}`;
      window.open(mailtoUrl);
    };

    useEffect(() => {
      fetch(`${baseURL}/api/updatePDetails/${RFIID}`)
      .then((response) => response.json())
      .then(DataArray => {
          const data = DataArray[0];
          // console.log("formData", data);
          setData(data);
          setPhoneNumber(data.ContactNo)
      })
  }, [RFIID]); 

  useEffect(() => {
    fetch(`${baseURL}/api/getFurtherDetails/${RFIID}`)
    .then((response) => response.json())
      .then(testArray => {
          const testData = testArray;
          // console.log("formData", testData);
          setTestData(testData);
      })
  }, [RFIID]); 

  const handleResult = (SGID) => {
    setSelectedSGID(SGID);
    fetch(`${baseURL}/api/getResultDetails/${RFIID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ SGID: SGID }),
    })
    .then((response) => response.json())
    .then((resultArray) => {
      const resultData = resultArray;
        //  console.log("formData", resultData);
      setResultData(resultData);
      const rValues = resultData.map((item) => item.RValue.split(','));
      setDatalistOptions(rValues);
    });
  };

  const handleRValueUpdate = (RTID, newRValue) => {
    fetch(`${baseURL}/api/updateRValue`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ RTID, newRValue}),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setSuccessMessage('RValue updated successfully.');
        // You can optionally close the modal or perform other actions here.
      } else {
        setSuccessMessage('Failed to update RValue.');
      }
    });
  };

  const handlenewPTestUpdate = (RTID, newPTest) => {
    fetch(`${baseURL}/api/PTest`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ RTID, newPTest}),
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

  const handleStatusUpdate = (RCID, newStatus) => {
    fetch(`${baseURL}/api/updateStatus`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ RCID, newStatus }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Response from server:', data);
      if (data.success) {
        console.log('update Status:', data.success);
      } else {
        console.log('Failed to update Status:', data.error);
      }
    });
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
  <div className=' mt-3 '>
    <div className='shadow-sm p-3 mb-3 bg-body-tertiary rounded'>
      <div className='Drow'>
      <div className="col-md-3 mt-1">
            <p><strong className='padRig'>Reg No:</strong>{data.RegNo || ''}</p>  
            <p><strong className='padRig'>Ref By:</strong> {data.RefName || ''}</p>
        </div>
        <div className="col-md-3 mt-1">
            <p><strong className='padRig'>Name:      </strong>{data.Title + " " + data.PName  || '' }</p>
            <p><strong className='padRig'>Collected: </strong>{data.Cdate ? data.Cdate.slice(0, 10) : ''}</p>
        </div>
        <div className='col-md-3 mt-1'>
            <p><strong className='padRig'>Gender: </strong>{data.Sex || ''}</p>
            <p><strong className='padRig'>Center: </strong>{data.CollCen || ''}</p>
        </div>
        <div className='col-md-3 mt-1'>
            <p><strong className='padRig'>Age:      </strong>{data.Year + "-Y/" + data.Month + "-M/" + data.Day || ''}</p>
            <p><strong className='padRig'>Reported: </strong>{data.RDate ? data.RDate.slice(0, 10) : ''}</p>
        </div>
        <div className='col-md-12 text-center pt-3'>
            <button type='button' className='btn btn-sm btn-info' onClick={handleFilter}>Print Report</button>
            <button type='button' className='btn btn-sm btn-success mx-1' onClick={handleWhats}>Whatsapp</button>
            <button type='button' className='btn btn-sm btn-primary' onClick={handleMail}>Email</button>
            <button type='button' className='btn btn-sm btn-warning mx-1' onClick={handleFilter}>PDF</button>
        </div>
      </div>
    </div>
  <div className='Drow'>
    <div className='col-md-4 px-1'>
    <div className='shadow-sm p-3 mb-3 bg-body-tertiary rounded'>
       <h6 className='text-center c2'>Test's</h6>
       <div className='Drow'>
        <table className='table table-nowrap mb-0 scrollable-table mt-3 col-md-12'>
          <thead className='table-info'>
            <tr>
              <th>Select</th>
              <th>Test Name</th>
              <th>Fill Result</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {testData.map((item, index) => (
              <tr key={index} className='text-center'>
                <td><input type="checkbox" defaultChecked={item.Status === 'Yes'}  onBlur={() => { const newStatus = item.Status === 'Yes' ? 'No' : 'Yes'; handleStatusUpdate(item.RCID, newStatus); }}/></td>
                <td>{item.TestName}</td>
                <td><a className='badge badge-info-lighten' onClick={() => handleResult(item.SGID)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16"><path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/><path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/></svg></a></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
    </div>
    </div>
    <div className='col-md-8 px-1'>
    <div className='shadow-sm p-3 mb-3 bg-body-tertiary rounded'>
      <h6 className='text-center c2'>Fill Result</h6>
       <div className='Drow'>
        <table className='table table-nowrap mb-0 scrollable-table mt-3 col-md-12'>
          <thead className='table-info'>
            <tr>
              <th>Result</th>
              <th>Select</th>
              <th>Parameter</th>
              <th>Unit Name</th>
              <th>Bio Ref Range</th>
            </tr>
          </thead>
          <tbody className='text-center'>
          {resultData.map((item, index) => (
              <tr key={index} className='text-center'>
                <td>
                  {item.TestType === 'TEST WITH LIST OF VALUES' ? (
                    <div>
                      <input className='form-input' type="text" list={`testNameOptions_${index}`} placeholder="Type to search..." onChange ={(e) => handleRValueUpdate(item.RTID, e.target.value)}/>
                      <datalist id={`testNameOptions_${index}`}>
                        {datalistOptions[index].map((filteredOption, optionIndex) => (
                          <option key={optionIndex} value={filteredOption.trim()}>{filteredOption.trim()}</option>
                        ))}
                      </datalist>
                    </div>
                  ) : (
                   <input  className='form-input'
                   style={{ backgroundColor: item.RValue < item.MinV || item.RValue > item.MaxV ? '#ffcfcf' : 'initial' }}
                   type="text" defaultValue={item.RValue || ''} onChange={(e) => {
                    console.log('Comparison:', item.RValue, item.MinV, item.MaxV);
                    handleRValueUpdate(item.RTID, e.target.value);
                  }}
                    />
                  )}
                </td>
                <td><input type="checkbox" defaultChecked={item.PTest === 'Yes'}  onChange={() => { const newPTest = item.PTest === 'Yes' ? 'No' : 'Yes'; handlenewPTestUpdate(item.RTID, newPTest); }}/></td>
                <td>{item.TName}</td>
                <td>{item.UnitName}</td>
                <td>{item.Display}</td>
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
  )
}
