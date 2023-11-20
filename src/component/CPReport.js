import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import header from '../Images/CareHeader copy.png'
import  '../CSS/Style.css'
import baseURL from './apiConfig';

export const ComponentToPrint = React.forwardRef((props, ref) => {
    const { RFIID } = props; 
    const { SGID } = props; 
    const [formData, setFormData] = useState({}); 
    const [Data, setData] = useState([]);
    const downloadFilename = 'medical_report.pdf';
    // console.log('ComponentToPrint props:', props);


    useEffect(() => {
        fetch(`${baseURL}/api/GetPatientData/${RFIID}/${SGID}`)
        .then((response) => response.json())
        .then(formDataArray => {
            const formData = formDataArray[0];
            console.log("formData", formData);
            setFormData(formData);
        })
        .then(() => {
            // Fetch Data (assuming Data is an array)
            fetch(`${baseURL}/api/GetPatientData/${RFIID}/${SGID}`)
            .then((response) => response.json())
            .then(DataArray => {
                // console.log(DataArray);
                setData(DataArray);
            })
            .catch((error) => {
                console.error('Error fetching Data:', error);
            });
        })   
    }, [RFIID]);    

    // const qrCodeValue = `http://192.168.1.12:3000/PrPrint?RFIID=${RFIID}`;
    const qrCodeValue = `http://192.168.1.12:3000/PrPrint/${RFIID}/${SGID}`;

    console.log(qrCodeValue)


    return (
<div ref={ref} style={{margin:'20px 40px'}} className="component-to-print">
        <hr className='my-3'/>
    <div>
        <img src={header} alt="Nature" class="responsive" width="600" height="400" />
    </div>
        <h5 className='text-center'><span>(A Fully Computarized Lab)</span></h5>
<div className="pathology-report">
    <div className="row border border-dark">
        <div className="col-md-4 mt-2">
            <p><strong className='padRig'>Reg No: </strong>{formData.REgNo || ''}</p>
            <p><strong className='padRig'>Name: </strong>{formData.Title + " " + formData.PName  || '' }</p>
            <p><strong className='padRig'>Ref By:</strong> {formData.RefName || ''}</p>
        </div>
        <div className="col-md-4 mt-2">
            <p><strong className='padRig'>Gender: </strong>{formData.Sex || ''}</p>
            <p><strong className='padRig'>Age:</strong>{formData.Year + "/" + formData.Month + "/" + formData.Day || ''}</p>
        </div>
        <div className='col-md-4 mt-2'>
        <p><strong className='padRig'>Collected: </strong>{formData.ColDate ? formData.ColDate.slice(0, 10) : ''}</p>
        <p><strong className='padRig'>Received: </strong>{formData.RcdDate ? formData.RDate.slice(0, 10) : ''}</p>
        <p><strong className='padRig'>Reported: </strong>{formData.RepDate ? formData.RDate.slice(0, 10) : ''}</p>
        </div>
        <div className="col-md-3 my-2 border-top border-dark">
            <p><strong className='padRig'>Test Description: </strong>{formData.TestDescription || ''}</p>
        </div>
        <div className="col-md-3 my-2 border-top border-dark">
            <p><strong className='padRig'>Observed Value: </strong>{formData.TestDescription || ''}</p>
        </div>
        <div className="col-md-3 my-2 border-top border-dark">
            <p><strong className='padRig'>Unit: </strong>{formData.TestDescription || ''}</p>
        </div>
        <div className="col-md-3 my-2 border-top border-dark">
            <p><strong className='padRig'>Biological Ref.: </strong>{formData.TestDescription || ''}</p>
        </div>
    </div>
    {/* Main Report Details Box */}
    <div className="report-details-box border border-dark mt-3">
        <h6 className='text-center border border-dark p-2'>{formData.TGName || ''}</h6>
        <div className='col-md-12 p-2'><p><strong>{formData.SGName || ''}</strong></p></div>
            {Data.map((data, index) => (
        <div className='row pad' key={index}>
        <div className='col-md-6'>
        <div>
            <p><strong>{data.TName || ''}</strong></p>
            <p>{data.TestMethod || ''}</p>
        </div>
        </div>
        <div className='col-md-2'>
            <p><strong>{data.RValue || ''}</strong></p>
        </div>
        <div className='col-md-2'>
            <p><strong>{data.UnitName || ''}</strong></p>
        </div>
        <div className='col-md-2'>
            <p><strong>{data.Display || ''}</strong></p>
        </div>
        </div>
          ))}
    </div>
</div>
<div className='mt-5'>
<center>
<a
  href={qrCodeValue} // Without the ?download=true query parameter
  download={downloadFilename}
  title="Download Medical Report"
  style={{ textDecoration: 'none' }}
  onClick={() => {
    window.location.href = qrCodeValue; // Just set the QR code link
  }}
>
  <QRCode
    value={qrCodeValue}
    bgColor={formData.back || 'white'}
    fgColor={formData.fore || 'black'}
    size={formData.size || 80}
  />
</a>
</center>
</div>
      </div>
    );
});