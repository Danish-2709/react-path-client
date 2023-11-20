import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import React from 'react';
import { SessionProvider } from './component/SessionContext';
import './App.css';
import MyLogIn from './component/MyLogIn'
import AdminPanel from './component/AdminPanel'
import DocPanel from './component/DocPanel'
import PatientPanel from './component/PatientPanel'
import Dashboard from './component/Dashboard'
import Sidebar from './component/Sidebar'
import DocSideBar from './component/DocSideBar'
import DocViewComponent from './component/DocViewComponent'
import DrPCPReport from './component/DrPCPReport'
import Cdepart from './component/Cdepart'
import Cunit from './component/Cunit'
import CTGroup from './component/CTGroup'
import Cpackage from './component/Cpackage'
import CRefMaster from './component/CRefMaster'
import CSGMaster from './component/CSGMaster'
import ViewCSG from './component/ViewCSG'
import EditCSG from './component/EditCSG'
import CTNRange from './component/CTNRange'
import CAWRange from './component/CAWRange'
import CDRange from './component/CDRange'
import CTWLValue from './component/CTWLValue'
import ViewTest from './component/ViewTest'
import CRadiology from './component/CRadiology'
import CPRegistration from './component/CPRegistration'
import PCPReport from './component/ParentCPReport'
import PrPrint from './ToPrint/PrPrint'
import DrPrPrint from './ToPrint/DrPrPrint'
import CResult from './component/CResult'
import ViewPReg from './component/ViewPReg'
import WaitingList from './component/WaitingList'
import TestWaitingList from './component/TestWaitingList'
import CollDetails from './component/CollDetails'
import ColCenMaster from './component/ColCenMaster'
import CUserLogin from './component/CUserLogin'
import UUserLogin from './component/UUserLogin'

function App() {
  return (
    <Router Basename={process.env.PUBLIC_URL}>
      <SessionProvider>
        <Routes>
          <Route  path="/" element={
          <>              
          <MyLogIn />
          </>
          } />
          <Route  path="/AdminPanel" element={
            <>        
            <div className='grid-display'>
              <AdminPanel />      
              <Sidebar />
              <Dashboard />
            </div>
            </>
          } />
          <Route  path="/DocPanel" element={
            <>        
            <div className='grid-display'>
              <DocPanel />      
              <DocSideBar />     
            </div>
            </>
          } />
          <Route  path="/DocViewComponent" element={
            <>        
            <div className='grid-display'>
              <DocPanel />      
              <DocSideBar />     
              <DocViewComponent />     
            </div>
            </>
          } />
          <Route  path="/DrPCPReport/:RFIID?" element={
            <>        
              <DocPanel />      
              <DrPCPReport />     
            </>
          } />
          <Route  path="/DrPrPrint/:RFIID?" element={
            <>        
              <DocPanel />      
              <DrPrPrint />     
            </>
          } />
          <Route  path="/PatientPanel" element={
            <>        
            <div className='grid-display'>
              <PatientPanel />      
              <DocSideBar />
            </div>
            </>
          } />
          <Route  path="/Cdepart" element={
            <> 
            <div className='grid-display'>
              <AdminPanel />
              <Sidebar />
              <Cdepart />
            </div>             
            </>
          } />
          <Route  path="/Cunit" element={
            <> 
            <div className='grid-display'>
              <AdminPanel />
              <Sidebar />
              <Cunit />
            </div>
             </>
          } />
      <Route  path="/CTGroup" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <CTGroup />
      </div>             
      </>
      } />
      <Route  path="/Cpackage" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <Cpackage />
      </div>             
      </>
      } />
      <Route  path="/CRefMaster/:RID?" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <CRefMaster />
      </div>             
      </>
      } />
      <Route  path="/CSGMaster" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <CSGMaster />
      </div>             
      </>
      } />
      <Route  path="/ViewCSG" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <ViewCSG />
      </div>             
      </>
      } />
      <Route  path="/EditCSG/:SGID" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <EditCSG />
      </div>             
      </>
      } />
      <Route  path="/CTNRange/:TID?" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <CTNRange/>   
      </div>          
      </>
      } />
      <Route  path="/CAWRange/:TID?" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <CAWRange/>   
      </div>          
      </>
      } />
      <Route  path="/CDRange/:TID?" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <CDRange/>   
      </div>          
      </>
      } />
      <Route  path="/CTWLValue/:TID?" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <CTWLValue/>   
      </div>          
      </>
      } />
      <Route  path="/CRadiology/:TID?" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <CRadiology/>   
      </div>          
      </>
      } />
      <Route  path="/CPRegistration/:RFIID?" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <CPRegistration/>   
      </div>          
      </>
      } />
      <Route  path="/PCPReport/:RFIID?/:SGID?" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <PCPReport/>   
      </div>          
      </>
      } />
      <Route  path="/CResult/:RFIID?" element={
      <> 
      <div className='row'>
        <div className='col-md-12'>
        <AdminPanel />
        </div>
        <div className='col-md-2 px-1'>
        <Sidebar />
        </div>
        <div className='col-md-10 px-1'>
        <CResult/>   
        </div>
      </div>          
      </>
      } />
      <Route  path="/PrPrint/:RFIID?/:SGID?" element={
      <> 
      <PrPrint/>         
      </>
      } />
      <Route  path="/ViewTest" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <ViewTest/>   
      </div>          
      </>
      } />
      <Route  path="/ViewPReg" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <ViewPReg/>   
      </div>          
      </>
      } />
      <Route  path="/WaitingList" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <WaitingList/>   
      </div>          
      </>
      } />
      <Route  path="/TestWaitingList" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <TestWaitingList/>   
      </div>          
      </>
      } />
      <Route  path="/CollDetails" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <CollDetails/>   
      </div>          
      </>
      } />
      <Route  path="/ColCenMaster/:OID?" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <ColCenMaster/>   
      </div>          
      </>
      } />
      <Route  path="/CUserLogin" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <CUserLogin/>   
      </div>          
      </>
      } />
      <Route  path="/UUserLogin/:LoginID?" element={
      <> 
      <div className='grid-display'>
      <AdminPanel />
      <Sidebar />
      <UUserLogin/>   
      </div>          
      </>
      } />
        </Routes>
      </SessionProvider>
    </Router>
  );
}
   //  "@material-ui/core": "^4.12.4", 
export default App;
