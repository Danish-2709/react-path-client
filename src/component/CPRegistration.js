import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import baseURL from './apiConfig';
import { useSession } from './SessionContext';

export default function CPRegistration() {
    const { sId, setSId, centreType, setCentreType, line1, setLine1, oID, setOID } = useSession();
    const { RFIID } = useParams();
    const [ , setData] = useState([]);
    const [rNo, setRNo] = useState('');
    const [bCode, setBCode] = useState('');
    const [abhaNo, setAbhaNo] = useState('');
    const [adhaarNo, setAdhaarNo] = useState('');
    const [mNo, setMNo] = useState('');
    const [cDate, setCDate] = useState('');
    const [cTime, setCTime] = useState('');
    const [rDate, setRDate] = useState('');
    const [rTime, setRTime] = useState('');
    const [pNameTitle, setPNameTitle] = useState('');
    const nTitle = ['Mr', 'Mrs'];
    const [pName, setPName] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [ageType, setAgeType] = useState('');
    const [age, setAge] = useState('');
    const [selectedGender, setSelectedGender] = useState([]);
    const gender = ['Male', 'Female'];
    const [mail, setMail] = useState('');
    const [rBy, setRBy] = useState('');
    const [oRef, setOref] = useState([]); 
    const [selectedRefferal, setSelectedRefferal] = useState('');
    const [selectedRefferalId, setselectedRefferalId] = useState([]);
    const [refferal, setRefferal] = useState([]); 
    const [cBy, setCBy] = useState('');
    const [address, setAddress] = useState('');
    const [gAmnt, setGAmnt] = useState(0);
    const [mgmtDsc, setMgmtDsc] = useState('');
    const [drDsc, setDrDsc] = useState('');
    const [cCharges, setCCharges] = useState('');
    const [payableAmnt, setPayableAmnt] = useState('');
    const [advance, setAdvance] = useState('');
    const [balance, setBalance] = useState('');
    const [repNo, setRepNo] = useState('');
    const [pMode, setPMode] = useState('');
    const mode = ['PayTm', 'GooglePay', 'PhonePay', 'AmazonPay', 'BharatPay']
    const [remarks, setRemarks] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [SelectedTGNameId, setSelectedTGNameId] = useState([]);
    const [options, setOptions] = useState([]); 
    const [selectedOptionCharges, setSelectedOptionCharges] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
      var sId = document.cookie.replace(/(?:(?:^|.*;\s*)sId\s*=\s*([^;]*).*$)|^.*$/, "$1");
      var centreType = document.cookie.replace(/(?:(?:^|.*;\s*)centreType\s*=\s*([^;]*).*$)|^.*$/, "$1");
      var line1 = document.cookie.replace(/(?:(?:^|.*;\s*)line1\s*=\s*([^;]*).*$)|^.*$/, "$1");
      var oID = document.cookie.replace(/(?:(?:^|.*;\s*)oID\s*=\s*([^;]*).*$)|^.*$/, "$1");
  
      if (sId && centreType && line1) {
        setSId(sId);
        setCentreType(centreType);
        setLine1(line1);
        setOID(oID);
      }
    }, []);

    const handleBCodeChange = (e) => {
      setBCode(e.target.value);
    };
    const handleABHANoChange = (e) => {
      setAbhaNo(e.target.value);
    };
    const handleAdhaarNoChange = (e) => {
      setAdhaarNo(e.target.value);
    };
    const handleMNoChange = (e) => {
      setMNo(e.target.value);
     };
    const handleCDateChange = (e) => {
      setCDate(e.target.value);
    };
    const handleCTimeChange = (e) => {
      const inputTime = e.target.value;
      const formattedTime = `${inputTime}:00.000`;
      setCTime(formattedTime);
    };
    const handleRDateChange = (e) => {
      setRDate(e.target.value);
    };
    const handleRTimeChange = (e) => {
      const inputTime = e.target.value;
      const formattedTime = `${inputTime}:00.000`;
      setRTime(formattedTime);
    };
    const handlePNameTitleChange = (e) => {
      setPNameTitle(e.target.value);
    };
    const handlePNameChange = (e) => {
      setPName(e.target.value);
    };
    const handleYearChange = (e) => {
     setYear(e.target.value);
    };
    const handleMonthChange = (e) => {
      setMonth(e.target.value);
    };
    const handleDayChange = (e) => {
      setDay(e.target.value);
    };
    const handleSelectedGenderChange = (e) => {
      setSelectedGender(e.target.value);
    };
    const handleMailChange = (e) => {
     setMail(e.target.value);
    };
    const handleRByChange = (e) => {
     setRBy(e.target.value);
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
    const handleCByChange = (e) => {
      setCBy(e.target.value);
    };
    const handleAddressChange = (e) => {
      setAddress(e.target.value);
    };
    const handleMgmtDscChange = (e) => {
     setMgmtDsc(e.target.value);
    };
    const handleDrDscChange = (e) => {
     setDrDsc(e.target.value);
    };
    const handleCChargesChange = (e) => {
      setCCharges(e.target.value);
    };
    const handleAdvanceChange = (e) => {
      setAdvance(e.target.value);
    };
    const handlePModeChange = (e) => {
      setPMode(e.target.value);
    };
    const handleRemarksChange = (e) => {
      setRemarks(e.target.value);
    };

    const handleSelectedOptionChange = async (e) => {
      const searchText = e.target.value;
      setSelectedOption(searchText);
    
      const selectedTGName = options.find(option => option.name === searchText);
      if (selectedTGName) {
        // console.log('Selected selectedTGName ID:', selectedTGName.id);
        setSelectedTGNameId((prevIds) => [...prevIds, selectedTGName.id]);
        try {
          const response = await fetch(`${baseURL}/api/GetCharges/${selectedTGName.id}`);
          if (response.ok) {
            const data = await response.json();
            console.log('Charges data:', data);
            setSelectedOptionCharges((prevCharges) => [...prevCharges, ...data]);
          } else {
            console.error('Error fetching charges');
          }
        } catch (error) {
          console.error('Error fetching charges:', error);
        }
        setSelectedOption('');
      } else {
        setSelectedTGNameId([]);
      }
    };

    const calculateTotalCharges = () => {
      const totalCharges = selectedOptionCharges.reduce((acc, charge) => acc + charge.Charges, 0);
      setGAmnt(totalCharges);
      console.log('Charges:', totalCharges);
    };
    
    // Call the function to calculate total charges whenever selectedOptionCharges changes
    useEffect(() => {
      calculateTotalCharges();
    }, [selectedOptionCharges]);

    const handleDeleteRow = (index) => {
      const updatedCharges = [...selectedOptionCharges];
      updatedCharges.splice(index, 1);
      setSelectedOptionCharges(updatedCharges);

      const newGAmnt = updatedCharges.reduce((acc, charge) => acc + charge.Charges, 0);
      setGAmnt(newGAmnt);
    };

    const checkAgeType = () => {
      console.log('year:', year);
      console.log('month:', month);
      console.log('day:', day);
      if (parseFloat(year) > 0) {
        setAgeType('Year');
        setAge(year);
      } else if (parseFloat(month) > 0) {
        setAgeType('Month');
        setAge(month);
      } else if (parseFloat(day) > 0) {
        setAgeType('Day');
        setAge(day);
      }
    
      console.log('age:', age);
      console.log('ageType:', ageType);
    }
    
    useEffect(() => {
      calculateAmountPayable();
      fetchOptions();
      fetchRefferal();
    }, [gAmnt, cCharges, mgmtDsc, drDsc] );

    useEffect(() => {
      calculateBalance();
    }, [payableAmnt, advance] );

    const calculateAmountPayable = () => {
      const grossAmount = parseFloat(gAmnt);
      const collectionCharges = parseFloat(cCharges) || '';
      const mgmtDiscount = parseFloat(mgmtDsc) || '';
      const drDiscount = parseFloat(drDsc) || '';
    
      const amountPayable = grossAmount + collectionCharges - (mgmtDiscount + drDiscount);
    
      if (!isNaN(amountPayable)) {
        setPayableAmnt(amountPayable.toFixed(2)); // Round to 2 decimal places
      } else {
        setPayableAmnt('');
      }
    };

    const calculateBalance = () => {
      const Amount = parseFloat(payableAmnt);
      const advanceAmount = parseFloat(advance);
      
      const balance = Amount - advanceAmount 
    
      if (!isNaN(balance)) {
        setBalance(balance.toFixed(2)); // Round to 2 decimal places
      } else {
        setBalance('');
      }
    };

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

    const removeSuccessMessage = () => {
      setSuccessMessage('');
      setShowModal(false);
    };
  
    const handleSubmit = async (e) => {
      console.log('handleupload called');
      // e.preventDefault();
      
      if (isSubmitting) {
        return; 
      }
      setIsSubmitting(true); 
      setShowModal(true);
      setTimeout(() => {
        removeSuccessMessage();
      }, 2000); 
    
    const formData = new FormData();
    formData.append('rNo', rNo);
    formData.append('cDate', cDate);
    formData.append('cTime', cTime);
    formData.append('rDate', rDate);
    formData.append('rTime', rTime);
    formData.append('pNameTitle', pNameTitle);
    formData.append('pName', pName);
    formData.append('year', year);
    formData.append('month', month);
    formData.append('day', day);
    formData.append('age', age);
    formData.append('ageType', ageType);
    formData.append('gender', gender);
    formData.append('mNo', mNo);
    formData.append('rBy', rBy);
    formData.append('selectedRefferalId', selectedRefferalId);
    formData.append('cBy', cBy);
    formData.append('line1', line1);
    formData.append('oID', oID);
    formData.append('SelectedTGNameId', SelectedTGNameId);
    formData.append('gAmnt', gAmnt);
    formData.append('mgmtDsc', mgmtDsc);
    formData.append('drDsc', drDsc);
    formData.append('cCharges', cCharges);
    formData.append('payableAmnt', payableAmnt);
    formData.append('advance', advance);
    formData.append('balance', balance);
    formData.append('repNo', repNo);
    formData.append('pMode', pMode);
    formData.append('remarks', remarks);
    selectedOptionCharges.forEach((charge, index) => {
      formData.append(`selectedOptionCharges[${index}].SGName`, charge.SGName);
      formData.append(`selectedOptionCharges[${index}].Charges`, charge.Charges);
      formData.append(`selectedOptionCharges[${index}].SGType`, charge.SGType);
      formData.append(`selectedOptionCharges[${index}].DPTID`, charge.DPTID);
      formData.append(`selectedOptionCharges[${index}].SGID`, charge.SGID);
    });
    console.log(selectedOptionCharges)
      if(RFIID){
        try {
          const response = await fetch(`${baseURL}/api/UpdatePRegis/${RFIID}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({rNo, cDate, cTime, rDate, rTime, pNameTitle, pName, year, month, day, age, ageType, selectedGender, mNo, rBy, selectedRefferalId, cBy, line1, selectedOptionCharges, SelectedTGNameId, gAmnt, mgmtDsc, drDsc, cCharges, payableAmnt, advance, balance, repNo, pMode, remarks }),
          });
    
          if (response.ok) {
            console.log('Patient Details Updated successfully');
            setSuccessMessage('Patient Details Updated successfully.');
            setSelectedOption('');
            setCDate('');
            setCTime('');
            setRDate('');
            setRTime('');
            setPNameTitle('');
            setPName('');
            setYear('');
             
          } else {
            console.log("error in uploading")
          }
          } catch (error) {
            console.error('Error uploading', error);
          }
      } else {
        try {
          const response = await fetch(`${baseURL}/api/CPRegis`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rNo, bCode, abhaNo, adhaarNo, mNo, cDate, cTime, rDate, rTime, pNameTitle, pName, year, month, day, age, ageType, selectedGender, mail, rBy, selectedRefferalId, cBy, line1, address, selectedOptionCharges, gAmnt, mgmtDsc, drDsc, cCharges, payableAmnt, advance, balance, repNo, pMode, remarks, sId, oID }),
          });
    
          if (response.ok) {
            console.log('Patient Registered successfully');
            setSuccessMessage('Patient Registered successfully.');
            setRNo('')
            setBCode('');
            setAbhaNo('');
            setAdhaarNo('');
            setMNo('');
            setCDate('');
            setCTime('');
            setRDate('');
            setRTime('');
            setPNameTitle('');
            setPName('');
            setYear('');
            setMonth('');
            setDay('');
            setSelectedGender('');
            setMail('');
            setRBy('');
            setSelectedOption('');
            setSelectedRefferal('');
            setCBy('');
            setAddress('');
            setSelectedOptionCharges([]);
            setGAmnt('');
            setMgmtDsc('');
            setDrDsc('');
            setCCharges('');
            setPayableAmnt('');
            setAdvance('');
            setBalance('');
            setPMode('');
            setRemarks(''); 
          } else {
            console.log("error in uploading")
          }
          } catch (error) {
            console.error('Error uploading', error);
          }
      }
        setIsSubmitting(false);
    }

    useEffect(() => {
        fetch(`${baseURL}/api/fetchRNo`)
          .then((response) => response.json())
          .then((result) => {
            // console.log('API response:', result);
            if (result && result.length > 0) {
              let data = result; 
              setData(data[0]);
              setRepNo(data[0][''] || '');
              setRNo( '00' +data[0].RegNo || '');
            } else {
              console.log('No data received');
            }
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
    }, []);

    useEffect(() => {
      fetch(`${baseURL}/api/fetchOref`)
        .then((response) => response.json())
        .then((result) => {
          // console.log('API response:', result);
          if (result && result.length > 0) {
            const data = result[0].recordset;
            setData(data);
            setOref(data);
          } else {
            console.log('No data gotit');
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }, []);
    
    useEffect(() => {
      if (RFIID) {
        console.log('Fetching data for RFIID:', RFIID);
        fetch(`${baseURL}/api/updatePDetails/${RFIID}`)
          .then((response) => response.json())
          .then((result) => {
            console.log('API response:', result);
            if (result && result.length > 0) {
              const data = result[0]; 
              setData(data);
              setRNo(data.RegNo || '')
              setBCode(data.Barcode || '')
              setAbhaNo(data.AbhaNo || '')
              setAdhaarNo(data.AdharNo || '')
              setMNo(data.ContactNo || '');
              setCDate(data.Cdate ? data.Cdate.slice(0, 10) : '');
              setCTime(data.CTime ? data.CTime.slice(11, 16) : '');
              setRDate(data.RDate ? data.RDate.slice(0, 10) : '');
              setRTime(data.RTime.slice(11, 16) || '');
              setPNameTitle(data.Title || '');
              setPName(data.PName || '');
              setYear(data.Year || '');
              setMonth(data.Month || '');
              setDay(data.Day || '');
              setSelectedGender(data.Sex || '');
              setMail(data.Email || '');
              setRBy(data.Dr || '');
              setSelectedRefferal(data.RefName || '');
              setselectedRefferalId(data.RID || '');
              setCBy(data.CollBy || '');
              setLine1(data.CollCen || '');
              setAddress(data.Address || '');
              const gridData = result.map((item) => ({
                SGName: item.TestName,
                Charges: item.Rate,
              }));
              setSelectedOptionCharges(gridData);
              setGAmnt(data.GAmt || '');
              setMgmtDsc(data.MgmtDsc || '');
              setDrDsc(data.DrDiscount || '');
              setCCharges(data.CollCharge || '');
              setPayableAmnt(data.PAmt || '');
              setAdvance(data.Advance || '');
              setBalance(data.BalAmt || '');
              setPMode(data.PMode || '');
              setRepNo(data.RNo || '');
              setRemarks(data.Remarks || '');
            } else {
              console.log('No data received');
            }
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
        } else {
          console.log('TID is not defined or falsy');
          setRNo('');
          setCDate('');
          setCTime('');
          setRDate('');
          setRTime('');
          setPNameTitle('');
          setPName('');
          setYear('');
          setMonth('');
          setDay('');
          setSelectedGender('');
          setMNo('');
          setRBy('');
          setSelectedRefferal('');
          setCBy('');
          setSelectedOptionCharges([]);
          setGAmnt('');
          setMgmtDsc('');
          setDrDsc('');
          setCCharges('');
          setPayableAmnt('');
          setAdvance('');
          setBalance('');
          setPMode('');
          setRepNo('');
          setRemarks('');
        }
    }, [RFIID]);

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
<div className='container'>
    <div className='shadow-sm p-2 mb-2 bg-body-tertiary rounded'>
    <h5 className='text-center c2'>{RFIID ? 'Update Patient Registration' : 'Create Patient Registration'}</h5>
        <form className='form-container' onSubmit={handleSubmit}>
           <div className='row'>
               <div className='col-md-7'>
                   <div className='row'>
                    <div className='col-md-2'>
                    <label  className='form-label' htmlFor="title">Reg No:</label>
                    <input  className='form-input form-right'  name="newsTitle" type="number" id="newsTitle" value={rNo}  readOnly required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">Bar Code:</label>
                    <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={bCode}  onChange={handleBCodeChange} required />
                    </div>
                    <div className='col-md-6'>
                    <label  className='form-label' htmlFor="title">ABHA No:</label>
                    <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={abhaNo}  onChange={handleABHANoChange} required />
                    </div>
                    <div className='col-md-6'>
                    <label  className='form-label' htmlFor="title">Adhaar No:</label>
                    <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={adhaarNo}  onChange={handleAdhaarNoChange} required />
                    </div>
                    <div className='col-md-6'>
                    <label  className='form-label' htmlFor="title">Mobile No:</label>
                    <input  className='form-input'  name="newsTitle" type="number" id="newsTitle" value={mNo}  onChange={handleMNoChange} required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">C Date:</label>
                    <input  className='form-input'  name="newsTitle" type="date" id="newsTitle" value={cDate}  onChange={handleCDateChange} required />
                    </div>
                    <div className='col-md-2'>
                    <label  className='form-label' htmlFor="title">Time:</label>
                    <input  className='form-input'  name="newsTitle" type="time" id="newsTitle" value={cTime}  onChange={handleCTimeChange} required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">R Date:</label>
                    <input  className='form-input'  name="newsTitle" type="date" id="newsTitle" value={rDate}  onChange={handleRDateChange} required />
                    </div>
                    <div className='col-md-2'>
                    <label  className='form-label' htmlFor="title">Time:</label>
                    <input  className='form-input'  name="newsTitle" type="time" id="newsTitle" value={rTime}  onChange={handleRTimeChange} required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">Name:</label>
                    <select className="form-control" id="dropdown" name="gender" value={pNameTitle} onChange={handlePNameTitleChange}>
                        <option value="">Select an option</option>
                        {nTitle.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                       </select>
                    </div>
                    <div className='col-md-8'>
                    <label  className='form-label text-white' htmlFor="title">:</label>
                    <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={pName}  onChange={handlePNameChange} required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">Age:</label>
                    <input  className='form-input form-right'  name="newsTitle" type="number" id="newsTitle" placeholder='Year' value={year}  onChange={handleYearChange} required />
                    </div>
                    <div className='col-md-3'>
                    <label  className='form-label text-white' htmlFor="title">:</label>
                    <input  className='form-input form-right'  name="newsTitle" type="number" id="newsTitle" placeholder='Month' value={month}  onChange={handleMonthChange} required />
                    </div>
                    <div className='col-md-3'>
                    <label  className='form-label text-white' htmlFor="title">:</label>
                    <input  className='form-input form-right'  name="newsTitle" type="number" id="newsTitle" placeholder='Day' value={day}  onChange={handleDayChange} required />
                    </div>
                    <div className='col-md-2'>
                    <label  className='form-label' htmlFor="title">Gender:</label>
                    <select className="form-control" id="dropdown" name="gender" value={selectedGender} onChange={handleSelectedGenderChange}>
                        <option value="">Select</option>
                        {gender.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                       </select>
                    </div>
                   </div>
               </div>
               <div className='col-md-5'>
                    <div className='row'>
                        <div className='col-md-12'>
                        <label  className='form-label' htmlFor="title">Email:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={mail}  onChange={handleMailChange} required />
                        </div>
                        <div className='col-md-12'>
                        <label  className='form-label' htmlFor="title">Referred By:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={rBy}  onChange={handleRByChange} required list="oRefOptions" placeholder="Type to search..."/>
                        <datalist id="oRefOptions">
                        {oRef.map((option, index) => (
                          <option key={index} value={option.Oref}>
                            {option.name}
                          </option>
                        ))}
                        </datalist>
                        </div>
                        <div className='col-md-12'>
                        <label  className='form-label' htmlFor="title">Referral Name :</label>
                        <select className="form-control" id="dropdown" name="gender" value={selectedRefferal} onChange={handleRefferalChange}>
                        <option value="">Select an option</option>
                        {refferal.map((option, index) => (
                            <option key={index} value={option.name}>
                                {option.name}
                            </option>
                        ))}
                       </select>
                        </div>
                        <div className='col-md-6'>
                        <label  className='form-label' htmlFor="title">Collected By:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={cBy}  onChange={handleCByChange} required />
                        </div>
                        <div className='col-md-6'>
                        <label  className='form-label' htmlFor="title">{centreType}:</label>
                        <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={line1} readOnly />
                        </div>
                        <div className='col-md-12'>
                        <label  className='form-label' htmlFor="title">Address:</label>
                        <textarea  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={address}  onChange={handleAddressChange} required ></textarea>
                        </div>
                    </div>
               </div>
               <div className='col-md-7'>
                    <label  className='form-label' htmlFor="title">Test Name:</label>
                    <input className='form-input' type="text" value={selectedOption} onChange={handleSelectedOptionChange} list="testNameOptions" placeholder="Type to search..."/>
                    <datalist id="testNameOptions">
                    {options.map((option, index) => (
                      <option key={index} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                    </datalist>
               <table className="table table-bordered mtable">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Charges</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOptionCharges.map((value, index) => (
                    <tr key={index}>
                      <td>{value.SGName}</td>
                      <td>{value.Charges}</td>
                      <td><p className='badge badge-danger-lighten' onClick={() => handleDeleteRow(index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></p></td>
                    </tr>
                  ))}
                </tbody>
                </table>
               </div>
               <div className='col-md-5'>
                   <div className='row'>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">Gross Amount:</label>
                    <input  className='form-input form-right'  name="newsTitle" type="number" id="newsTitle" value={gAmnt}  readOnly required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">Mgmt Disc:</label>
                    <input  className='form-input form-right'  name="newsTitle" type="number" id="newsTitle" value={mgmtDsc}  onChange={handleMgmtDscChange} required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">Dr Discount:</label>
                    <input  className='form-input form-right'  name="newsTitle" type="number" id="newsTitle" value={drDsc}  onChange={handleDrDscChange} required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">Collection Charges:</label>
                    <input  className='form-input form-right'  name="newsTitle" type="number" id="newsTitle" value={cCharges}  onChange={handleCChargesChange} required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">Amount Payabale:</label>
                    <input  className='form-input form-right'  name="newsTitle" type="number" id="newsTitle" value={payableAmnt}  readOnly required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">Advance:</label>
                    <input  className='form-input form-right'  name="newsTitle" type="number" id="newsTitle" value={advance}  onChange={handleAdvanceChange} required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">Balance:</label>
                    <input  className='form-input form-right'  name="newsTitle" type="number" id="newsTitle" value={balance}  readOnly required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">Receipt No:</label>
                    <input  className='form-input form-right'  name="newsTitle" type="number" id="newsTitle" value={repNo} readOnly required />
                    </div>
                    <div className='col-md-4'>
                    <label  className='form-label' htmlFor="title">Pay Mode:</label>
                    <select className="form-control" id="dropdown" name="gender" value={pMode} onChange={handlePModeChange}>
                        <option value="">Select an option</option>
                        {mode.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                       </select>
                    </div>
                    <div className='col-md-12'>
                    <label  className='form-label' htmlFor="title">Dis. Remarks:</label>
                    <input  className='form-input'  name="newsTitle" type="text" id="newsTitle" value={remarks}  onChange={handleRemarksChange} required />
                    </div>
                   </div>
               </div>
            </div>
            <div className='my-2 text-center'>
        <button className="btn btn-info mx-2" type="button" onClick={(event) => {  event.preventDefault(); handleSubmit(); checkAgeType(); }}>{RFIID? 'Update' : 'Create'}</button>
      </div>
        </form>
    </div>
</div>
    </>
  )
}
