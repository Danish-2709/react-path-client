import React, { useRef, useEffect, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from './DrPrint';
import { useParams } from 'react-router-dom';
import baseURL from '../component/apiConfig';

export default function DrPrPrint() {
  const { RFIID } = useParams();
  const registrationFormRef = useRef(null); 
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/api/GetDrPatientData/${RFIID}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const firstDataObject = data[0];
            setFormData(firstDataObject); 
            // console.log(data)
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
    if (RFIID) {
      fetchData(); // Fetch data when RFIID is available
    }
  }, [RFIID]);
 
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
    <div className='d-flex justify-content-center'>
      <div>
      {formData && (
        <ReactToPrint
          content={() => registrationFormRef.current}
        />
      )}
      <div style={{ display: 'block' }}>
      {formData && <ComponentToPrint ref={registrationFormRef} RFIID={RFIID} />}
      </div>
    </div>
    </div>
    </>
  )
}
