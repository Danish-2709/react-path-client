import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import baseURL from './apiConfig';

export default function CTWLValue() {
    const { TID } = useParams();
    const [, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedTGNameId, setSelectedTGNameId] = useState('');
    const [options, setOptions] = useState([]); 
    const [tName, setTName] = useState('');
    const [tCheck, setTCheck] = useState('');
    const check = ['Yes', 'No'];
    const [isHeading, setISHeading] = useState('');
    const heading = ['Yes', 'No'];
    const [pSL, setPSL] = useState('');
    const [mName, setMName] = useState('');
    const [uName, setUName] = useState('');
    const [tType, setTType] = useState('TEST WITH LIST OF VALUES');
    const [dValue, setDValue] = useState('');
    const [dTM, setDTM] = useState('');
    const [dTF, setDTF] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
  
  
    const handleTNameChange = (e) => {
      setTName(e.target.value);
    };
    const handleTCheckChange = (e) => {
      setTCheck(e.target.value);
    };
    const handleISHeadingChange = (e) => {
      setISHeading(e.target.value);
    };
    const handlePSLChange = (e) => {
      setPSL(e.target.value);
    };
    const handleMNameChange = (e) => {
      setMName(e.target.value);
    };
    const handleUNameChange = (e) => {
      setUName(e.target.value);
    };
    const handleTTypeChange = (e) => {
      setTType(e.target.value);
    };
    const handleDValueChange = (e) => {
      setDValue(e.target.value);
    };
    const handleDTMChange = (e) => {
     setDTM(e.target.value);
    };
    const handleDTFChange = (e) => {
      setDTF(e.target.value);
    };
    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        // console.log('Selected Value:', selectedValue);
        setSelectedOption(selectedValue);
        const selectedTGName = options.find(option => option.name === selectedValue);
        if (selectedTGName) {
        // console.log('Selected selectedTGName ID:', selectedTGName.id);
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
          const filteredOptions = data.recordset.filter(option => option.SGName !== null).map(option => ({
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
      formData.append('selectedTGNameId', selectedTGNameId);
      formData.append('tName', tName);
      formData.append('tCheck', tCheck);
      formData.append('isHeading', isHeading);
      formData.append('pSL', pSL);
      formData.append('mName', mName);
      formData.append('uName', uName);
      formData.append('tType', tType);
      formData.append('dValue', dValue);
      formData.append('dTM', dTM);
      formData.append('dTF', dTF);
      if(TID){
        try {
          const response = await fetch(`${baseURL}/api/UpdateCTest/${TID}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({TID, selectedTGNameId, tName, tCheck, isHeading, pSL, mName, uName, tType, dValue, dTM, dTF}),
          });
      
          if (response.ok) {
            console.log('Test With List Of Values Updated successfully');
            setSuccessMessage('Test With List Of Values Updated successfully.');
            setSelectedOption('');
            setTName('');
            setTCheck('');
            setISHeading('');
            setPSL('');
            setMName('');
            setUName('');
            setDValue('');
            setDTF('');
            setDTM('');
          } else {
            console.log("error in Updating")
          }
        } catch (error) {
          console.error('Error Updating', error);
        }
      } else {
      try {
        const response = await fetch(`${baseURL}/api/CTest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selectedTGNameId, tName, tCheck, isHeading, pSL, mName, uName, tType, dValue, dTM, dTF}),
        });
        if (response.ok) {
          console.log('Test With List Of Values Created successfully');
          setSuccessMessage('Test With List Of Values Test Created successfully.');
          setSelectedOption('');
          setTName('');
          setTCheck('');
          setISHeading('');
          setPSL('');
          setMName('');
          setUName('');
          setDValue('');
          setDTF('');
          setDTM('');
        } else {
          console.log("error in uploading")
        }
      } catch (error) {
        console.error('Error uploading', error);
      }
    }
      setIsSubmitting(false);
    };
    useEffect(() => {
      if (TID) {
        console.log('Fetching data for TID:', TID);
        fetch(`${baseURL}/api/EditTest/${TID}`)
          .then((response) => response.json())
          .then((result) => {
            // console.log('API response:', result);
            if (result && result.length > 0) {
              const data = result[0]; // Access the first item in the array
    
              // Update state variables
              setData(data);
              setSelectedOption(data.groupname || '');
              setSelectedTGNameId(data.SGID || '');
              setTName(data.TName || '');
              setTCheck(data.Tcheck || '');
              setISHeading(data.IsHeading || '');
              setPSL(data.PSLNo || '');
              setMName(data.Method || '');
              setUName(data.UName || '');
              setDValue(data.DValue || '');
              setDTM(data.DisplayM || '');
              setDTF(data.Display || '');
            } else {
              console.log('No data received');
            }
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      } else {
        console.log('TID is not defined or falsy');
          setSelectedOption('');
          setTName('');
          setTCheck('');
          setISHeading('');
          setPSL('');
          setMName('');
          setUName('');
          setDValue('');
          setDTM('');
          setDTF('');
      }
    }, [TID]);
  
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
      <div className='shadow-sm p-2 mb-2 bg-body-tertiary rounded'>
        <h6 className='text-center c2'>{TID ? 'Update Test With List Of Values' : 'Create Test With List Of Values'}</h6>
        <form className='form-container' onSubmit={handleSubmit}>
            <div className='row'>
                <div className='col-md-6'>
                    <div>
                        <label  className='form-label' htmlFor="title">Sub Group:</label>
                        <select className="form-control" id="dropdown" name="gender" value={selectedOption} onChange={handleSelectChange}>
                         <option value="">Select an option</option>
                         {options.map((option, index) => (
                             <option key={index} value={option.name}>
                                 {option.name}
                             </option>
                         ))}
                        </select>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div>
                        <label  className='form-label' htmlFor="title">Test Name:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={tName}  onChange={handleTNameChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Test Check:</label>
                        <select className="form-control" id="dropdown" name="gender" value={tCheck} onChange={handleTCheckChange}>
                         <option value="">Select an option</option>
                         {check.map((option, index) => (
                             <option key={index} value={option}>
                                 {option}
                             </option>
                         ))}
                        </select>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Is Heading?:</label>
                        <select className="form-control" id="dropdown" name="gender" value={isHeading} onChange={handleISHeadingChange}>
                         <option value="">Select an option</option>
                         {heading.map((option, index) => (
                             <option key={index} value={option}>
                                 {option}
                             </option>
                         ))}
                        </select>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Print SL No:</label>
                        <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={pSL}  onChange={handlePSLChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Method Name:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={mName}  onChange={handleMNameChange} required />
                    </div>
                </div>
                <div className='col-md-4'>
                    <div>
                        <label  className='form-label' htmlFor="title">Unit Name:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={uName}  onChange={handleUNameChange} required />
                    </div>
                </div>
                <div className='col-md-4'>
                    <div>
                        <label  className='form-label' htmlFor="title">Test Type:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={tType}  onChange={handleTTypeChange} readOnly />
                    </div>
                </div>
                <div className='col-md-4'>
                    <div>
                        <label  className='form-label' htmlFor="title">Default Value:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={dValue}  onChange={handleDValueChange} required />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                       <h6 className='text-center'>Display Text</h6>
                    </div>
                    <div className='col-md-6'>
                    <div>
                        <label  className='form-label' htmlFor="title">Male:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={dTM}  onChange={handleDTMChange} required />
                    </div>
                    </div>
                    <div className='col-md-6'>
                    <div>
                        <label  className='form-label' htmlFor="title">Female:</label>
                        <input  className='form-input my-1'  name="newsTitle" type="text" id="newsTitle" value={dTF}  onChange={handleDTFChange} required />
                    </div>
                    </div>
                </div>
            </div>
          <div className='mt-2 text-center'>
            <button className='btn btn-info' type="submit">{TID ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
      </div>   
    </>
  )
}
