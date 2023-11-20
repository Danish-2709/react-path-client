import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import baseURL from './apiConfig';

export default function CSGMaster() {
    const [sGName, setSGName] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedTGNameId, setSelectedTGNameId] = useState('');
    const [options, setOptions] = useState([]); 
    const [selectedSample, setSelectedSample] = useState('');
    const [selectedSampleId, setSelectedSampleId] = useState('');
    const [sampleOptions, setSampleOptions] = useState([]);
    const [sName, setSName] = useState('');
    const [mName, setMName] = useState('');
    const [tCode, setTCode] = useState('');
    const [charges, setCharges] = useState('');
    const [bAmnt, setBAmnt] = useState('0');
    const [chargesSec, setChargesSec] = useState('');
    const [tType, setTType] = useState('');
    const test = ['Routine', 'Special', 'X-Ray', 'Ultrasound', 'ECG'];
    const [sGPrint, setSGPrint] = useState('');
    const print = ['Yes', 'No'];
    const [tCateg, setTCateg] = useState('');
    const categ = ['Test', 'Package'];
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
    const handleSGPrintChange = (e) => {
      setSGPrint(e.target.value);
    };
    const handleTTypeChange = (e) => {
      setTType(e.target.value);
    };
    const handleTCategChange = (e) => {
       setTCateg(e.target.value);
    };
    const handleBAmntChange = (e) => {
       setBAmnt(e.target.value);
    };
    const handleNotesChange = (value) => {
       setNotes(value);
    };
    const handleInterpretationChange = (value) => {
      setInterpretation(value);
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
    const handleSTypeChange = (e) => {
        const selectedSample = e.target.value;
        // console.log('Selected Value:', selectedSample);
        setSelectedSample(selectedSample);
        const selectedSType = sampleOptions.find(option => option.name === selectedSample);
        if (selectedSType) {
        // console.log('Selected selectedSType ID:', selectedSType.id);
        setSelectedSampleId(selectedSType.id); 
        }
    };  
    useEffect(() => {
      fetchOptions();
      fetchSample();
    }, []);

    const fetchOptions = async () => {
      try {
        const response = await fetch(`${baseURL}/api/GetTGName`); 
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

    const fetchSample = async () => {
      try {
        const response = await fetch(`${baseURL}/api/GetStype`); 
        if (response.ok) {
          const data = await response.json();
          // console.log(data)
          const filteredOptions = data.recordset.filter(option => option.SampleName !== null).map(option => ({
            name: option.SampleName,
            id: option.SID,
          }));
          setSampleOptions(filteredOptions);
          // console.log(filteredOptions) 
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
      setSuccessMessage('TGName Created successfully.');
      setShowModal(true);
      setTimeout(() => {
        removeSuccessMessage();
      }, 2000); 
  
      const formData = new FormData();
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
        const response = await fetch(`${baseURL}/api/CSGMaster`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sGName, selectedTGNameId, sName, mName, tCode, charges, chargesSec, bAmnt, sGPrint, selectedSampleId, tType, tCateg, notes, interpretation}),
        });
    
        if (response.ok) {
          console.log('TGName Created successfully');
            setSGName('');
            setSelectedOption('');
            setSName('');
            setMName('');
            setTCode('');
            setCharges('');
            setChargesSec('');
            setSGPrint('');
            setSampleOptions('');
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
        <h6 className='text-center c2'>Create Test Sub Group</h6>
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
                         {sampleOptions.map((option, index) => (
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
                                ['clean'], 
                                [{ 'script': 'sub' }, { 'script': 'super' }], 
                                ['blockquote', 'code-block'], 
                                [{ 'background': [] }, { 'color': [] }],], }}
                                value={notes}  onChange={handleNotesChange} />
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
                                ['clean'], [{ 'script': 'sub' }, { 'script': 'super' }], 
                                ['blockquote', 'code-block'], 
                                [{ 'background': [] }, { 'color': [] }],], }} value={interpretation}  onChange={handleInterpretationChange} />
                    </div>
                </div>
            </div>
          <div className='mt-2 text-center'>
            <button className='btn btn-info' type="submit">Create</button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
}
