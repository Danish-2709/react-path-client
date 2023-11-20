import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import baseURL from './apiConfig';

export default function CAWRange() {
  const { TID } = useParams();
  const [data, setData] = useState([]);
  const [gridValues, setGridValues] = useState([]);
  const [inputFieldsFilled, setInputFieldsFilled] = useState(false);
  const [selectedRowForEdit, setSelectedRowForEdit] = useState(null);
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
  const [tType, setTType] = useState('AGE WISE RANGE');
  const [dValue, setDValue] = useState('');
  const [aType, setAType] = useState('');
  const age = ['Year', 'Month', 'Day'];
  const [lAge, setLAge] = useState('');
  const [uAge, setUAge] = useState('');
  const [mMVal, setMMVal] = useState('');
  const [mFVal, setMFVal] = useState('');
  const [maxMVal, setMaxMVal] = useState('');
  const [maxFVal, setMaxFVal] = useState('');
  const [mMWarn, setMMWarn] = useState('');
  const [mFWarn, setMFWarn] = useState('');
  const [maxMWarn, setMaxMWarn] = useState('');
  const [maxFWarn, setMaxFWarn] = useState('');
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
  const handleAType = (e) => {
    setAType(e.target.value);
  };
  const handleLAgeChange = (e) => {
    setLAge(e.target.value);
  };
  const handleUAgeChange = (e) => {
    setUAge(e.target.value);
  };
  const handleMMValChange = (e) => {
    setMMVal(e.target.value);
  };
  const handleMFValChange = (e) => {
    setMFVal(e.target.value);
  };
  const handleMaxMValChange = (e) => {
    setMaxMVal(e.target.value);
  };
  const handleMaxFValChange = (e) => {
    setMaxFVal(e.target.value);
  };
  const handleMMWarnChange = (e) => {
   setMMWarn(e.target.value);
  };
  const handleMFWarnChange = (e) => {
    setMFWarn(e.target.value);
  };
  const handleMaxMWarnChange = (e) => {
   setMaxMWarn(e.target.value);
  };
  const handleMaxFWarnChange = (e) => {
    setMaxFWarn(e.target.value);
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
  
  const handleEditClick = (aWData, rowIndex) => {
  setSelectedRowForEdit(rowIndex);
  setAType(aWData.ageType);
  setLAge(aWData.lowerAge);
  setUAge(aWData.upperAge);
  setMMVal(aWData.maleminValue);
  setMFVal(aWData.femaleminValue);
  setMaxMVal(aWData.malemaxValue);
  setMaxFVal(aWData.femalemaxValue);
  setMMWarn(aWData.maleminWarn);
  setMFWarn(aWData.femaleminWarn);
  setMaxMWarn(aWData.malemaxWarn);
  setMaxFWarn(aWData.femalemaxWarn);
  setDTM(aWData.maleText);
  setDTF(aWData.femaleText)
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
    
  const removeSuccessMessage = () => {
    setSuccessMessage('');
    setShowModal(false);
  };
  
  const handleSubmit = async (e) => {
    console.log('handlenoticeupload called');
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
  formData.append('aType', aType);
  formData.append('lAge', lAge);
  formData.append('uAge', uAge);
  formData.append('mMVal', mMVal);
  formData.append('mFVal', mFVal);
  formData.append('maxMVal', maxMVal);
  formData.append('maxFVal', maxFVal);
  formData.append('mMWarn', mMWarn);
  formData.append('mFWarn', mFWarn);
  formData.append('maxMWarn', maxMWarn);
  formData.append('maxFWarn', maxFWarn);
  formData.append('dTM', dTM);
  formData.append('dTF', dTF);
    if(TID){
      try {
        const response = await fetch(`${baseURL}/api/UpdateAWTest/${TID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ TID, selectedTGNameId, tName, tCheck, isHeading, pSL, mName, uName, tType, dValue, gridValues }),
        });
  
        if (response.ok) {
          console.log('Age Wise Test Updated successfully');
          setSuccessMessage('Age Wise Test Updated successfully.');
          setSelectedOption('');
          setTName('');
          setTCheck('');
          setISHeading('');
          setPSL('');
          setMName('');
          setUName('');
          setDValue('');
           
        } else {
          console.log("error in uploading")
        }
        } catch (error) {
          console.error('Error uploading', error);
        }
    } else {
      try {
        if (!selectedTGNameId ||!tName ||!tCheck ||!isHeading ||!pSL ||!mName ||!uName ||!dValue
          ) {
            alert('Please fill in all required fields.');
            return
          }
        const response = await fetch(`${baseURL}/api/CAWTest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selectedTGNameId, tName, tCheck, isHeading, pSL, mName, uName, tType, dValue, gridValues }),
        });
  
        if (response.ok) {
          console.log('Age Wise Test Created successfully');
          setSuccessMessage('Age Wise Test Created successfully.');
          setSelectedOption('');
          setTName('');
          setTCheck('');
          setISHeading('');
          setPSL('');
          setMName('');
          setUName('');
          setDValue('');
           
        } else {
          console.log("error in uploading")
        }
        } catch (error) {
          console.error('Error uploading', error);
        }
    }
      setIsSubmitting(false);
  }
    
  const addToGrid = () => {
      if (aType && lAge && uAge && mMVal && mFVal && maxMVal && maxFVal && mMWarn && mFWarn && maxMWarn && maxFWarn && dTM && dTF) {
        const newValue = {
        ageType: aType,
        lowerAge: lAge,
        upperAge: uAge,
        maleminValue: mMVal,
        femaleminValue: mFVal,
        malemaxValue: maxMVal,
        femalemaxValue: maxFVal,
        maleminWarn: mMWarn,
        femaleminWarn: mFWarn,
        malemaxWarn: maxMWarn,
        femalemaxWarn: maxFWarn,
        maleText: dTM,
        femaleText: dTF,
      };
      setInputFieldsFilled(true);
      if (selectedRowForEdit !== null) {
        const updatedGridValues = [...gridValues];
        updatedGridValues[selectedRowForEdit] = newValue;
        setGridValues(updatedGridValues);
        setSelectedRowForEdit(null);
      } else {
        setGridValues([...gridValues, newValue]);
      }
      console.log(newValue)
      setAType('');
      setLAge('');
      setUAge('');
      setMMVal('');
      setMFVal('');
      setMaxMVal('');
      setMaxFVal('');
      setMMWarn('');
      setMFWarn('');
      setMaxMWarn('');
      setMaxFWarn('');
      setDTM('');
      setDTF('');
    } else {
      setInputFieldsFilled(false);
      alert('Please fill in all fields in the Age Range section.');
    }
  };
  
  const handleReset = () => {
    console.log('handleReset called');
    setGridValues([]);
    setSelectedOption('');
    setTName('');
    setTCheck('');
    setISHeading('');
    setPSL('');
    setMName('');
    setUName('');
    setDValue('');
  }

  useEffect(() => {
    if (TID) {
      // console.log('Fetching data for TID:', TID);
      fetch(`/api/EditAWTest/${TID}`)
        .then((response) => response.json())
        .then((result) => {
          // console.log('API response:', result);
          if (result && result.length > 0) {
            const data = result[0]; 
            setData(data);
            setSelectedOption(data.SGName || '');
            setSelectedTGNameId(data.SGID || '');
            setTName(data.TName || '');
            setTCheck(data.Tcheck || '');
            setISHeading(data.IsHeading || '');
            setPSL(data.PSLNo || '');
            setMName(data.Method || '');
            setUName(data.UName || '');
            setDValue(data.DValue || '');
            const gridData = result.map((item) => ({
              ageType: item.AgeType,
              lowerAge: item.LAge,
              upperAge: item.UAge,
              maleminValue: item.MinVM,
              femaleminValue: item.MinV,
              malemaxValue: item.MaxVM,
              femalemaxValue: item.MaxV,
              maleminWarn: item.MinWM,
              femaleminWarn: item.MinW,
              malemaxWarn: item.MaxWM,
              femalemaxWarn: item.MaxW,
              maleText: item.DisplayM,
              femaleText: item.Display,
              TAID:item.TAID,
          }));
            setGridValues(gridData);
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
          setGridValues([]);
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
    <h6 className='text-center c2'>{TID ? 'Update Test Age Wise' : 'Create Test Age Wise'}</h6>
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
            </div>
            <div className='row'>
                <div className='col-md-4'>
                   <div>
                       <label  className='form-label' htmlFor="title">Age type:</label>
                       <select className="form-control" id="dropdown" name="gender" value={aType} onChange={handleAType}>
                        <option value="">Select an option</option>
                        {age.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                       </select>
                   </div>
                </div>
                <div className='col-md-4'>
                   <div>
                       <label  className='form-label' htmlFor="title">Lower Age:</label>
                       <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={lAge}  onChange={handleLAgeChange} required />
                   </div>
                </div>
                <div className='col-md-4'>
                   <div>
                       <label  className='form-label' htmlFor="title">Upper Age:</label>
                       <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={uAge}  onChange={handleUAgeChange} required />
                   </div>
                </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Gender.</label>
                        <label  className='form-label py-2' htmlFor="title">Male</label>
                        <label  className='form-label py-2' htmlFor="title">Female</label>
                    </div>
                </div>
              <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Min Val.</label>
                        <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={mMVal}  onChange={handleMMValChange} required />
                        <input  className='form-input my-1'  name="newsTitle" type="number" id="newsTitle" value={mFVal}  onChange={handleMFValChange} required />
                    </div>
                </div>
              <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Max Val.</label>
                        <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={maxMVal}  onChange={handleMaxMValChange} required />
                        <input  className='form-input my-1'  name="newsTitle" type="number" id="newsTitle" value={maxFVal}  onChange={handleMaxFValChange} required />
                    </div>
                </div>
              <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Min Warn</label>
                        <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={mMWarn}  onChange={handleMMWarnChange} required />
                        <input  className='form-input my-1'  name="newsTitle" type="number" id="newsTitle" value={mFWarn}  onChange={handleMFWarnChange} required />
                    </div>
                </div>
              <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Max Warn</label>
                        <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={maxMWarn}  onChange={handleMaxMWarnChange} required />
                        <input  className='form-input my-1'  name="newsTitle" type="number" id="newsTitle" value={maxFWarn}  onChange={handleMaxFWarnChange} required />
                    </div>
                </div>
              <div className='col-md-2'>
                    <div>
                        <label  className='form-label' htmlFor="title">Display Text:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={dTM}  onChange={handleDTMChange} required />
                        <input  className='form-input my-1'  name="newsTitle" type="text" id="newsTitle" value={dTF}  onChange={handleDTFChange} required />
                    </div>
                </div>
            </div>
            <div className='mt-2 text-center'>
            <button className="btn btn-primary" type="button" onClick={addToGrid} >
            {inputFieldsFilled ? 'Update' : 'Add'}
              </button>
            </div>
    </form>
  </div>
    <div className="container mt-2 mcontainer" >
      <div className='card shadow p-3 pt-0 mb-5 rounded'>
        <h6 className="text-center">Age Range Grid</h6>
        <table className="table table-bordered mtable table-nowrap mb-0 ">
          <thead className='table-primary'>
            <tr>
              <th>Age Type</th>
              <th>Lower Age</th>
              <th>Upper Age</th>
              <th>Min MVal.</th>
              <th>Min FVal.</th>
              <th>Max MVal.</th>
              <th>Max FVal.</th>
              <th>Min MWarn.</th>
              <th>Min FWarn.</th>
              <th>Max MWarn.</th>
              <th>Max FWarn.</th>
              <th>Dis MText.</th>
              <th>Dis FText.</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {gridValues.map((value, index) => (
              <tr key={index}>
                <td>{value.ageType}</td>
                <td>{value.lowerAge}</td>
                <td>{value.upperAge}</td>
                <td>{value.maleminValue}</td>
                <td>{value.femaleminValue}</td>
                <td>{value.malemaxValue}</td>
                <td>{value.femalemaxValue}</td>
                <td>{value.maleminWarn}</td>
                <td>{value.femaleminWarn}</td>
                <td>{value.malemaxWarn}</td>
                <td>{value.femalemaxWarn}</td>
                <td>{value.maleText}</td>
                <td>{value.femaleText}</td>
                <td><p className='badge badge-warning-lighten' onClick={() => handleEditClick(value, index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></p></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      <div className='my-2 text-center'>
        <button className="btn btn-info mx-2" type="button" onClick={handleSubmit}>{TID? 'Update' : 'Create'}</button>
        <button className="btn btn-warning" type="button" onClick={handleReset}>Reset</button>
      </div>
</div>   
</>
)
}