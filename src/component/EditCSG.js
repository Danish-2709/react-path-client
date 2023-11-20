import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import baseURL from './apiConfig';

export default function EditCSG() {
    const { SGID } = useParams();
    const [, setData] = useState([]);
    const [sGName, setSGName] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedTGNameId, setSelectedTGNameId] = useState('');
    const [options, setOptions] = useState([]); 
    const [selectedSample, setSelectedSample] = useState('');
    const [selectedSampleId, setSelectedSampleId] = useState('');
    const [fetchedSample, setFetchedSample] = useState([]);
    const [sName, setSName] = useState('');
    const [mName, setMName] = useState('');
    const [tCode, setTCode] = useState('');
    const [charges, setCharges] = useState('');
    const [chargesSec, setChargesSec] = useState('');
    const [bAmnt, setBAmnt] = useState('0');
    const [tType, setTType] = useState('');
    const test = ['Routine', 'Special', 'X-Ray', 'Ultrasound', 'ECG'];
    const [tCateg, setTCateg] = useState('');
    const categ = ['Test', 'Package'];
    const [sGPrint, setSGPrint] = useState('');
    const print = ['Yes', 'No'];
    const [notes, setNotes] = useState(''); 
    const [interpretation, setInterpretation] = useState(''); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
  
  
    const handleSGNameChange = (e) => {
      setSGName(e.target.value);
    };
    const handleSNameChange = (e) => {
      setSName(e.target.value);
    };
    const handleMNameChange = (e) => {
      setMName(e.target.value);
    };
    const handleTCodeChange = (e) => {
      setTCode(e.target.value);
    };
    const handleChargesChange = (e) => {
      setCharges(e.target.value);
    };
    const handleChargesSecChange = (e) => {
      setChargesSec(e.target.value);
    };
    const handleBAmntChange = (e) => {
      setBAmnt(e.target.value);
    };
    const handleSGPrintChange = (e) => {
      setSGPrint(e.target.value);
    };
    const handleTTypeChange = (e) => {
      setTType(e.target.value);
    };
    const handleTCategChange = (e) => {
       setTCateg(e.target.value);
    };
    const handleNotesChange = (value) => {
       setNotes(value);
    };
    const handleInterpretationChange = (value) => {
      setInterpretation(value);
    };

    const handleSelectChange = (e) => {
      const selectedValue = e.target.value;
      const selectedTGName = options.find((option) => option.name === selectedValue);
      if (selectedTGName) {
        setSelectedOption(selectedValue);
        setSelectedTGNameId(selectedTGName.id);
      } else {
        setSelectedOption('');
        setSelectedTGNameId('');
      }
    };

    const handleSTypeChange = (e) => {
      const selectedSample = e.target.value;
      console.log('fetchSample:', fetchedSample);
      const selectedSType = fetchedSample.find((option) => option.name === selectedSample);
      if (selectedSType) {
        setSelectedSample(selectedSample);
        setSelectedSampleId(selectedSType.id);
      } else {
        setSelectedSample('');
        setSelectedSampleId('');
      }
    };

    useEffect(() => {
        fetchSGData(SGID);
        fetchSampleData();
        fetchOptions();
    }, [SGID]);

    const fetchOptions = async () => {
      try {
        const response = await fetch(`${baseURL}/api/GetTGName`); // Replace with your actual API endpoint
        if (response.ok) {
          const data = await response.json();
          // console.log(data)
          const filteredOptions = data.recordset.filter(option => option.TGName !== null).map(option => ({
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

    const fetchSampleData = async () => {
      try {
        const response = await fetch(`${baseURL}/api/GetStype`); 
        if (response.ok) {
          const data = await response.json();
          // console.log(data)
          const filteredSample = data.recordset.filter(option => option.SampleName !== null).map(option => ({
            name: option.SampleName,
            id: option.SID, 
          }));
          setFetchedSample(filteredSample);
          console.log(filteredSample) 
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
      setSuccessMessage('Group Updated Successfully')
      setShowModal(true);
      setTimeout(() => {
        removeSuccessMessage();
      }, 2000); 
  
      const formData = new FormData();
      // Format the date values as YYYY-MM-DD strings
      formData.append('sGName', sGName);
      formData.append('selectedTGNameId', selectedTGNameId);
      formData.append('sName', sName);
      formData.append('mName', mName);
      formData.append('tCode', tCode);
      formData.append('charges', charges);
      formData.append('chargesSec', chargesSec);
      formData.append('bAmnt', bAmnt);
      formData.append('sGPrint', sGPrint);
      formData.append('selectedSampleId', selectedSampleId);
      formData.append('tType', tType);
      formData.append('tCateg', tCateg);
      formData.append('notes', notes);
      formData.append('interpretation', interpretation);
      try {
        const response = await fetch(`${baseURL}/api/UpdateCSGMaster/${SGID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sGName, selectedTGNameId, sName, mName, tCode, charges, chargesSec, bAmnt, sGPrint, selectedSampleId, tType, tCateg, notes, interpretation})
        });
    
        if (response.ok) {
          console.log('Group Updated successfully');
            setSGName('');
            setSelectedOption('');
            setSName('');
            setMName('');
            setCharges('');
            setTType('');
            setTCateg('');
            setNotes('');
            setInterpretation('');
        } else {
          console.log("error in uploading")
        }
      } catch (error) {
        console.error('Error uploading', error);
      }
      setIsSubmitting(false);
    }

    const fetchSGData = async (SGID) => {
        try {
            const response = await fetch(`${baseURL}/api/GetCSG/${SGID}`);
            // console.log('SGID:', SGID);

            if (response.ok) {
                let  data = await response.json();
                console.log('data', data);
                setData(data);
                setSGName(data.SGName || '');
                setSelectedOption(data.TestName || '');
                setSelectedTGNameId(data.TGID || '');
                setSName(data.SGSName || '');
                setMName(data.MethodName || '');
                setTCode(data.TestCode || '');
                setCharges(data.Charges || '');
                setChargesSec(data.OCharges || '');
                setBAmnt(data.DCAmt || '');
                setSGPrint(data.SGPrint || '');
                setSelectedSample(data.SampleName || '');
                setSelectedSampleId(data.SID || '');
                setTType(data.TType || '');
                setTCateg(data.SGType || '');
                setNotes(data.Notes || '');
                setInterpretation(data.inter || '');
            } else {
                console.error('Error fetching SG data');
            }
        } catch (error) {
            console.error('Error fetching SG data:', error);
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
        <h6 className='text-center c2'>Update Test Sub Group</h6>
        <form className='form-container' onSubmit={handleSubmit}>
            <div className='row'>
                <div className='col-md-6'>
                    <div>
                        <label  className='form-label' htmlFor="title">Group Name:</label>
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
                        <label  className='form-label' htmlFor="title">Sub Group Name:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={sGName}  onChange={handleSGNameChange} required />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div>
                        <label  className='form-label' htmlFor="title">Short Name:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={sName}  onChange={handleSNameChange} required />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div>
                        <label  className='form-label' htmlFor="title">Method Name:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={mName}  onChange={handleMNameChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Test Code:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={tCode}  onChange={handleTCodeChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Test Price 1:</label>
                        <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={charges}  onChange={handleChargesChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Test Price 2:</label>
                        <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={chargesSec}  onChange={handleChargesSecChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Benefit Amount:</label>
                        <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={bAmnt}  onChange={handleBAmntChange} required />
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Sub Group Print?:</label>
                        <select className="form-control" id="dropdown" name="gender" value={sGPrint} onChange={handleSGPrintChange}>
                         <option value="">Select an option</option>
                         {print.map((option, index) => (
                             <option key={index} value={option}>
                                 {option}
                             </option>
                         ))}
                        </select>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Sample Type:</label>
                        <select className="form-control" id="dropdown" name="gender" value={selectedSample} onChange={handleSTypeChange}>
                         <option value="">Select an option</option>
                         {fetchedSample.map((option, index) => (
                             <option key={index} value={option.name}>
                                 {option.name}
                             </option>
                         ))}
                        </select>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Test Type:</label>
                        <select className="form-control" id="dropdown" name="gender" value={tType} onChange={handleTTypeChange}>
                         <option value="">Select an option</option>
                         {test.map((option, index) => (
                             <option key={index} value={option}>
                                 {option}
                             </option>
                         ))}
                        </select>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div>
                        <label  className='form-label' htmlFor="title">Test Category:</label>
                        <select className="form-control" id="dropdown" name="gender" value={tCateg} onChange={handleTCategChange}>
                         <option value="">Select an option</option>
                         {categ.map((option, index) => (
                             <option key={index} value={option}>
                                 {option}
                             </option>
                         ))}
                        </select>
                    </div>
                </div>
                <div className='col-md-12'>
                    <div>
                    <label  className='form-label' htmlFor="title">Notes:</label>
                    <ReactQuill modules={{ toolbar: [ [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['bold', 'italic', 'underline'],
                                [{ 'align': [] }],
                                ['link', 'image'],
                                ['clean'], ], }}  value={notes}  onChange={handleNotesChange} />
                    </div>
                </div>
                <div className='col-md-12'>
                    <div>
                    <label  className='form-label' htmlFor="title">Interpretaion:</label>
                    <ReactQuill modules={{ toolbar: [ [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['bold', 'italic', 'underline'],
                                [{ 'align': [] }],
                                ['link', 'image'],
                                ['clean'], ], }} value={interpretation}  onChange={handleInterpretationChange} />
                    </div>
                </div>
            </div>
          <div className='mt-2 text-center'>
            <button className='btn btn-info' type="submit">Update</button>
          </div>
        </form>
      </div>
    </>
  );
}
