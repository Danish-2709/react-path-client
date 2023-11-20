import React, { useRef, useEffect, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from './Rprint';
import { useParams } from 'react-router-dom';
import baseURL from '../component/apiConfig';

export default function PrPrint( ) {
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
          // Check if data is an array and contains at least one object
          if (Array.isArray(data) && data.length > 0) {
            const firstDataObject = data[0];
            setFormData(firstDataObject); // Set the fetched form data
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
      fetchData(); // Fetch data when mId is available
    }
  }, [RFIID, SGID]);

  

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
      {formData && <ComponentToPrint ref={registrationFormRef} RFIID={RFIID} SGID={SGID}/>}
      </div>
    </div>
    </div>
    </>
  );
}
