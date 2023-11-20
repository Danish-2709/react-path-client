// import React, { useEffect, useState } from 'react';
// import { Card, Row, Col } from 'react-bootstrap';
// import { Bar } from 'react-chartjs-2';

// export default function Dashboard() {
//   // Sample data for the graph
//   const [chartData, setChartData] = useState({
//     labels: ['January', 'February', 'March', 'April', 'May'],
//     datasets: [
//       {
//         label: 'Sample Data',
//         data: [12, 19, 3, 5, 2],
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   });

//   const [chartOptions, setChartOptions] = useState({
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Months',
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Value',
//         },
//       },
//     },
//   });

//   useEffect(() => {
//     // You can update the chart data and options here if needed
//     // For example, if you want to change the chart data dynamically
//     // setChartData(newData);
//     // setChartOptions(newOptions);
//   }, []);

//   return (
//     <div>
//       <h2>Dashboard</h2>
//       <Row>
//         <Col>
//           <Card>
//             <Card.Header>Chart</Card.Header>
//             <Card.Body>
//               <Bar data={chartData} options={chartOptions} />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }
import React, { useEffect, useRef, useState } from 'react';
// import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, Title, } from 'chart.js';
// import { Chart, getDatasetAtEvent, getElementAtEvent, getElementsAtEvent } from 'react-chartjs-2';
import { PieChart, Pie } from 'recharts';
import faker from 'faker';
import baseURL from './apiConfig';


// ChartJS.register(
//   LinearScale,
//   CategoryScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   LineController,
//   Title,
//   Legend,
//   Tooltip
// );

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const generateRandomData = () => {
  return {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Dataset 1',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        fill: false,
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      },
      {
        type: 'bar',
        label: 'Dataset 2',
        backgroundColor: 'rgb(75, 192, 192)',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'white',
        borderWidth: 2,
      },
      {
        type: 'bar',
        label: 'Dataset 3',
        backgroundColor: 'rgb(53, 162, 235)',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      },
    ],
  };
};

export default function Dashboard() {
  const [chartData, setChartData] = useState(generateRandomData());
  const [totalPatients, setTotalPatients] = useState('');
  const [todayPatients, setTodayPatients] = useState('');
  const [todayColl, setTodayColl] = useState('');
  const [totalColl, setTotalColl] = useState('');

  const data = [
    { name: 'Group A', students: 25, fill: '#0acf97' },
    { name: 'Group B', students: 30, fill: '#727cf5' },
    { name: 'Group C', students: 25, fill: '#fa5c7c' },
    { name: 'Group D', students: 20, fill: '#ffbc00' },
  ];

  // const printDatasetAtEvent = (dataset) => {
  //   if (!dataset.length) return;

  //   const datasetIndex = dataset[0].datasetIndex;

  //   console.log(chartData.datasets[datasetIndex].label);
  // };

  // const printElementAtEvent = (element) => {
  //   if (!element.length) return;

  //   const { datasetIndex, index } = element[0];

  //   console.log(chartData.labels[index], chartData.datasets[datasetIndex].data[index]);
  // };

  // const printElementsAtEvent = (elements) => {
  //   if (!elements.length) return;

  //   console.log(elements.length);
  // };

  // const chartRef = useRef(null);

  // const onClick = (event) => {
  //   const { current: chart } = chartRef;

  //   if (!chart) {
  //     return;
  //   }

  //   printDatasetAtEvent(getDatasetAtEvent(chart, event));
  //   printElementAtEvent(getElementAtEvent(chart, event));
  //   printElementsAtEvent(getElementsAtEvent(chart, event));
  //   setChartData(generateRandomData()); // Update chart data dynamically
  // };

  useEffect(() => {
    fetch(`${baseURL}/api/getDashData`)
      .then(response => response.json())
      .then(data => {
        const dataArray = data.recordset;
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          // Access the total number from the first recordset and update the state
          setTotalPatients(dataArray[0]['']);
        } else {
          console.error('Invalid data format from the API');
        }
      })
      .catch(error => {
        // Handle any fetch errors
      });
  }, []); 

  useEffect(() => {
    fetch(`${baseURL}/api/getDashToData`)
      .then(response => response.json())
      .then(data => {
        const dataArray = data.recordset;
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          // Access the total number from the first recordset and update the state
          setTodayPatients(dataArray[0]['']);
        } else {
          console.error('Invalid data format from the API');
        }
      })
      .catch(error => {
        // Handle any fetch errors
      });
  }, []); 

  useEffect(() => {
    fetch(`${baseURL}/api/getDashToAmntData`)
      .then(response => response.json())
      .then(data => {
        const dataArray = data.recordset;
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          setTodayColl(dataArray[0]['']);
        } else {
          console.error('Invalid data format from the API');
        }
      })
      .catch(error => {
        // Handle any fetch errors
      });
  }, []); 

  useEffect(() => {
    fetch(`${baseURL}/api/getDashAmntData`)
      .then(response => response.json())
      .then(data => {
        const dataArray = data.recordset;
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          // Access the total number from the first recordset and update the state
          setTotalColl(dataArray[0]['']);
        } else {
          console.error('Invalid data format from the API');
        }
      })
      .catch(error => {
        // Handle any fetch errors
      });
  }, []); 

  return (
   <div className='Drow'>
    <div className="col-md-12">
      <div className="Drow">
        <div className="col-sm-2 mx-3">
          <div className="widget-flat card">
            <div className="card-body">
              <div className="float-end">
                <i className="mdi mdi-account-multiple widget-icon"></i>
              </div>
                <h5 className="fw-normal mt-0 text-muted" title="Number of Customers">Today's Patients</h5>
                <h3 className="mt-3 mb-3">{todayPatients || "0"}</h3>
                <p className="mb-0 text-muted">
                <span className="text-success me-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg> 5.27%</span></p>
                <span className="text-nowrap text-muted">Since last month</span>
            </div>
          </div>
        </div>
        <div className="col-sm-2 mx-3">
          <div className="widget-flat card">
            <div className="card-body">
              <div className="float-end">
                <i className="mdi mdi-cart-plus widget-icon"></i>
                </div>
                <h5 className="fw-normal mt-0 text-muted" title="Number of Orders">Total Patients</h5>
                <h3 className="mt-3 mb-3">{totalPatients || 'Loading...'}</h3>
                <p className="mb-0 text-muted">
                  <span className="text-danger me-2"><i className="mdi mdi-arrow-down-bold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg></i> 1.08%</span></p>
                <span className="text-nowrap text-muted">Since last month</span>
            </div>
          </div>
        </div>
        <div className="col-sm-2 mx-3">
          <div className="widget-flat card">
            <div className="card-body">
              <div className="float-end">
                <i className="mdi mdi-currency-usd widget-icon"></i>
              </div>
              <h5 className="fw-normal mt-0 text-muted" title="Revenue">Today's Collection</h5>
              <h3 className="mt-3 mb-3">{`₹ ${todayColl}` || '0'}</h3>
              <p className="mb-0 text-muted">
                <span className="text-danger me-2"><i className="mdi mdi-arrow-down-bold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg></i> 7.00%</span>
              </p>
                <span className="text-nowrap text-muted">Since last month</span>
            </div>
          </div>
        </div>
        <div className="col-sm-2 mx-3">
        <div className="widget-flat card">
          <div className="card-body">
            <div className="float-end">
              <i className="mdi mdi-pulse widget-icon"></i>
            </div>
            <h5 className="fw-normal mt-0 text-muted" title="Growth">Total Collection</h5>
            <h3 className="mt-3 mb-3">{`₹ ${totalColl}` || 'Loading....'}</h3>
            <p className="mb-0 text-muted"><span className="text-success me-2"><i className="mdi mdi-arrow-up-bold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg></i> 4.87%</span></p>
            <span className="text-nowrap text-muted">Since last month</span>
          </div>
        </div>
        </div>   
        <div className="col-sm-2 mx-3">
        <PieChart width={190} height={200}>
            <Pie data={data} dataKey="students" outerRadius={90} fill="fill" />
        </PieChart>
        </div>   
      </div>
  </div>
    {/* <div className="col-md-8 chart-container">
      <Chart
        ref={chartRef}
        type='bar'
        onClick={onClick}
        options={options}
        data={chartData}
      />
    </div> */}
   </div>
  );
}

