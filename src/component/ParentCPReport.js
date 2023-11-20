import React, { useRef, useEffect, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from './CPReport';
import { useParams } from 'react-router-dom';
import baseURL from './apiConfig';

export default function PCPReport() {
  const { RFIID } = useParams();
  const { SGID } = useParams();
  const registrationFormRef = useRef(null); 
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/api/GetPatientData/${RFIID}/${SGID}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const firstDataObject = data[0];
            setFormData(firstDataObject); 
          } else {
            console.error('No data found in the response');
          }
        } else {
          console.error('Error fetching form data');
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    if (RFIID && SGID) {
      fetchData(); // Fetch data when RFIID is available
    }
  }, [RFIID, SGID]);
 
  useEffect(() => {
    const handleQRCodeScanned = (event) => {
      // window.parent.postMessage('QR Code Scanned', '*');
      if (event.data === 'QR Code Scanned') {
        console.log('QR Code Scanned:', event.data); 
        // QR code scanned, trigger the click event of the "Print Report" button
        const printReportButton = document.getElementById('print-button');
        if (printReportButton) {
          printReportButton.click();
        }
      }
    };
  
    window.addEventListener('message', handleQRCodeScanned);
  
    return () => {
      window.removeEventListener('message', handleQRCodeScanned);
    };
  }, []);


  
  return (
    <>
  <div className='d-block m-auto my-5'>
        <h1 className='text-center'>Print Report For.</h1>
        {formData && (
        <h6 className='text-center'><span className='text-uppercase text-success'>{formData.Title + " " + formData.PName  || '' }</span>.</h6>
      )}
      
        <div className='my-5 d-flex justify-content-center'>
      <div>
      {formData && (
        <ReactToPrint
          trigger={() => <a href="#" className='btn btn-success'  id="print-button">Print Report!</a>}
          content={() => registrationFormRef.current}
        />
      )}
      <div style={{ display: 'none' }}>
      {formData && <ComponentToPrint ref={registrationFormRef} RFIID={RFIID} SGID={SGID} />}
      </div>
    </div>
    </div></div>
    <footer className="fixed-bottom bg-light text-center p-2">
        <p><span className='text-danger'>Note: </span>
          Click on Print Button To Save Report As PDF
          <br />
          IN Mobile, Click On Three Dots At Top Right Of The Screen
        </p>
      </footer>  
    </>
  )
}
