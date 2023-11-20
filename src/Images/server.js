const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const app = express();
const session = require('express-session');
const cookieParser = require("cookie-parser");
process.env.TZ = 'UTC';
app.use(cors('http://localhost:3000'));
app.use(session({ secret: 'H#k7^P3wLs&Rt@9v!ZnY5qR8zFkA2eV', resave: true, saveUninitialized: true  })); 
app.use(bodyParser.json());
app.use(cookieParser());


// Create a MySQL connection
const config = {
  user: 'sa',
  password: '123',
  server: 'DESKTOP-PD2OT2D\\SERVER1', // or IP address
  database: 'createDepart',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  }
};

const sqlServerCon = new sql.ConnectionPool(config);

sqlServerCon.connect()
  .then(() => {
    console.log('Connected to SQL Server');
  })
  .catch(err => {
    console.error('Error connecting to SQL Server', err);
  });

  app.get('/', (req, res) => {
    res.send('Welcome to the root of the server!');
  });
  
/*----------------------------------------------------------------
--------------------API For LogIn Page ---------------------------
--------------------------------------------------------------- */
app.post('/api/MyLogIn', (req, res) => {
  const { username, password } = req.body;
  // console.log('Received request with username:', username, 'and password:', password);

  const request = new sql.Request(sqlServerCon);
  request.input('username', sql.VarChar(50), username);
  request.input('password', sql.NVarChar(100), password);

  const queryString = 'SELECT top 1  LoginType,LoginName, [Password],LoginMaster.OID, SSID, SSYear, LabName, CentreType, Line1 FROM [createDepart].[dbo].[loginMaster] inner join Orgmaster on Orgmaster.OID=LoginMaster.OID, Sessionmaster where LoginName=@username and Password=@password order by SSID desc';
  request.query(queryString, function (error, results, fields) {
    if (error) {
      console.error('Error during database query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results && results.recordset && results.recordset.length > 0) {
        const user = results.recordset[0];
        // console.log('User object:', user);
        if (user && user.LoginType) {
          req.session.loggedIn = true;
          req.session.loginType = user.LoginType;
          req.session.sId = user.SSID;
          req.session.oID = user.OID;
          req.session.sYear = user.SSYear;
          req.session.labName = user.LabName;
          req.session.centreType = user.CentreType;
          req.session.line1 = user.Line1;
          console.log('req.session.loggedIn:', req.session.loggedIn);
          console.log('Login successful for user:', username, 'with loginType:', user.LoginType, 'and session Id:', user.SSID, 'and ORG Id:', user.OID,'and session year:', user.SSYear, 'and lab Name:', user.LabName, 'and CentreType:', user.CentreType, 'and Line1:', user.Line1);
          res.status(200).json({ success: true, message: 'Login successful', loginType: user.LoginType, sId: user.SSID, sYear: user.SSYear, labName: user.LabName, centreType: user.CentreType, line1: user.Line1, oID: user.OID});
        } else {
          console.log('Login failed for user:', username);
        }
      } else {
        console.log('Login failed for user:', username);
        res.status(401).json({ error: 'Incorrect credentials' });
      }
    }
  });
});

app.post('/api/DrLogIn', (req, res) => {
  const { username, password } = req.body;
  console.log('Received request with username:', username, 'and password:', password);

  const request = new sql.Request(sqlServerCon);
  request.input('username', sql.VarChar(50), username);
  request.input('password', sql.NVarChar(100), password);

  const queryString = 'SELECT  RID, RName, UserID, Pwd from ReferalMaster where UserID = @username and Pwd = @password';
  request.query(queryString, function (error, results, fields) {
    if (error) {
      console.error('Error during database query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results && results.recordset && results.recordset.length > 0) {
        const doctor = results.recordset[0];
        // console.log('User object:', user);
        if (doctor && doctor.RName) {
          req.session.loggedIn = true;
          req.session.doctorlogin = 'Doctor'
          req.session.dLoginName = doctor.RName;
          req.session.rID = doctor.RID;
          console.log('req.session.loggedIn:', req.session.loggedIn);
          console.log('Login successful for user:', username, 'with loginName:', doctor.RName, 'and session rID:', doctor.RID);
          res.status(200).json({ success: true, message: 'Login successful',  dLoginName: doctor.RName, rID: doctor.RID});
        } else {
          console.log('Login failed for user:', username);
        }
      } else {
        console.log('Login failed for user:', username);
        res.status(401).json({ error: 'Incorrect credentials' });
      }
    }
  });
});

app.post('/api/PatientLogIn', (req, res) => {
  const { username, password } = req.body;
  console.log('Received request with username:', username, 'and password:', password);

  const request = new sql.Request(sqlServerCon);
  request.input('username', sql.VarChar(50), username);
  request.input('password', sql.NVarChar(100), password);

  const queryString = 'SELECT  RFIID, ContactNo, RegNo, Title, PName from RFIMaster where ContactNo = @username and RegNo = @password';
  request.query(queryString, function (error, results, fields) {
    if (error) {
      console.error('Error during database query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results && results.recordset && results.recordset.length > 0) {
        const patient = results.recordset[0];
        // console.log('User object:', user);
        if (patient && patient.PName) {
          req.session.loggedIn = true;
          req.session.patientlogin = 'Patient'
          req.session.loginNameT = patient.Title;
          req.session.loginName = patient.PName;
          req.session.rfiID = patient.RFIID;
          console.log('req.session.loggedIn:', req.session.loggedIn);
          console.log('Login successful for user:', username, 'with loginName:', patient.PName, 'and session rfiID:', patient.RFIID);
          res.status(200).json({ success: true, message: 'Login successful', loginNameT: patient.Title,  loginName: patient.PName, rfiID: patient.RFIID});
        } else {
          console.log('Login failed for user:', username);
        }
      } else {
        console.log('Login failed for user:', username);
        res.status(401).json({ error: 'Incorrect credentials' });
      }
    }
  });
});

const authenticateMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    const loginType = req.session.loginType;
    if (loginType === 'Admin') {
      next(); 
    } else if (req.session.patientlogin === 'Patient') {
      next();
    } else if (req.session.doctorlogin === 'Doctor') {
      next();
    } else {
      res.status(403).json({ error: 'Unauthorized: Insufficient privileges' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/AdminPanel', authenticateMiddleware, (req, res) => {
  const loginType = req.session.loginType;
  let content;
  if (loginType === 'Admin') {
    content = 'Welcome to the Admin Panel';
  } else {
    content = 'You do not have sufficient privileges to access this page.';
  }

  const params = { title: 'Admin Panel', content: content };
  res.status(200).render('AdminPanel.js', params);
});

app.post('/Logout', (req, res) => {
  req.session.loggedIn = false; 
  console.log('req.session.loggedIn:', req.session.loggedIn);
  res.status(200).json({ success: true, message: 'Logout successful' });
});

/*----------------------------------------------------------------
----------------End API For LogIn Page ---------------------------
--------------------------------------------------------------- */
/*----------------------------------------------------------------
----------------API For Department Page --------------------------
--------------------------------------------------------------- */
app.post('/api/DepartForm', async (req, res) => {
  const {department, userLoginType} = req.body;
  console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('Department', sql.NVarChar(50), department);
  request.input('userLoginType', sql.VarChar(50), userLoginType);

  const insertSql = "INSERT INTO [CreateDept] (Department, SaveBy, Sdate) VALUES (@department, @userLoginType, GETDATE())"
   request.query(insertSql, (insertError, results) => {
    if (insertError) {
      console.error('Error inserting Data:', insertError);
      res.status(500).json({ success: false, error: 'Failed to insert Data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ success: true, message: 'Data inserted successfully' });
    }
  });
});

app.get('/api/DepartData', async (req, res) => {
 
  const Sql = "select * from CreateDept"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.delete('/api/DeleteDepartment/:DPTID', (req, res) => {
  const DPTID = req.params.DPTID;
  const Deletesql = "DELETE FROM CreateDept WHERE DPTID = @DPTID";

  const request = new sql.Request(sqlServerCon);
  request.input('DPTID', sql.Int, DPTID);

  request.query(Deletesql, (deleteError, results) => {
    if (deleteError) {
      console.error('Error executing SQL query:', deleteError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});

app.put('/api/UpdateDepartment/:DPTID', (req, res) => {
  const DPTID= req.params.DPTID;
  const {department, userLoginType}= req.body;
  // console.log('DPTID:', DPTID);
  console.log('query:', req.body);
  const Updatesql = "UPDATE CreateDept SET Department = @department, UpdateBy = @userLoginType WHERE DPTID = @DPTID";

  const request = new sql.Request(sqlServerCon);
  request.input('DPTID', sql.Int, DPTID);
  request.input('department', sql.NVarChar(50), department);
  request.input('userLoginType', sql.VarChar(50), userLoginType);

  request.query(Updatesql, (updateError, results) => {
    if (updateError) {
      console.error('Error executing SQL query:', updateError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.error('executing SQL query:', results);
      res.json(results);
    }
  });
});
/*----------------------------------------------------------------
----------------End API For Department Page ----------------------
--------------------------------------------------------------- */
/*----------------------------------------------------------------
----------------API For Unit Page --------------------------
--------------------------------------------------------------- */
app.post('/api/UnitForm', async (req, res) => {
  const {unitName} = req.body;
  console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('unitName', sql.NVarChar(100), unitName);

  const insertSql = "INSERT INTO [UnitMaster] (UnitName) VALUES (@unitName)"
   request.query(insertSql, (insertError, results) => {
    if (insertError) {
      console.error('Error inserting Data:', insertError);
      res.status(500).json({ success: false, error: 'Failed to insert Data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ success: true, message: 'Data inserted successfully' });
    }
  });
});

app.get('/api/UnitData', async (req, res) => {
 
  const Sql = "select * from UnitMaster"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.put('/api/UpdateUnit/:UID', (req, res) => {
  const UID= req.params.UID;
  const unitName= req.body.UnitName;
  // console.log('UID:', UID);
  // console.log('unitName:', unitName);
  const Updatesql = "UPDATE UnitMaster SET UnitName = @unitName WHERE UID = @UID";

  const request = new sql.Request(sqlServerCon);
  request.input('UID', sql.Int, UID);
  request.input('unitName', sql.NVarChar(100), unitName);

  request.query(Updatesql, (updateError, results) => {
    if (updateError) {
      console.error('Error executing SQL query:', updateError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      console.error('executing SQL query:', results);
      res.json(results);
    }
  });
});

app.delete('/api/DeleteUnit/:UID', (req, res) => {
  const UID = req.params.UID;
  const Deletesql = "DELETE FROM UnitMaster WHERE UID = @UID";

  const request = new sql.Request(sqlServerCon);
  request.input('UID', sql.Int, UID);

  request.query(Deletesql, (deleteError, results) => {
    if (deleteError) {
      console.error('Error executing SQL query:', deleteError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});
/*----------------------------------------------------------------
----------------End API For Department Page ----------------------
--------------------------------------------------------------- */
/*----------------------------------------------------------------
----------------API For TestGroup Page ---------------------------
--------------------------------------------------------------- */
app.post('/api/TGForm', async (req, res) => {
  const {tGName, selectedDepartmentId} = req.body;
  console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('tGName', sql.NVarChar(500), tGName);
  request.input('selectedDepartmentId', sql.Int, selectedDepartmentId);

  const insertSql = `
    INSERT INTO [TGMaster] (TGName, DPTID)
    VALUES (@tGName, @selectedDepartmentId)
  `;
   request.query(insertSql, (insertError, results) => {
    if (insertError) {
      console.error('Error inserting Data:', insertError);
      res.status(500).json({ success: false, error: 'Failed to insert Data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ success: true, message: 'Data inserted successfully' });
    }
  });
});

app.get('/api/GetOptions', async (req, res) => {
 
  const Sql = "select * from  CreateDept"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/TGData', async (req, res) => {
 
  const Sql = "SELECT TGMaster.*, CreateDept.Department AS DepartmentName FROM TGMaster LEFT JOIN CreateDept ON CreateDept.DPTID = TGMaster.DPTID"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.put('/api/UpdateTgData/:TGID', (req, res) => {
  const TGID= req.params.TGID;
  const tGName= req.body.TGName;
  const selectedDepartmentId= req.body.DPTID;
  // console.log('TGID:', TGID);
  // console.log('tGName:', tGName);
  // console.log('selectedDepartmentId:', selectedDepartmentId);
  const Updatesql = "UPDATE TGMaster SET TGName = @tGName, DPTID = @selectedDepartmentId WHERE TGID = @TGID";

  const request = new sql.Request(sqlServerCon);
  request.input('TGID', sql.Int, TGID);
  request.input('tGName', sql.NVarChar(500), tGName);
  request.input('selectedDepartmentId', sql.Int, selectedDepartmentId);

  request.query(Updatesql, (updateError, results) => {
    if (updateError) {
      console.error('Error executing SQL query:', updateError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.error('executing SQL query:', results);
      res.json(results);
    }
  });
});

app.delete('/api/DeleteTest/:TGID', (req, res) => {
  const TGID = req.params.TGID;
  const Deletesql = "DELETE FROM TGMaster WHERE TGID = @TGID";

  const request = new sql.Request(sqlServerCon);
  request.input('TGID', sql.Int, TGID);

  request.query(Deletesql, (deleteError, results) => {
    if (deleteError) {
      console.error('Error executing SQL query:', deleteError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});
/*----------------------------------------------------------------
----------------End API For TestGroup Page -----------------------
--------------------------------------------------------------- */
/*----------------------------------------------------------------
----------------API For Packages Page ----------------------------
--------------------------------------------------------------- */
app.post('/api/CpackForm', async (req, res) => {
  const {selectedSGNameId, selectedTestIds} = req.body;
  console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('selectedSGNameId', sql.Int, selectedSGNameId);
  request.input('selectedTestIds', sql.Int, selectedTestIds);

  const insertSql = `
    INSERT INTO CreatePackage (SGIDPKG, SGID)
    VALUES (@selectedSGNameId, @selectedTestIds)
  `;
   request.query(insertSql, (insertError, results) => {
    if (insertError) {
      console.error('Error inserting Data:', insertError);
      res.status(500).json({ success: false, error: 'Failed to insert Data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ success: true, message: 'Data inserted successfully' });
    }
  });
});

app.get('/api/GetSGName', async (req, res) => {
 
  const Sql = "select SGID, SGName from  SGMaster where SGType = 'Package'"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/SGData', async (req, res) => {
 
  const Sql = "select SGID, SGName, Charges, TType from  SGMaster where SGType = 'Test'"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});
// setGAmnt((prevTotal) => prevTotal + totalCharges);
app.get('/api/SecnSGData/:SGID', async (req, res) => {
  const SGID = parseInt(req.params.SGID);
  // console.log(SGID)

  const request = new sql.Request(sqlServerCon);
  request.input('SGID', sql.Int, SGID);
 
  const Sql = "SELECT PKGID,SGName FROM SGMaster inner JOIN CreatePackage ON SGMaster.SGID = CreatePackage.SGID where SGIDPKG = @SGID "
  request.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.delete('/api/DeletePackage/:PKGID', (req, res) => {
  const PKGID = req.params.PKGID;
  const Deletesql = "DELETE FROM CreatePackage WHERE PKGID = @PKGID";

  const request = new sql.Request(sqlServerCon);
  request.input('PKGID', sql.Int, PKGID);

  request.query(Deletesql, (deleteError, results) => {
    if (deleteError) {
      console.error('Error executing SQL query:', deleteError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});
/*----------------------------------------------------------------
----------------End API For Packages Page ------------------------
--------------------------------------------------------------- */
/*----------------------------------------------------------------
----------------API For SubGroup Page ----------------------------
--------------------------------------------------------------- */
app.post('/api/CSGMaster', async (req, res) => {
  const {sGName, selectedTGNameId, sName, mName, tCode, charges, chargesSec, bAmnt, sGPrint, selectedSampleId, tType, tCateg, notes, interpretation} = req.body;
  console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('sGName', sql.NVarChar(500), sGName);
  request.input('selectedTGNameId', sql.Int, selectedTGNameId);
  request.input('sName', sql.NVarChar(100), sName);
  request.input('mName', sql.NVarChar(500), mName);
  request.input('tCode', sql.NVarChar(100), tCode);
  request.input('charges', sql.Numeric(18, 2), charges);
  request.input('chargesSec', sql.Numeric(18, 2), chargesSec);
  request.input('bAmnt', sql.Numeric(18, 0), bAmnt);
  request.input('sGPrint', sql.VarChar(50), sGPrint);
  request.input('selectedSampleId', sql.Int, selectedSampleId);
  request.input('tType', sql.NVarChar(50), tType);
  request.input('tCateg', sql.VarChar(50), tCateg);
  request.input('notes', sql.NVarChar('max'), notes);
  request.input('interpretation', sql.NVarChar('max'), interpretation);

  const insertSql = `
    INSERT INTO [SGMaster] (SGName, TGID, SGSName, MethodName, TestCode, Charges, SGPrint, SID, TType, SGType, Notes, inter, OCharges, DCAmt)
    VALUES (@sGName, @selectedTGNameId, @sName, @mName, @tCode, @charges, @sGPrint, @selectedSampleId, @tType, @tCateg, @notes, @interpretation, @chargesSec, @bAmnt)
  `;
   request.query(insertSql, (insertError, results) => {
    if (insertError) {
      console.error('Error inserting Data:', insertError);
      res.status(500).json({ success: false, error: 'Failed to insert Data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ success: true, message: 'Data inserted successfully' });
    }
  });
});

app.post('/api/getFilteredSGDetails', async (req, res) => {

  const {selectedTNameId} = req.body;
  console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('selectedTNameId', sql.Int, selectedTNameId);
 
  const Sql = "SELECT SGMaster.*, TGMaster.TGName AS TestName, SampleType.SampleName AS SampleName from SGMaster left join TGMaster on TGMaster.TGID = SGMaster.TGID left join SampleType on SampleType.SID = SGMaster.SID WHERE SGMaster.TGID = @selectedTNameId"

  request.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results.recordset);
    }
  });
});

app.get('/api/GetTGName', async (req, res) => {
 
  const Sql = "select * from  TGMaster"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/GetStype', async (req, res) => {
 
  const Sql = "select * from  SampleType"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/CSGData', async (req, res) => {
 
  const Sql = "SELECT SGMaster.*, TGMaster.TGName AS TestName, SampleType.SampleName AS SampleName from SGMaster left join TGMaster on TGMaster.TGID = SGMaster.TGID left join SampleType on SampleType.SID = SGMaster.SID"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/GetCSG/:SGID', async (req, res) => {
  const SGID = req.params.SGID;
  
  const Sql = "SELECT SGMaster.*, TGMaster.TGName AS TestName, SampleType.SampleName AS SampleName from SGMaster left join TGMaster on TGMaster.TGID = SGMaster.TGID left join SampleType on SGMaster.SID = SampleType.SID where SGID = @SGID"
  
  const request = new sql.Request(sqlServerCon);
  request.input('SGID', sql.Int, SGID);
  
  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json(result.recordset[0]);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.put('/api/UpdateCSGMaster/:SGID', (req, res) => {
  const SGID= req.params.SGID;
  const {sGName, selectedTGNameId, sName, mName, tCode, charges, chargesSec, bAmnt, sGPrint, selectedSampleId, tType, tCateg, notes, interpretation} = req.body;
  // console.log(req.body)
  const Updatesql = "UPDATE SGMaster SET SGName = @sGName, TGID = @selectedTGNameId, SGSName = @sName, MethodName = @mName, TestCode = @tCode, Charges = @charges, OCharges = @chargesSec, DCAmt = @bAmnt, SGPrint = @sGPrint, SID = @selectedSampleId, TType = @tType, SGType = @tCateg, Notes = @notes, inter = @interpretation WHERE SGID = @SGID";
  
  const request = new sql.Request(sqlServerCon);
  request.input('SGID', sql.Int, SGID);
  request.input('sGName', sql.NVarChar(500), sGName);
  request.input('selectedTGNameId', sql.Int, selectedTGNameId);
  request.input('sName', sql.NVarChar(100), sName);
  request.input('mName', sql.NVarChar(500), mName);
  request.input('tCode', sql.NVarChar(100), tCode);
  request.input('charges', sql.Numeric(18, 2), charges);
  request.input('chargesSec', sql.Numeric(18, 2), chargesSec);
  request.input('bAmnt', sql.Numeric(18, 0), bAmnt);
  request.input('sGPrint', sql.VarChar(50), sGPrint);
  request.input('selectedSampleId', sql.Int, selectedSampleId);
  request.input('tType', sql.NVarChar(50), tType);
  request.input('tCateg', sql.VarChar(50), tCateg);
  request.input('notes', sql.NVarChar('max'), notes);
  request.input('interpretation', sql.NVarChar('max'), interpretation);
  
  request.query(Updatesql, (updateError, results) => {
    if (updateError) {
      console.error('Error executing SQL query:', updateError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.error('executing SQL query:', results);
      res.json(results);
    }
  });
});

app.put('/api/updateRate', (req, res) => {
  const {SGID, newRate} = req.body;
  console.log(req.body)

  const Updatesql = "UPDATE SGMaster SET Charges = @newRate WHERE SGID = @SGID";

  // updateData.forEach((Data) => {
    const request = new sql.Request(sqlServerCon);
    request.input('SGID', sql.Int, SGID);
    request.input('newRate', sql.Numeric(18, 2), newRate);
    
    request.query(Updatesql, (updateError, results) => {
      if (updateError) {
        console.error('Error executing SQL query:', updateError);
      }
    // });
  });
  res.json({ success: true });
});

app.delete('/api/DeleteSubGroup/:SGID', (req, res) => {
  const SGID = req.params.SGID;
  const Deletesql = "DELETE FROM SGMaster WHERE SGID = @SGID";

  const request = new sql.Request(sqlServerCon);
  request.input('SGID', sql.Int, SGID);

  request.query(Deletesql, (deleteError, results) => {
    if (deleteError) {
      console.error('Error executing SQL query:', deleteError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});
/*----------------------------------------------------------------
----------------End API For SubGroup Page ------------------------
--------------------------------------------------------------- */
/*----------------------------------------------------------------
----------------API For Client Page ----------------------------
--------------------------------------------------------------- */
app.post('/api/CRefMaster', async (req, res) => {
  const {cName, email, password, dob, mobile, anniversery, cCateg, special, routine, ecg, ray, ultrasound, address, remarks} = req.body;
  console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('cName', sql.NVarChar(200), cName);
  request.input('email', sql.NVarChar(200), email);
  request.input('password', sql.VarChar(50), password);
  request.input('dob', sql.Date, dob);
  request.input('mobile', sql.NVarChar(50), mobile);
  request.input('anniversery', sql.Date, anniversery);
  request.input('cCateg', sql.VarChar(50), cCateg);
  request.input('special', sql.Numeric(18, 2), special);
  request.input('routine', sql.Numeric(18, 2), routine);
  request.input('ecg', sql.Numeric(18, 2), ecg);
  request.input('ray', sql.Numeric(18, 2), ray);
  request.input('ultrasound', sql.Numeric(18, 2), ultrasound);
  request.input('address', sql.NVarChar(800), address);
  request.input('remarks', sql.NVarChar(800), remarks);

  const insertSql = `
    INSERT INTO [ReferalMaster] (RName, Email, DOB, mobile, DOA, RefCat, DSPL, DRTN, DXRay, DOTH, DUSG, RAddress, Remarks, UserID, Pwd, EDate)
    VALUES (@cName, @email, @dob, @mobile, @anniversery, @cCateg, @special, @routine, @ray, @ecg, @ultrasound, @address, @remarks, @email, @password,  GETDATE())
  `;
   request.query(insertSql, (insertError, results) => {
    if (insertError) {
      console.error('Error inserting Data:', insertError);
      res.status(500).json({ success: false, error: 'Failed to insert Data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ success: true, message: 'Data inserted successfully' });
    }
  });
});

app.get('/api/ClientData', async (req, res) => {
 
  const Sql = "SELECT * from ReferalMaster"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/GetClients/:RID', async (req, res) => {
  const RID = req.params.RID;
  console.log(RID)
  
  const Sql = "SELECT * from ReferalMaster where RID = @RID"
  
  const request = new sql.Request(sqlServerCon);
  request.input('RID', sql.Int, RID);
  
  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json([result.recordset[0]]);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.put('/api/EditClient/:RID', (req, res) => {
  const RID= req.params.RID;
  const {cName, email, dob, mobile, anniversery, cCateg, special, routine, ecg, ray, ultrasound, address, remarks} = req.body;
  // console.log(req.body)
  const Updatesql = "UPDATE ReferalMaster SET RName = @cName, Email = @email, DOB = @dob, mobile = @mobile, DOA = @anniversery, RefCat = @cCateg, DSPL = @special, DRTN = @routine, DOTH = @ecg, DXRay = @ray, DUSG = @ultrasound, RAddress = @address, Remarks = @remarks  WHERE RID = @RID";
  
  const request = new sql.Request(sqlServerCon);
  request.input('RID', sql.Int, RID);
  request.input('cName', sql.NVarChar(200), cName);
  request.input('email', sql.NVarChar(200), email);
  request.input('dob', sql.Date, dob);
  request.input('mobile', sql.NVarChar(50), mobile);
  request.input('anniversery', sql.Date, anniversery);
  request.input('cCateg', sql.VarChar(50), cCateg);
  request.input('special', sql.Numeric(18, 2), special);
  request.input('routine', sql.Numeric(18, 2), routine);
  request.input('ecg', sql.Numeric(18, 2), ecg);
  request.input('ray', sql.Numeric(18, 2), ray);
  request.input('ultrasound', sql.Numeric(18, 2), ultrasound);
  request.input('address', sql.NVarChar(800), address);
  request.input('remarks', sql.NVarChar(800), remarks);
  
  request.query(Updatesql, (updateError, results) => {
    if (updateError) {
      console.error('Error executing SQL query:', updateError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.error('executing SQL query:', results);
      res.json(results);
    }
  });
});

app.delete('/api/DeleteClients/:RID', (req, res) => {
  const RID = req.params.RID;
  const Deletesql = "DELETE FROM ReferalMaster WHERE RID = @RID";

  const request = new sql.Request(sqlServerCon);
  request.input('RID', sql.Int, RID);

  request.query(Deletesql, (deleteError, results) => {
    if (deleteError) {
      console.error('Error executing SQL query:', deleteError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});
/*----------------------------------------------------------------
----------------End API For Client Page --------------------------
--------------------------------------------------------------- */
/*----------------------------------------------------------------
----------------API For Collection center Page -------------------
--------------------------------------------------------------- */
app.post('/api/CollMaster', async (req, res) => {
  const {cName, cType, cNo, email, landmark, city, state, website} = req.body;
  // console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('cName', sql.NVarChar(800), cName);
  request.input('cType', sql.VarChar(50), cType);
  request.input('cNo', sql.VarChar(50), cNo);
  request.input('email', sql.VarChar(50), email);
  request.input('landmark', sql.VarChar(200), landmark);
  request.input('city', sql.VarChar(50), city);
  request.input('state', sql.VarChar(500), state);
  request.input('website', sql.NVarChar(800), website);

  const insertSql = `
    INSERT INTO [ORGMaster] (LabName, CentreName, CentreType, Contact, Email, Line1, Line2, Line3, Website)
    VALUES (@cName, @cName, @cType, @cNo, @email, @landmark, @city, @state, @website)
  `;
   request.query(insertSql, (insertError, results) => {
    if (insertError) {
      console.error('Error inserting Data:', insertError);
      res.status(500).json({ success: false, error: 'Failed to insert Data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ success: true, message: 'Data inserted successfully' });
    }
  });
});

app.get('/api/CenterData', async (req, res) => {
 
  const Sql = "SELECT * from ORGMaster"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/GetCenters/:OID', async (req, res) => {
  const OID = req.params.OID;
  // console.log(OID)
  
  const Sql = "SELECT * from ORGMaster where OID = @OID"
  
  const request = new sql.Request(sqlServerCon);
  request.input('OID', sql.Int, OID);
  
  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json([result.recordset[0]]);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.put('/api/EditCenter/:OID', (req, res) => {
  const OID= req.params.OID;
  const {cName, cType, cNo, email, landmark, city, state, website} = req.body;
  // console.log(req.body)
  const Updatesql = "UPDATE ORGMaster SET LabName = @cName, CentreName = @cName, CentreType = @cType, Contact = @cNo, Email = @email, Line1 = @landmark, Line2 = @city, Line3 = @state, Website = @website WHERE OID = @OID";
  
  const request = new sql.Request(sqlServerCon);
  request.input('OID', sql.Int, OID);
  request.input('cName', sql.NVarChar(800), cName);
  request.input('cType', sql.VarChar(50), cType);
  request.input('cNo', sql.VarChar(50), cNo);
  request.input('email', sql.VarChar(50), email);
  request.input('landmark', sql.VarChar(200), landmark);
  request.input('city', sql.VarChar(50), city);
  request.input('state', sql.VarChar(500), state);
  request.input('website', sql.NVarChar(800), website);
  
  request.query(Updatesql, (updateError, results) => {
    if (updateError) {
      console.error('Error executing SQL query:', updateError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.error('executing SQL query:', results);
      res.json(results);
    }
  });
});
/*----------------------------------------------------------------
----------------End API For Collection center Page ---------------
--------------------------------------------------------------- */
app.post('/api/CTest', async (req, res) => {
  const {selectedTGNameId, tName, tCheck, isHeading, pSL, mName, uName, tType, dValue, mMVal, mFVal, maxMVal, maxFVal, mMWarn, mFWarn, maxMWarn, maxFWarn, dTM, dTF} = req.body;
  // console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('selectedTGNameId', sql.Int, selectedTGNameId);
  request.input('tName', sql.VarChar(100), tName);
  request.input('tCheck', sql.VarChar(100), tCheck);
  request.input('isHeading', sql.VarChar(50), isHeading);
  request.input('pSL', sql.Int, pSL);
  request.input('mName', sql.VarChar(100), mName);
  request.input('uName', sql.VarChar(50), uName);
  request.input('tType', sql.VarChar(100), tType);
  request.input('dValue', sql.NVarChar('max'), dValue);
  request.input('mMVal', sql.Numeric(18, 3), mMVal);
  request.input('mFVal', sql.Numeric(18, 3), mFVal);
  request.input('maxMVal', sql.Numeric(18, 3), maxMVal);
  request.input('maxFVal', sql.Numeric(18, 3), maxFVal);
  request.input('mMWarn', sql.Numeric(18, 1), mMWarn);
  request.input('mFWarn', sql.Numeric(18, 1), mFWarn);
  request.input('maxMWarn', sql.Numeric(18, 1), maxMWarn);
  request.input('maxFWarn', sql.Numeric(18, 1), maxFWarn);
  request.input('dTM', sql.VarChar(500), dTM);
  request.input('dTF', sql.VarChar(500), dTF);

  const insertSql = `
    INSERT INTO [TMaster] (SGID, TName, Tcheck, IsHeading, PSLNo, Method, UName, TestType, DValue, MinVM, MinV, MaxVM, MaxV, MinWM, MinW, MaxWM, MaxW, DisplayM, Display)
    VALUES (@selectedTGNameId, @tName, @tCheck, @isHeading, @pSL, @mName, @uName, @tType, @dValue, @mMVal, @mFVal, @maxMVal, @maxFVal, @mMWarn, @mFWarn, @maxMWarn, @maxFWarn, @dTM, @dTF)
  `;
   request.query(insertSql, (insertError, results) => {
    if (insertError) {
      console.error('Error inserting Data:', insertError);
      res.status(500).json({ success: false, error: 'Failed to insert Data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ success: true, message: 'Data inserted successfully' });
    }
  });
});

app.put('/api/UpdateCTest/:TID', async (req, res) => {
  const TID =req.params.TID;
  console.log(TID)

  const {selectedTGNameId, tName, tCheck, isHeading, pSL, mName, uName, tType, dValue, mMVal, mFVal, maxMVal, maxFVal, mMWarn, mFWarn, maxMWarn, maxFWarn, dTM, dTF} = req.body;
  // console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('TID', sql.Int, TID);
  request.input('selectedTGNameId', sql.Int, selectedTGNameId);
  request.input('tName', sql.VarChar(100), tName);
  request.input('tCheck', sql.VarChar(100), tCheck);
  request.input('isHeading', sql.VarChar(50), isHeading);
  request.input('pSL', sql.Int, pSL);
  request.input('mName', sql.VarChar(100), mName);
  request.input('uName', sql.VarChar(50), uName);
  request.input('tType', sql.VarChar(100), tType);
  request.input('dValue', sql.NVarChar('max'), dValue);
  request.input('mMVal', sql.Numeric(18, 3), mMVal);
  request.input('mFVal', sql.Numeric(18, 3), mFVal);
  request.input('maxMVal', sql.Numeric(18, 3), maxMVal);
  request.input('maxFVal', sql.Numeric(18, 3), maxFVal);
  request.input('mMWarn', sql.Numeric(18, 1), mMWarn);
  request.input('mFWarn', sql.Numeric(18, 1), mFWarn);
  request.input('maxMWarn', sql.Numeric(18, 1), maxMWarn);
  request.input('maxFWarn', sql.Numeric(18, 1), maxFWarn);
  request.input('dTM', sql.VarChar(500), dTM);
  request.input('dTF', sql.VarChar(500), dTF);

  const insertSql = "UPDATE [TMaster] SET SGID = @selectedTGNameId, TName = @tName, Tcheck = @tCheck, IsHeading = @isHeading, PSLNo = @pSL, Method = @mName, UName = @uName, TestType = @tType, DValue = @dValue, MinVM = @mMVal, MinV =  @mFVal, MaxVM = @maxMVal, MaxV = @maxFVal, MinWM = @mMWarn, MinW = @mFWarn, MaxWM = @maxMWarn, MaxW = @maxFWarn, DisplayM = @dTM, Display = @dTF where TID = @TID";

   request.query(insertSql, (UpdateError, results) => {
    if (UpdateError) {
      console.error('Error inserting Data:', UpdateError);
      res.status(500).json({ success: false, error: 'Failed to insert Data' });
    } else {
      console.log('Data Updated successfully');
      res.status(200).json({ success: true, message: 'Data Updated successfully', results });
    }
  });
});

app.post('/api/CAWTest', async (req, res) => {
  const { selectedTGNameId, tName, tCheck, isHeading, pSL, mName, uName, tType, dValue, gridValues } = req.body;
  // console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('selectedTGNameId', sql.Int, selectedTGNameId);
  request.input('tName', sql.VarChar(100), tName);
  request.input('tCheck', sql.VarChar(100), tCheck);
  request.input('isHeading', sql.VarChar(50), isHeading);
  request.input('pSL', sql.Int, pSL);
  request.input('mName', sql.VarChar(100), mName);
  request.input('uName', sql.VarChar(50), uName);
  request.input('tType', sql.VarChar(100), tType);
  request.input('dValue', sql.NVarChar('max'), dValue);

  try {
    const primaryInsertSql = `
      INSERT INTO [TMaster] (SGID, TName, Tcheck, IsHeading, PSLNo, Method, UName, TestType, DValue)
      OUTPUT INSERTED.TID
      VALUES (@selectedTGNameId, @tName, @tCheck, @isHeading, @pSL, @mName, @uName, @tType, @dValue)
    `;

    request.query(primaryInsertSql, (primaryInsertError, primaryInsertResults) => {
      if (primaryInsertError) {
        console.error('Error inserting Data:', primaryInsertError);
        res.status(500).json({ success: false, error: 'Failed to insert Data' });
        return;
      }

      if (primaryInsertResults && primaryInsertResults.rowsAffected > 0) {
        const generatedTID = primaryInsertResults.recordset[0].TID;
        if (!generatedTID) {
          console.error('Failed to retrieve generated TID from TMaster.');
          res.status(500).json({ success: false, error: 'Failed to retrieve generated TID' });
          return;
        }
        console.log(generatedTID)
        for (const test of gridValues) {
          const { ageType, lowerAge, upperAge, maleminValue, femaleminValue, malemaxValue, femalemaxValue, maleminWarn, femaleminWarn, malemaxWarn, femalemaxWarn, maleText, femaleText} = test;
          // console.log(test);
          
          const secondaryInsertRequest = new sql.Request(sqlServerCon);
          const secondaryInsertSql = `
            INSERT INTO [TAgeMaster] (TID, AgeType, LAge, UAge, MinVM, MinV, MaxVM, MaxV, MinWM, MinW, MaxWM, MaxW, DisplayM, Display)
            VALUES (@generatedTID, @ageType, @lowerAge, @upperAge, @maleminValue, @femaleminValue, @malemaxValue, @femalemaxValue, @maleminWarn, @femaleminWarn, @malemaxWarn, @femalemaxWarn, @maleText, @femaleText)
          `;

          secondaryInsertRequest.input('generatedTID', sql.Int, generatedTID);
          secondaryInsertRequest.input('ageType', sql.VarChar(50), ageType);
          secondaryInsertRequest.input('lowerAge', sql.Numeric(18, 1), lowerAge);
          secondaryInsertRequest.input('upperAge', sql.Numeric(18, 1), upperAge);
          secondaryInsertRequest.input('maleminValue', sql.Numeric(18, 3), maleminValue);
          secondaryInsertRequest.input('femaleminValue', sql.Numeric(18, 3), femaleminValue);
          secondaryInsertRequest.input('malemaxValue', sql.Numeric(18, 3), malemaxValue);
          secondaryInsertRequest.input('femalemaxValue', sql.Numeric(18, 3), femalemaxValue);
          secondaryInsertRequest.input('maleminWarn', sql.Numeric(18, 3), maleminWarn);
          secondaryInsertRequest.input('femaleminWarn', sql.Numeric(18, 3), femaleminWarn);
          secondaryInsertRequest.input('malemaxWarn', sql.Numeric(18, 3), malemaxWarn);
          secondaryInsertRequest.input('femalemaxWarn', sql.Numeric(18, 3), femalemaxWarn);
          secondaryInsertRequest.input('maleText', sql.VarChar(500), maleText);
          secondaryInsertRequest.input('femaleText', sql.VarChar(500), femaleText);

          // Execute the secondary insert
          secondaryInsertRequest.query(secondaryInsertSql, (secondaryInsertError) => {
            if (secondaryInsertError) {
              console.error('Error inserting data into TAgeMaster:', secondaryInsertError);
            }
          });
        }

        console.log('Data inserted successfully');
        res.status(200).json({ success: true, message: 'Data inserted successfully' });
      } else {
        console.error('Primary insert into TMaster did not affect any rows.');
        res.status(500).json({ success: false, error: 'Primary insert into TMaster did not affect any rows' });
      }
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ success: false, error: 'Failed to insert data' });
  }
});

app.put('/api/UpdateAWTest/:TID', async (req, res) => {
  const TID =req.params.TID;
  const { selectedTGNameId, tName, tCheck, isHeading, pSL, mName, uName, tType, dValue, gridValues } = req.body;
  console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('TID', sql.Int, TID);
  request.input('selectedTGNameId', sql.Int, selectedTGNameId);
  request.input('tName', sql.VarChar(100), tName);
  request.input('tCheck', sql.VarChar(100), tCheck);
  request.input('isHeading', sql.VarChar(50), isHeading);
  request.input('pSL', sql.Int, pSL);
  request.input('mName', sql.VarChar(100), mName);
  request.input('uName', sql.VarChar(50), uName);
  request.input('tType', sql.VarChar(100), tType);
  request.input('dValue', sql.NVarChar('max'), dValue);

  try {
    const primaryInsertSql = "UPDATE [TMaster] SET SGID = @selectedTGNameId, TName = @tName, Tcheck = @tCheck, IsHeading = @isHeading, PSLNo = @pSL, Method = @mName, UName = @uName, TestType = @tType, DValue = @dValue where TID = @TID";

    request.query(primaryInsertSql, (primaryInsertError, primaryInsertResults) => {
      if (primaryInsertError) {
        console.error('Error updating Data:', primaryInsertError);
        res.status(500).json({ success: false, error: 'Failed to update Data' });
        return;
      }

      if (primaryInsertResults && primaryInsertResults.rowsAffected > 0) {
        
        for (const test of gridValues) {
          gridValues.forEach((test) => {
          const {TAID, ageType, lowerAge, upperAge, maleminValue, femaleminValue, malemaxValue, femalemaxValue, maleminWarn, femaleminWarn, malemaxWarn, femalemaxWarn, maleText, femaleText} = test;
          console.log(test);
          
          const secondaryInsertRequest = new sql.Request(sqlServerCon);

          const secondaryInsertSql = "UPDATE [TAgeMaster] SET AgeType = @ageType, LAge = @lowerAge, UAge = @upperAge, MinVM = @maleminValue, MinV =  @femaleminValue, MaxVM = @malemaxValue, MaxV = @femalemaxValue, MinWM = @maleminWarn, MinW = @femaleminWarn, MaxWM = @malemaxWarn, MaxW = @femalemaxWarn, DisplayM = @maleText, Display = @femaleText where TAID = @TAID";

          secondaryInsertRequest.input('TAID', sql.Int, TAID);
          secondaryInsertRequest.input('ageType', sql.VarChar(50), ageType);
          secondaryInsertRequest.input('lowerAge', sql.Numeric(18, 1), lowerAge);
          secondaryInsertRequest.input('upperAge', sql.Numeric(18, 1), upperAge);
          secondaryInsertRequest.input('maleminValue', sql.Numeric(18, 3), maleminValue);
          secondaryInsertRequest.input('femaleminValue', sql.Numeric(18, 3), femaleminValue);
          secondaryInsertRequest.input('malemaxValue', sql.Numeric(18, 3), malemaxValue);
          secondaryInsertRequest.input('femalemaxValue', sql.Numeric(18, 3), femalemaxValue);
          secondaryInsertRequest.input('maleminWarn', sql.Numeric(18, 3), maleminWarn);
          secondaryInsertRequest.input('femaleminWarn', sql.Numeric(18, 3), femaleminWarn);
          secondaryInsertRequest.input('malemaxWarn', sql.Numeric(18, 3), malemaxWarn);
          secondaryInsertRequest.input('femalemaxWarn', sql.Numeric(18, 3), femalemaxWarn);
          secondaryInsertRequest.input('maleText', sql.VarChar(500), maleText);
          secondaryInsertRequest.input('femaleText', sql.VarChar(500), femaleText);

          // Execute the secondary insert
          secondaryInsertRequest.query(secondaryInsertSql, (secondaryInsertError) => {
            if (secondaryInsertError) {
              console.error('Error updating data into TAgeMaster:', secondaryInsertError);
            }
          });
        });
        }

        console.log('Data updated successfully');
        res.status(200).json({ success: true, message: 'Data inserted successfully' });
      } else {
        console.error('Primary update into TMaster did not affect any rows.');
        res.status(500).json({ success: false, error: 'Primary update into TMaster did not affect any rows' });
      }
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ success: false, error: 'Failed to update data' });
  }
});

app.post('/api/getFilteredTestData', async (req, res) => {

  const {selectedTGNameId} = req.body;
  console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('selectedTGNameId', sql.Int, selectedTGNameId);
 
  const Sql = "select TMaster.*,SGMaster.SGName as groupname from TMaster left join SGMaster on SGMaster.SGID = TMaster.SGID WHERE SGMaster.SGID = @selectedTGNameId"

  request.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results.recordset);
    }
  });
});

app.put('/api/updateSLno', (req, res) => {
  const {TID, newSLNo} = req.body;
  console.log(req.body)

  const Updatesql = "Update TMaster set PSLNo = @newSLNo WHERE TID = @TID";
  
  const request = new sql.Request(sqlServerCon);
  request.input('TID', sql.Int, TID);
  request.input('newSLNo', sql.Int, newSLNo);
  
  request.query(Updatesql, (updateError, results) => {
    if (updateError) {
      console.error('Error executing SQL query:', updateError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});

app.put('/api/testStatus', (req, res) => {
  const {TID, newStatus} = req.body; 
  console.log(req.body)

  const Updatesql =   "Update TMaster set TCheck = @newStatus WHERE TID = @TID";

  const request = new sql.Request(sqlServerCon);
  request.input('TID', sql.Int, TID);
  request.input('newStatus', sql.VarChar(100), newStatus);
  
  request.query(Updatesql, (updateError, results) => {
    if (updateError) {
      console.error('Error executing SQL query:', updateError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else if (results.rowsAffected[0] === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'No rows updated' });
    }
  });  
});

app.get('/api/getTest', async (req, res) => {
 
  const Sql = "select TMaster.*,SGMaster.SGName as groupname from TMaster left join SGMaster on SGMaster.SGID = TMaster.SGID ORDER BY PSLNo"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/getRdata', async (req, res) => {
 
  const Sql = "SELECT SGName, SGID FROM SGMaster WHERE TType IN ('ultrasound', 'ecg', 'x-ray') "
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/EditAWTest/:TID', async (req, res) => {
  const TID = req.params.TID;
  console.log('TID result:', TID);

  const Sql = "select TAID, SGMaster.SGID, SGName, TName, Tcheck, IsHeading, PSLNo, Method, UName,TestType, DValue, AgeType, LAge, UAge, TAgeMaster.MinV, TAgeMaster.MaxV, TAgeMaster.MinW, TAgeMaster.MaxW, TAgeMaster.Display, TAgeMaster.MinVM, TAgeMaster.MaxVM, TAgeMaster.MinWM, TAgeMaster.MaxWM, TAgeMaster.DisplayM  from TMaster inner join SGMaster on SGMaster.SGID=TMaster.SGID inner join TAgeMaster on TAgeMaster.TID = TMaster.TID where TMaster.TID = @TID"

  const request = new sql.Request(sqlServerCon);
  request.input('TID', sql.Int, TID);

 try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json(result.recordset);
      // console.log(' result:', result);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.get('/api/EditTest/:TID', async (req, res) => {
  const TID = req.params.TID;
  // console.log('TID result:', TID);
 
  const Sql = "select TMaster.*, TAgeMaster.TAID as AWTest, SGMaster.SGName as groupname from TMaster left join TAgeMaster on TAgeMaster.TID = TMaster.TID left join SGMaster on SGMaster.SGID = TMaster.SGID where TMaster.TID = @TID"

  const request = new sql.Request(sqlServerCon);
  request.input('TID', sql.Int, TID);

  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json(result.recordset);
      // console.log(' result:', result);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.delete('/api/DeleteTests/:TID', (req, res) => {
  const TID = req.params.TID;
  const Deletesql = "DELETE FROM TMaster WHERE TID = @TID";
  
  const request = new sql.Request(sqlServerCon);
  request.input('TID', sql.Int, TID);
  
  request.query(Deletesql, (deleteError, results) => {
    if (deleteError) {
      console.error('Error executing SQL query:', deleteError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});

/*----------------------------------------------------------------
----------------API For Patient Registration Page ----------------
--------------------------------------------------------------- */
app.post('/api/CPRegis', async (req, res) => {
  const { rNo, bCode, abhaNo, adhaarNo, mNo, cDate, cTime, rDate, rTime, pNameTitle, pName, year, month, day, age, ageType,  selectedGender, mail, rBy, selectedRefferalId, cBy, line1, address, gAmnt, mgmtDsc, drDsc, cCharges, payableAmnt, advance, balance, repNo, remarks, sId, oID, selectedOptionCharges} = req.body;
  console.log(req.body);

  const transaction = new sql.Transaction(sqlServerCon);
  
  try {
    await transaction.begin();

    const request = new sql.Request(transaction);
    const cTimeDate = new Date(`2000-01-01T${cTime}`);
    const rTimeDate = new Date(`2000-01-01T${rTime}`);

    request.input('rNo', sql.Int, rNo);
    request.input('bCode', sql.VarChar(50), bCode);
    request.input('abhaNo', sql.VarChar(50), abhaNo);
    request.input('adhaarNo', sql.VarChar(50), adhaarNo);
    request.input('mNo', sql.NVarChar(100), mNo);
    request.input('cDate', sql.Date, cDate);
    request.input('cTime', sql.Time(3), cTimeDate);
    request.input('rDate', sql.Date, rDate);
    request.input('rTime', sql.Time(3), rTimeDate);
    request.input('pNameTitle', sql.VarChar(50), pNameTitle);
    request.input('pName', sql.NVarChar(500), pName);
    request.input('year', sql.NVarChar(50), year);
    request.input('month', sql.NVarChar(50), month);
    request.input('day', sql.NVarChar(50), day);
    request.input('selectedGender', sql.NVarChar(50), selectedGender);
    request.input('mail', sql.VarChar(50), mail);
    request.input('rBy', sql.VarChar(50), rBy);
    request.input('selectedRefferalId', sql.Int, selectedRefferalId);
    request.input('cBy', sql.VarChar(50), cBy);
    request.input('line1', sql.VarChar(50), line1);
    request.input('oID', sql.Int, oID);
    request.input('address', sql.VarChar(50), address);
    request.input('gAmnt', sql.Numeric(18, 0), gAmnt);
    request.input('mgmtDsc', sql.Numeric(18, 0), mgmtDsc);
    request.input('drDsc', sql.Numeric(18, 2), drDsc);
    request.input('cCharges', sql.Numeric(18, 2), cCharges);
    request.input('payableAmnt', sql.Numeric(18, 0), payableAmnt);
    request.input('advance', sql.Numeric(18, 2), advance);
    request.input('balance', sql.Numeric(18, 2), balance);
    request.input('repNo', sql.Int, repNo);
    request.input('remarks', sql.NVarChar(100), remarks);
    request.input('sId', sql.Int, sId);

    const primaryInsertSql = `
      INSERT INTO [RFIMaster] (RegNo, Barcode, AbhaNo, AdharNo, ContactNo, Cdate, CTime, RDate, RTime, Title, PName, Year, Month, Day, Sex, Email, Oref, RID, CollBy, CollCen, Address, GAmt, MgmtDsc, DrDiscount, CollCharge, PAmt, Advance, BalAmt, RNo, Remarks, SSID, Dr, RFIStatus, oID)
      OUTPUT INSERTED.RFIID
      VALUES (@rNo, @bCode, @abhaNo, @adhaarNo, @mNo, @cDate, CONVERT(TIME, @cTime), @rDate, CONVERT(TIME, @rTime), @pNameTitle, @pName, @year, @month, @day, @selectedGender, @mail, @rBy, @selectedRefferalId, @cBy, @line1, @address, @gAmnt, @mgmtDsc, @drDsc, @cCharges, @payableAmnt, @advance, @balance, @repNo, @remarks, @sId, 'Dr.', 'Done', @oID)
    `;

    const primaryInsertResults = await request.query(primaryInsertSql);

    if (primaryInsertResults && primaryInsertResults.rowsAffected > 0) {
      const generatedRFIID = primaryInsertResults.recordset[0].RFIID;
      if (!generatedRFIID) {
        // console.log(generatedRFIID);
        // await transaction.rollback(); // Rollback the transaction
        console.error('Failed to retrieve generated RFIID from RFIMaster.');
        res.status(500).json({ success: false, error: 'Failed to retrieve generated RFIID' });
        return;
      }
      
      let generatedRCID;
      for (const test of selectedOptionCharges) {
        const { SGName, Charges, SGID, DPTID, SGType } = test;
        // console.log(test);

        const secondaryInsertRequest = new sql.Request(transaction);
        const secondaryInsertSql = `
          INSERT INTO [RFIChild] (RFIID, TestName, Rate, SGID, DPTID, SGType, Status)
          OUTPUT INSERTED.RCID
          VALUES (@generatedRFIID, @SGName, @Charges, @SGID, @DPTID, @SGType, 'Yes')
        `;

        secondaryInsertRequest.input('generatedRFIID', sql.Int, generatedRFIID);
        secondaryInsertRequest.input('SGName', sql.NVarChar(500), SGName);
        secondaryInsertRequest.input('Charges', sql.Numeric(18, 2), Charges);
        secondaryInsertRequest.input('SGID', sql.Int, SGID);
        secondaryInsertRequest.input('DPTID', sql.Int, DPTID);
        secondaryInsertRequest.input('SGType', sql.VarChar(50), SGType);

        // Execute the secondary insert
        const result = await secondaryInsertRequest.query(secondaryInsertSql);
        if (result.recordset) {
           generatedRCID = result.recordset[0].RCID;
          if (!generatedRCID) {
            // await transaction.rollback();
            console.error('Failed to retrieve generated RCID from RFIChild.');
            res.status(500).json({ success: false, error: 'Failed to retrieve generated RCID' });
            return;
          }
          console.log('Generated RCID (inside the loop):', generatedRCID);
        }
      }
  
        const { selectedRefferalId, repNo, cDate, payableAmnt, advance, pMode} = req.body;
        // console.log(req.body);

        const thirdInsertRequest = new sql.Request(transaction);
        const thirdInsertSql = `
          INSERT INTO [PHead] (RID, RFIID, RNo, PDate, Dr, Cr, PMode, Type, EDate)
          VALUES (@selectedRefferalId, @generatedRFIID, @repNo, @cDate, @payableAmnt, @advance, @pMode, 'advance', @cDate)
        `;

        thirdInsertRequest.input('selectedRefferalId', sql.Int, selectedRefferalId);
        thirdInsertRequest.input('generatedRFIID', sql.Int, generatedRFIID);
        thirdInsertRequest.input('repNo', sql.Int, repNo);
        thirdInsertRequest.input('cDate', sql.Date, cDate);
        thirdInsertRequest.input('payableAmnt', sql.Numeric(18, 2), payableAmnt);
        thirdInsertRequest.input('advance', sql.Numeric(18,2), advance);
        thirdInsertRequest.input('pMode', sql.NVarChar(50), pMode);

        // Execute the secondary insert
        await thirdInsertRequest.query(thirdInsertSql);
        
        const Data = [];
        const firstOptionCharge = selectedOptionCharges[0];
        if (selectedGender === 'Male') {
            for (const charge of selectedOptionCharges) {
              const { SGID } = charge;
              const sqlQuery = `
              select TID, TName,TMaster.SGID,TestType, UName, Case when testType='TEST WITH LIST OF VALUES' then '' else DValue end as DValue, MinV, MaxV, MinW, MaxW, Display,O2,SGMaster.Notes,PSLNo,TMaster.O3 from TMaster inner join SGMaster on SGMaster.SGID=TMaster.SGID Where TMaster.SGID in (@SGID) and TestType not in ('AGE WISE RANGE') union select TMaster.TID, TName,TMaster.SGID,TestType, UName, Case when testType='TEST WITH LIST OF VALUES' then '' else DValue end as DValue, TAM.MinV, TAM.MaxV, TAM.MinW, TAM.MaxW, tAM.Display,O2,SGMaster.Notes,PSLNo, TMaster.O3 from TMaster inner join SGMaster on SGMaster.SGID=TMaster.SGID inner join TAgeMaster TAM on TAM.TID=TMaster.TID Where TMaster.SGID in (${charge.SGID}) and TestType  in ('AGE WISE RANGE')  and (${age}) between LAge and UAge and AgeType= @ageType  order by PSLNo
              `;
            
              const maleDataRequest = sqlServerCon.request();
              maleDataRequest.input('SGID', sql.Int, SGID);
              maleDataRequest.input('age', sql.NVarChar(50), age);
              maleDataRequest.input('ageType', sql.NVarChar(50), ageType);
            
              try {
                const result = await maleDataRequest.query(sqlQuery);
                Data.push(result.recordset);
                console.log(`Data fetched for male SGID: ${SGID}`);
              } catch (error) {
                console.error(`Error fetching data for Male SGID: ${SGID}`, error);
              }
              if (Data.length === 0) {
                console.error('No data found for the given SGID(s).');
                res.status(404).json({ success: false, error: 'No data found for the given SGID(s)' });
              } else {
                // console.log('Male Data:', Data);
                res.status(200).json({ success: true, Data });
              }
            }
        } else if (selectedGender === 'Female') {
          for (const charge of selectedOptionCharges) {
            const { SGID } = charge;
            const sqlQuery = `
              select TID, TName,TMaster.SGID,TestType, UName, Case when testType='TEST WITH LIST OF VALUES' then '' else DValue end as DValue, MinVM as MinV, MaxVM as MaxV, MinWM as MinW, MaxWM as MaxW, DisplayM as Display,O2,SGMaster.Notes, PSLNo,TMaster.O3 from TMaster inner join SGMaster on SGMaster.SGID=TMaster.SGID Where TMaster.SGID in (${SGID}) and TestType not in ('AGE WISE RANGE') union select TMaster.TID, TName,TMaster.SGID,TestType, UName, Case when testType='TEST WITH LIST OF VALUESs' then '' else DValue end as DValue, TAM.MinVM, TAM.MaxVM, TAM.MinWM, TAM.MaxWM, tAM.DisplayM,O2,SGMaster.Notes,PSLNo,TMaster.O3 from TMaster inner join SGMaster on SGMaster.SGID=TMaster.SGID inner join tAgeMaster TAM on TAM.TID=TMaster.TID Where TMaster.SGID in (${SGID}) and TestType  in ('AGE WISE RANGE') and (${age}) between LAge and UAge and AgeType = @ageType order by PSLNo
              `;
            const femaleDataRequest = sqlServerCon.request();
            femaleDataRequest.input('SGID', sql.Int, firstOptionCharge.SGID); 
            femaleDataRequest.input('age', sql.NVarChar(50), age);
            femaleDataRequest.input('ageType', sql.NVarChar(50), ageType);

          try {
            const result = await femaleDataRequest.query(sqlQuery);
            Data.push(result.recordset);
            console.log(`Data fetched for female SGID: ${SGID}`);
          } catch (error) {
            console.error(`Error fetching data for SGID: ${SGID}`, error);
          }
          res.status(200).json({ success: true, Data });
          if (Data.length === 0) {
            console.error('No data found for the given SGID(s).');
            res.status(404).json({ success: false, error: 'No data found for the given SGID(s)' });
        } 
            }
        for (const outerRow of Data) {
          for (const row of outerRow) {
            const { TID, SGID, TName, TestType, UName, DValue, MinV, MaxV, MinW, MaxW, Display, Notes } = row;
            console.log('TID:', TID);
      
            const fourthInsertRequest = new sql.Request(transaction);
            const fourthInsertSql = `
              INSERT INTO [ResultMaster] (RFIID, RCID, TID, SGID, TName, TestType, UnitName, RValue, MinV, MaxV, MinW, MaxW, Display, TestNote, PTest)
              VALUES (@generatedRFIID, @generatedRCID, @TID, @SGID, @TName, @TestType, @UName, @DValue, @MinV, @MaxV, @MinW, @MaxW, @Display, @Notes, 'Yes')
            `;
      
            fourthInsertRequest.input('generatedRFIID', sql.Int, generatedRFIID);
            fourthInsertRequest.input('generatedRCID', sql.Int, generatedRCID);
            fourthInsertRequest.input('TID', sql.Int, TID);
            fourthInsertRequest.input('SGID', sql.Int, SGID);
            fourthInsertRequest.input('TName', sql.VarChar(100), TName);
            fourthInsertRequest.input('TestType', sql.VarChar(50), TestType);
            fourthInsertRequest.input('UName', sql.NVarChar(50), UName);
            fourthInsertRequest.input('DValue', sql.NVarChar('max'), DValue);
            fourthInsertRequest.input('MinV', sql.Numeric(18, 3), MinV);
            fourthInsertRequest.input('MaxV', sql.Numeric(18, 3), MaxV);
            fourthInsertRequest.input('MinW', sql.Numeric(18, 3), MinW);
            fourthInsertRequest.input('MaxW', sql.Numeric(18, 3), MaxW);
            fourthInsertRequest.input('Display', sql.VarChar(300), Display);
            fourthInsertRequest.input('Notes', sql.NVarChar('max'), Notes);
        
            try {
              await fourthInsertRequest.query(fourthInsertSql);
              console.log('Result data inserted into ResultMaster successfully');
            } catch (error) {
              console.error('Error inserting result data into ResultMaster', error);
              await transaction.rollback(); // Rollback the transaction
              res.status(500).json({ success: false, error: 'Failed to insert result data into ResultMaster' });
              return;
            }
            }
         }
       }
      }
    } catch (error) {
    if (transaction) {
      await transaction.rollback(); // Rollback the transaction if an error occurs
    }
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to insert data' });
  } finally {
    if (transaction) {
      await transaction.commit(); // Commit the transaction if no errors occurred
    }
    sqlServerCon.close(); // Close the connection when done
  }
});

app.get('/api/GetCharges/:SGID', async (req, res) => {
  const SGID = req.params.SGID;
  // console.log('SGID result:', SGID);
 
  const Sql = "select SGID, Charges, SGName, SGType, DPTID from TGMaster inner join SGMaster on SGMaster.TGID=TGMaster.TGID where SGMaster.SGID = @SGID" 
   
  const request = new sql.Request(sqlServerCon);
  request.input('SGID', sql.Int, SGID);

  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json([result.recordset[0]]);
      // console.log(' result:', result);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.get('/api/fetchRefferal', async (req, res) => {
 
  const Sql = "select * from ReferalMaster" 
   
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/fetchOref', async (req, res) => {
 
  const Sql = "SELECT DISTINCT Oref FROM RFIMaster" 
   
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json([results]);
    }
  });
});

app.get('/api/fetchRNo', async (req, res) => {
 
  const Sql = "select isnull(max(RNo),0)+1, ISNULL(max(convert(int,RegNo)),0)+1 as RegNo from RFIMaster" 
   
  try {
    const result = await sqlServerCon.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json([result.recordset[0]]);
      // console.log(' result:', result);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.put('/api/UpdatePRegis/:RFIID', async (req, res) => {
  const RFIID =req.params.RFIID;
  const { rNo, cDate, cTime, rDate, rTime, pNameTitle, pName, year, month, day, selectedGender, mNo, rBy, selectedRefferalId, cBy, cCen, gAmnt, mgmtDsc, drDsc, cCharges, payableAmnt, advance, balance, repNo, remarks, selectedOptionCharges } = req.body;
  console.log(req.body);

  const request = new sql.Request(sqlServerCon);
  request.input('RFIID', sql.Int, RFIID);
  const cTimeDate = new Date(`2000-01-01T${cTime}`);
  const rTimeDate = new Date(`2000-01-01T${rTime}`);

  request.input('rNo', sql.NVarChar(50), rNo);
  request.input('cDate', sql.Date, cDate);
  request.input('cTime', sql.Time(3), cTimeDate);
  request.input('rDate', sql.Date, rDate);
  request.input('rTime', sql.Time(3), rTimeDate);
  request.input('pNameTitle', sql.VarChar(50), pNameTitle);
  request.input('pName', sql.NVarChar(500), pName);
  request.input('year', sql.NVarChar(50), year);
  request.input('month', sql.NVarChar(50), month);
  request.input('day', sql.NVarChar(50), day);
  request.input('selectedGender', sql.NVarChar(50), selectedGender);
  request.input('mNo', sql.NVarChar(100), mNo);
  request.input('rBy', sql.VarChar(50), rBy);
  request.input('selectedRefferalId', sql.Int, selectedRefferalId);
  request.input('cBy', sql.VarChar(50), cBy);
  request.input('cCen', sql.VarChar(50), cCen);
  request.input('gAmnt', sql.Numeric(18, 0), gAmnt);
  request.input('mgmtDsc', sql.Numeric(18, 0), mgmtDsc);
  request.input('drDsc', sql.Numeric(18, 2), drDsc);
  request.input('cCharges', sql.Numeric(18, 2), cCharges);
  request.input('payableAmnt', sql.Numeric(18, 0), payableAmnt);
  request.input('advance', sql.Numeric(18, 2), advance);
  request.input('balance', sql.Numeric(18, 2), balance);
  request.input('repNo', sql.Int, repNo);
  request.input('remarks', sql.NVarChar('max'), remarks);

  try {
    const primaryInsertSql = "UPDATE [RFIMaster] SET REgNo = @rNo, Cdate = @cDate, CTime = @cTime, RDate = @rDate, RTime = @rTime, Title = @pNameTitle, PName = @pName, Year = @year, Month = @month, Day = @day, Sex = @selectedGender, ContactNo = @mNo, Dr = @rBy, RID = @selectedRefferalId, CollBy = @cBy, CollCen = @cCen, GAmt = @gAmnt, MgmtDsc = @mgmtDsc, DrDiscount = @drDsc, CollCharge = @cCharges, PAmt = @payableAmnt, Advance = @advance, BalAmt = @balance, RNo = @repNo, Remarks = @remarks where RFIID = @RFIID";

    request.query(primaryInsertSql, (primaryInsertError, primaryInsertResults) => {
      if (primaryInsertError) {
        console.error('Error updating Data:', primaryInsertError);
        res.status(500).json({ success: false, error: 'Failed to update Data' });
        return;
      }

      if (primaryInsertResults && primaryInsertResults.rowsAffected > 0) {
        
        for (const test of selectedOptionCharges) {
          const { SGName, Charges, SGID, DPTID, SGType} = test;
          // console.log(test);
          
          const secondaryInsertRequest = new sql.Request(sqlServerCon);

          const secondaryInsertSql = "UPDATE [RFIChild] SET TestName = @SGName, Rate = @Charges, SGID = @SGID, DPTID = @DPTID, SGType = @SGType where RFIID = @RFIID";

          secondaryInsertRequest.input('RFIID', sql.Int, RFIID);
          secondaryInsertRequest.input('SGName', sql.NVarChar(500), SGName);
          secondaryInsertRequest.input('Charges', sql.Numeric(18, 2), Charges);
          secondaryInsertRequest.input('SGID', sql.Int, SGID);
          secondaryInsertRequest.input('DPTID', sql.Int, DPTID);
          secondaryInsertRequest.input('SGType', sql.VarChar(50), SGType);

          // Execute the secondary insert
          secondaryInsertRequest.query(secondaryInsertSql, (secondaryInsertError) => {
            if (secondaryInsertError) {
              console.error('Error updating data into RFIChild:', secondaryInsertError);
            }
          });
        }

        const { selectedRefferalId, repNo, rDate, payableAmnt, advance, pMode} = req.body;
        // console.log(req.body);
        const thirdInsertRequest = new sql.Request(sqlServerCon);
        const thirdInsertSql = "UPDATE [PHead] SET RID = @selectedRefferalId, RNo = @repNo, PDate = @rDate, Dr = @payableAmnt, Cr = @advance, PMode = @pMode  where RFIID = @RFIID";

        thirdInsertRequest.input('RFIID', sql.Int, RFIID);
        thirdInsertRequest.input('selectedRefferalId', sql.Int, selectedRefferalId);
        thirdInsertRequest.input('repNo', sql.Int, repNo);
        thirdInsertRequest.input('rDate', sql.Date, rDate);
        thirdInsertRequest.input('payableAmnt', sql.Numeric(18, 2), payableAmnt);
        thirdInsertRequest.input('advance', sql.Numeric(18,2), advance);
        thirdInsertRequest.input('pMode', sql.NVarChar(50), pMode);

        // Execute the secondary insert
         thirdInsertRequest.query(thirdInsertSql, (thirdInsertError) => {
          if (thirdInsertError) {
            console.error('Error updating data into PHead:', thirdInsertError);
          }
        });

        console.log('Data updated successfully');
        res.status(200).json({ success: true, message: 'Data inserted successfully' });
      } else {
        console.error('Primary update into TMaster did not affect any rows.');
        res.status(500).json({ success: false, error: 'Primary update into TMaster did not affect any rows' });
      }
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ success: false, error: 'Failed to update data' });
  }
});

app.get('/api/updatePDetails/:RFIID', async (req, res) => {
  const RFIID = req.params.RFIID;
  const Sql = "select RegNo, Barcode, AbhaNo, AdharNo, RFIMaster.RID, Cdate, CTime, RDate, RTime, Title, PName, Year, Month, Day, Sex, ContactNo, RFIMaster.Email, RFIMaster.Dr, CollBy, CollCen, Address, GAmt, MgmtDsc, DrDiscount, CollCharge, PAmt, Advance, BalAmt, RFIMaster.RNo, RFIMaster.Remarks, ReferalMaster.RName as RefName, PHead.PMode as PMode, RFIChild.TestName, RFIChild.Rate as Rate  from RFIMaster inner join RFIChild on RFIChild.RFIID = RFIMaster.RFIID inner join PHead on PHead.RFIID = RFIMaster.RFIID inner join ReferalMaster on ReferalMaster.RID = RFIMaster.RID  WHERE RFIMaster.RFIID = @RFIID";

  const request = new sql.Request(sqlServerCon);
  request.input('RFIID', sql.Int, RFIID); // Use request.input to define the parameter
   
  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      // res.json([result.recordset[0]]);
      // console.log(' result:', result);
      res.json(result.recordset);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});
/*----------------------------------------------------------------
----------------End API For Patient Registration Page ------------
--------------------------------------------------------------- */

app.get('/api/getPDetails', async (req, res) => {
 
    const Sql = "SELECT * from RFIMaster where RFIStatus = 'Done'"
    sqlServerCon.query(Sql, (insertError, results) => {
      if (insertError){
        console.error('Error executing SQL query:', insertError);
        res.status(500).json({ error: 'Error executing SQL query' });
      } else {
        // console.log('Query result:', results);
        res.json(results);
      }
    });
});
  
app.post('/api/getFilteredPDetails', async (req, res) => {
  const filterCriteria = req.body;
  // console.log(req.body);

  // Define the base query
  let Sql = "SELECT * FROM RFIMaster "; // Start with 1=1

  // Create an array to store conditions
  const conditions = [];

  // Create an array to store parameter values
  const params = {};

  if (filterCriteria.fromDate && filterCriteria.toDate) {
    conditions.push('CDate BETWEEN @fromDate AND @toDate');
    params.fromDate = filterCriteria.fromDate;
    params.toDate = filterCriteria.toDate;
  }

  if (filterCriteria.cCen) {
    conditions.push('CollCen = @cCen');
    params.cCen = filterCriteria.cCen;
  }

  if (filterCriteria.selectedRefferalId > 0) {
    conditions.push('RID = @selectedRefferalId');
    params.selectedRefferalId = filterCriteria.selectedRefferalId;
  }

  if (filterCriteria.selectedStatus && filterCriteria.selectedStatus.length > 0) {
    conditions.push('RFIStatus = @selectedStatus');
    params.selectedStatus = filterCriteria.selectedStatus;
  }

  // If there are conditions, add them to the query
  if (conditions.length > 0) {
    Sql += ' WHERE ' + conditions.join(' AND ');
  }
  console.log(Sql);
  const request = new sql.Request(sqlServerCon);

  // Assign parameters and their types
  request.input('selectedStatus', sql.VarChar(50), params.selectedStatus);
  request.input('selectedRefferalId', sql.Int, params.selectedRefferalId);
  request.input('fromDate', sql.Date, params.fromDate);
  request.input('toDate', sql.Date, params.toDate);
  request.input('cCen', sql.VarChar(50), params.cCen);

  request.query(Sql, (queryError, results) => {
    if (queryError) {
      console.error('Error executing SQL query:', queryError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results.recordset);
      // console.log('Query result:', results);
      // console.log(results);
    }
  });
});

app.put('/api/DeletePDetails/:RFIID', (req, res) => {
  const RFIID = req.params.RFIID;
  const Deletesql = "Update RFIMaster set RFIStatus = 'Cancel' WHERE RFIID = @RFIID";
  
  const request = new sql.Request(sqlServerCon);
  request.input('RFIID', sql.Int, RFIID);
  
  request.query(Deletesql, (deleteError, results) => {
    if (deleteError) {
      console.error('Error executing SQL query:', deleteError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/GetPatientData/:RFIID/:SGID', async (req, res) => {
  const RFIID = req.params.RFIID;
  const SGID = req.params.SGID;
  console.log(SGID, RFIID)

  const Sql = `select * from (select distinct SNo, PSLNo as RTID, RFIMaster.RFIID, TGName, SGName, SGSName, MethodName, Inter, TMaster.TName, TMaster.TestType, Method as TestMethod, TestNote, '' as TestDescription, Uname as UnitName, RValue, case when Sex='Male' then TMaster.MinV when Sex='Female' then TMaster.MinVM end as MinV, case when Sex='Male' then TMaster.MaxV when Sex='Female' then TMaster.MaxVM end as MaxV,case When Sex='Male' then TMaster.MinW When Sex='Female' then TMaster.MinWM end as MinW, case when Sex='Male' then TMaster.MaxW when Sex='Female' then TMaster.MaxWM end as MaxW, Case when Sex='Male'  then TMaster.Display when Sex='Female' then TMaster.DisplayM end as Display, REgNo, Cdate as ColDate,ReportOn  as RcdDate,UpdateDate as RepDate, ResultMaster.EDate as ResultEDate, Title, PName, [Day], [Month], [Year], Dr, Oref, Sex, ContactNo, CollCen, RFIMaster.TName as TechName, RName as RefName, TMaster.O1 as Heading, SGPrint, 0 as Rate, PSLNo,'' as RStatus from REsultMaster left join SGMaster on SGMaster.SGID=REsultMaster.SGID inner join TGMaster on TGMaster.TGID=SGMaster.TGID inner join TMaster on TMaster.TID=REsultMaster.TID inner join RFIMaster on RFIMaster.RFIID=REsultMaster.RFIID inner join RFIChild on RFIChild.RCID=REsultMaster.RCID inner join ReferalMaster on ReferalMaster.RID = RFIMaster.RID Where RFIMaster.RFIID = @RFIID and REsultMaster.SGID in (@SGID) and TMaster.TestType not in ('AGE WISE RANGE') union select distinct SNo, PSLNo as RTID, RFIMaster.RFIID,  TGName, SGName, SGSName,MethodName, Inter, TMaster.TName, TMaster.TestType,Method as TestMethod,TestNote,'' as TestDescription, Uname as UnitName, RValue, case when Sex='Male' then TAM.MinV when Sex='Female' then TAM.MinVM end as MinV, case when Sex='Male' then TAM.MaxV when Sex='Female' then TAM.MaxVM end as MaxV,case When Sex='Male' then TAM.MinW When Sex='Female' then TAM.MinWM end as MinW, case when Sex='Male' then TAM.MaxW when Sex='Female' then TAM.MaxWM end as MaxW, Case when Sex='Male'  then TAM.Display when Sex='Female' then TAM.DisplayM end as Display,REgNo,  Cdate as ColDate,ReportOn  as RcdDate,UpdateDate as RepDate, ResultMaster.EDate as ResultEDate, Title, PName,[Day],[Month],[Year],Dr, Oref ,Sex, ContactNo, CollCen, RFIMaster.TName as TechName,RName as RefName, TMaster.O1 as Heading, SGPrint, 0 as Rate, PSLNo,'' as RStatus from REsultMaster inner join SGMaster on SGMaster.SGID=REsultMaster.SGID inner join TGMaster on TGMaster.TGID=SGMaster.TGID inner join TMaster on TMaster.TID=REsultMaster.TID  inner join TAgeMaster TAM on TAM.TID=TMaster.TID inner join RFIMaster on RFIMaster.RFIID=REsultMaster.RFIID inner join RFIChild on RFIChild.RCID=REsultMaster.RCID inner join ReferalMaster on ReferalMaster.RID=RFIMaster.RID Where RFIMaster.RFIID= @RFIID and REsultMaster.SGID in (@SGID) and TMaster.TestType in ('AGE WISE RANGE')and 30 between LAge and UAge and AgeType='Year' and RFIMaster.RFIStatus='Done')x order by SNo, RTID`;

  const request = new sql.Request(sqlServerCon);
  request.input('RFIID', sql.Int, RFIID);
  request.input('SGID', sql.Int, SGID);   
  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      // res.json([result.recordset[0]]);
      // console.log(' result:', result);
      res.json(result.recordset);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.get('/api/getFurtherDetails/:RFIID', async (req, res) => {
  const RFIID = req.params.RFIID;
 
  const Sql = "SELECT RCID, TestName, SGID, Status FROM RFIChild WHERE RFIID = @RFIID"
  const request = new sql.Request(sqlServerCon);
  request.input('RFIID', sql.Int, RFIID);

   try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      // res.json([result.recordset[0]]);
      // console.log(' result:', result);
      res.json(result.recordset);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.post('/api/getResultDetails/:RFIID', async (req, res) => {
  const { RFIID } = req.params;
  const { SGID } = req.body;
  // console.log(req.body)
  // console.log(req.params)
  const Sql = "SELECT * from ResultMaster WHERE RFIID = @RFIID AND SGID = @SGID";

  const request = new sql.Request(sqlServerCon);
  request.input('RFIID', sql.Int, RFIID);
  request.input('SGID', sql.Int, SGID);

  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      // res.json([result.recordset[0]]);
      // console.log(' result:', result);
      res.json(result.recordset);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.put('/api/updateRValue', (req, res) => {
  const {RTID, newRValue} = req.body;
  console.log(req.body)

  const Updatesql = "Update ResultMaster set RValue = @newRValue WHERE RTID = @RTID";
  
  const request = new sql.Request(sqlServerCon);
  request.input('RTID', sql.Int, RTID);
  request.input('newRValue', sql.NVarChar('max'), newRValue);
  
  request.query(Updatesql, (updateError, results) => {
    if (updateError) {
      console.error('Error executing SQL query:', updateError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});

app.put('/api/PTest', (req, res) => {
  const {RTID, newPTest} = req.body;
  console.log(req.body)

  const Updatesql = "Update ResultMaster set PTest = @newPTest WHERE RTID = @RTID";
  
  const request = new sql.Request(sqlServerCon);
  request.input('RTID', sql.Int, RTID);
  request.input('newPTest', sql.VarChar(50), newPTest);
  
  request.query(Updatesql, (updateError, results) => {
    if (updateError) {
      console.error('Error executing SQL query:', updateError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});

app.put('/api/updateStatus', (req, res) => {
  const {RCID, newStatus} = req.body;
  console.log(req.body)

  const Updatesql = "Update RFIChild set Status = @newStatus WHERE RCID = @RCID";
  
  const request = new sql.Request(sqlServerCon);
  request.input('RCID', sql.Int, RCID);
  request.input('newStatus', sql.VarChar(50), newStatus);
  
  request.query(Updatesql, (updateError, results) => {
    if (updateError) {
      console.error('Error executing SQL query:', updateError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/getDashData', async (req, res) => {
 
  const Sql = "select count(*) from RFIMaster"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/getDashToData', async (req, res) => {
 
  const Sql = "SELECT COUNT(*) FROM RFIMaster WHERE CAST(Cdate AS DATE) = CAST(GETDATE() AS DATE)"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/getDashAmntData', async (req, res) => {
 
  const Sql = "Select isnull(Sum(Cr),0) from PHead"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/getDashToAmntData', async (req, res) => {
 
  const Sql = "Select isnull(Sum(Cr),0) from PHead WHERE CAST(PDate AS DATE) = CAST(GETDATE() AS DATE)"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/getWaitingDetails', async (req, res) => {
 
  const Sql = "select distinct RFI.RFIID, RegNo as [RegistrationNo], Cdate as [Date], PName+' ('+RFI.Sex+'-'+[YEAR]+')' as [PatientName], Dr+' '+Oref as [ReferredBy], RName as [ClientName], CollCen as [CollectedBy],(SELECT STUFF((SELECT ', ' + TestName FROM RFIChild where RFI.RFIID=RFIChild.RFIID and RFICHILD.DPTID='1' and SGType='Test' ORDER BY SNo FOR XML PATH('')),1, 1, '')) AS [Investigation], (Select COUNT(*) from RFIChild Where RFIID=RFI.RFIID and Status in ('No')  and SGType='Test') as Pending,(Select COUNT(*) from RFIChild Where RFIID=RFI.RFIID and Status in ('Yes')  and SGType='Test') as Complete,(Select COUNT(*) from RFIChild Where RFIID=RFI.RFIID and Status in ('App')  and SGType='Test') as Approved from RFIMaster RFI inner join ReferalMaster on ReferalMaster.RID=RFI.RID inner join RFIChild on rfichild.RFIID=RFI.RFIID"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/getWaitingTestDetails', async (req, res) => {
 
  const Sql = "select  RFI.RFIID, RegNo as [RegistrationNo], Cdate as [Date], TestName, PName+' ('+RFI.Sex+'-'+[YEAR]+')' as [PatientName], DR+' '+Oref as [ReferredBy], RName as [ClientName], CollCen as [CollectedBy],case when Status='No' then 'Pending' When status='Yes' then 'Complete' When status='App' then 'Approved' end as [TestStatus] from RFIMaster RFI inner join ReferalMaster on ReferalMaster.RID=RFI.RID inner join RFIChild on rfichild.RFIID=RFI.RFIID"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.post('/api/getFilteredColDetails', async (req, res) => {
  const { fromDate, toDate, cCen, selectedRefferalId, selectedMode } = req.body;
  console.log(req.body);

  // Define the base query
  let Sql = "select distinct PDate as Date, RFIMaster.RegNo , PName+' ('+RFIMaster.Sex+'-'+[YEAR]+')' as [PatientName], RFIMaster.DR+' '+Oref as [ReferredBy], RName as [ClientName], CollCen as CollectedBy, PHead.RNo as RecieptNo, PMode,  isnull(PHead.DR,0) as DR, isnull(CR,0) as CR,RFiMaster.RFIID from RFiMaster inner join PHead on PHead.RFIID=RFIMaster.RFIID inner join ReferalMaster on ReferalMaster.RID=RFIMaster.RID inner join RFIChild on RFIChild.RFIID=RFIMaster.RFIID WHERE PDate BETWEEN @fromDate AND @toDate AND CollCen = @cCen AND PHead.RID = @selectedRefferalId AND PMode = @selectedMode"
  // console.log(Sql);
  const request = new sql.Request(sqlServerCon);

  request.input('selectedMode', sql.NVarChar(50), selectedMode);
  request.input('selectedRefferalId', sql.Int, selectedRefferalId);
  request.input('fromDate', sql.Date, fromDate);
  request.input('toDate', sql.Date, toDate);
  request.input('cCen', sql.VarChar(50),cCen);

  request.query(Sql, (queryError, results) => {
    if (queryError) {
      console.error('Error executing SQL query:', queryError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results.recordset);
      // console.log('Query result:', results);
    }
  });
});

app.get('/api/logInDetails', async (req, res) => {
 
  const Sql = "select LoginID, LoginName, [Password], LoginType, OID from loginMaster order by LoginName"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/api/UserDetails/:LoginID', async (req, res) => {
  const LoginID = req.params.LoginID;
  
  const Sql = "select LoginID, LoginName, [Password], LoginType, OID from loginMaster where LoginID = @LoginID"
  
  const request = new sql.Request(sqlServerCon);
  request.input('LoginID', sql.Int, LoginID);
  
  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json(result.recordset[0]);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.get('/api/formDetails', async (req, res) => {
 
  const Sql = "select FRMID, FRMname as [FormName], RAdd as [AddNewRecord], RUpdate as [UpdateRecord], RDelete as [DeleteRecord],RView as [ViewRecord], RPrint as [PrintRecord], frmSNo from CreateForm order by frmSNo"
  sqlServerCon.query(Sql, (insertError, results) => {
    if (insertError){
      console.error('Error executing SQL query:', insertError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      // console.log('Query result:', results);
      res.json(results);
    }
  });
});

app.get('/PrPrint', (req, res) => {
  // Generate the QR code based on your report data
  const qrCode = generateQRCode(); // Replace with your QR code generation logic
  console.log(qrCode)
  // Set the headers to trigger a download
  res.set('Content-Disposition', 'attachment; filename="medical_report.png"');
  res.set('Content-Type', 'image/png');

  // Send the QR code image as a response
  res.send(qrCode);
  console.log('QR Code:', qrCode);
});

app.post('/api/frmRecords', async (req, res) => {
  const {cType, uName, password, userLoginType, oID} = req.body;
  console.log(req.body);

  const transaction = new sql.Transaction(sqlServerCon);
  
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);
    request.input('cType', sql.VarChar(50), cType);
    request.input('uName', sql.VarChar(50), uName);
    request.input('password', sql.NVarChar(100), password);
    request.input('userLoginType', sql.VarChar(50), userLoginType);
    request.input('oID', sql.Int, oID);

    const primaryInsertSql = `
    INSERT INTO [loginMaster] (LoginType, LoginName, Password, OID, SaveBy, SDate)
    OUTPUT INSERTED.LoginID
    VALUES (@cType, @uName, @password, @oID, @userLoginType, GETDATE())
    `;

    const primaryInsertResults = await request.query(primaryInsertSql);

    if (primaryInsertResults && primaryInsertResults.rowsAffected > 0) {
      const generatedLoginID = primaryInsertResults.recordset[0].LoginID;
      if (!generatedLoginID) {
        console.log(generatedLoginID);
        // await transaction.rollback(); // Rollback the transaction
        console.error('Failed to retrieve generated LoginID from RFIMaster.');
        res.status(500).json({ success: false, error: 'Failed to retrieve generated LoginID' });
        return;
      }  
        const {selectedFRMID, newARec, newURec, newDRec, newVRec, newPRec, selectedfrmSNo} = req.body;
        console.log(req.body);

        const thirdInsertRequest = new sql.Request(transaction);
        const thirdInsertSql = ` INSERT INTO [Privilege] (LoginID, frmID, RA, RU, RD, RV, RP, PSNo)
        VALUES (@generatedLoginID, @selectedFRMID, @newARec, @newURec, @newDRec, @newVRec, @newPRec, @selectedfrmSNo)
        `;

        thirdInsertRequest.input('generatedLoginID', sql.Int, generatedLoginID);
        thirdInsertRequest.input('selectedFRMID', sql.Int, selectedFRMID);
        thirdInsertRequest.input('newARec', sql.Bit, newARec);
        thirdInsertRequest.input('newURec', sql.Bit, newURec);
        thirdInsertRequest.input('newDRec', sql.Bit, newDRec);
        thirdInsertRequest.input('newVRec', sql.Bit, newVRec);
        thirdInsertRequest.input('newPRec', sql.Bit, newPRec);
        thirdInsertRequest.input('selectedfrmSNo', sql.Int, selectedfrmSNo);

        // Execute the secondary insert
        await thirdInsertRequest.query(thirdInsertSql);
        await transaction.commit();
      }
    } 
    catch (error) {
      console.error(error);
      await transaction.rollback();
      res.status(500).json({ success: false, error: 'An error occurred' });
    } finally {
      // Any finalization code you want to include
    }
});

app.put('/api/UpdatefrmRecords/:LoginID', async (req, res) => {
  const LoginID = req.params.LoginID;
  const {cType, uName, password, userLoginType} = req.body;
  console.log(req.body);

  const transaction = new sql.Transaction(sqlServerCon);
  
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);
    request.input('cType', sql.VarChar(50), cType);
    request.input('uName', sql.VarChar(50), uName);
    request.input('password', sql.NVarChar(100), password);
    request.input('userLoginType', sql.VarChar(50), userLoginType);
    request.input('LoginID', sql.Int, LoginID);

    const primaryInsertSql = `
    UPDATE [loginMaster] set LoginType = @cType, LoginName = @uName, Password = @password, UpdateBy = @userLoginType, SDate = GETDATE() where LoginID = @LoginID
    `;

    await request.query(primaryInsertSql);

    const {selectedFRMID, newARec, newURec, newDRec, newVRec, newPRec, selectedfrmSNo} = req.body;
    console.log(req.body)
    const thirdInsertRequest = new sql.Request(transaction);
    const thirdInsertSql = ` UPDATE [Privilege] set LoginID = @LoginID, RA = @newARec, RU = @newURec, RD = @newDRec, RV = @newVRec, RP = @newPRec, PSNo = @selectedfrmSNo where frmID = @selectedFRMID
    `
    thirdInsertRequest.input('LoginID', sql.Int, LoginID);
    thirdInsertRequest.input('selectedFRMID', sql.Int, selectedFRMID);
    thirdInsertRequest.input('newARec', sql.Bit, newARec);
    thirdInsertRequest.input('newURec', sql.Bit, newURec);
    thirdInsertRequest.input('newDRec', sql.Bit, newDRec);
    thirdInsertRequest.input('newVRec', sql.Bit, newVRec);
    thirdInsertRequest.input('newPRec', sql.Bit, newPRec);
    thirdInsertRequest.input('selectedfrmSNo', sql.Int, selectedfrmSNo);

    // Execute the secondary insert
    await thirdInsertRequest.query(thirdInsertSql);
    await transaction.commit();
    } 
    catch (error) {
      console.error(error);
      await transaction.rollback();
      res.status(500).json({ success: false, error: 'An error occurred' });
    } finally {

    }
});

app.post('/api/getLogInDetails/:LoginID', async (req, res) => {
  const { LoginID } = req.params;
  console.log(req.params)

  const Sql = "select FRMID, FRMName, RA, RU, RD, RV, RP,PSNo from(select Privilege.frmID, FRmName, RA, RU, RD, RV, RP, PSNo from Privilege inner join CreateForm on Createform.FRMID=Privilege.FrmID where LoginID = @LoginID union select FRMID, FRMname as [FormName], rAdd as [AddNewRecord], RUpdate as [UpdateRecord], RDelete as [Delete record],RView as [ViewRecord], RPrint as [PrintRecord],FrmSNo from CreateForm where FRMID not in (select FrmID from Privilege where LoginID = @LoginID))x  order By PSNo";

  const request = new sql.Request(sqlServerCon);
  request.input('LoginID', sql.Int, LoginID);

  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      // res.json([result.recordset[0]]);
      // console.log(' result:', result);
      res.json(result);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});

app.get('/api/getDrPDetails/:RID', async (req, res) => {
  const { rID } = req.params;
  console.log(req.params)
 
  const Sql = "select distinct RFI.RFIID, RegNo as [RegistrationNo], Cdate as [Date], PName+' ('+RFI.Sex+'-'+[YEAR]+')' as [PatientName], Dr+' '+Oref as [ReferredBy], CollCen as [CollectedBy],(SELECT STUFF((SELECT ', ' + TestName FROM RFIChild where RFI.RFIID=RFIChild.RFIID and RFICHILD.DPTID='1' and SGType='Test' ORDER BY SNo FOR XML PATH('')),1, 1, '')) AS [Investigation] from RFIMaster RFI inner join ReferalMaster on ReferalMaster.RID=RFI.RID inner join RFIChild on rfichild.RFIID=RFI.RFIID where ReferalMaster.RID = @rID"

  const request = new sql.Request(sqlServerCon);
  request.input('rID', sql.Int, rID);
  
  request.query(Sql, (queryError, results) => {
    if (queryError) {
      console.error('Error executing SQL query:', queryError);
      res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results.recordset);
      // console.log('Query result:', results);
      // console.log(results);
    }
  });
});

app.post('/api/getFilteredDrPDetails', async (req, res) => {
  const filterCriteria = req.body;
  console.log(req.body);

  // Check if RID exists in filterCriteria
  if (!filterCriteria.rID) {
    return res.status(400).json({ error: 'RID is required' });
  }

  let Sql = "select distinct RFI.RFIID, RegNo as [RegistrationNo], Cdate as [Date], PName+' ('+RFI.Sex+'-'+[YEAR]+')' as [PatientName], Dr+' '+Oref as [ReferredBy], CollCen as [CollectedBy],(SELECT STUFF((SELECT ', ' + TestName FROM RFIChild where RFI.RFIID=RFIChild.RFIID and RFICHILD.DPTID='1' and SGType='Test' ORDER BY SNo FOR XML PATH('')),1, 1, '')) AS [Investigation] from RFIMaster RFI inner join ReferalMaster on ReferalMaster.RID=RFI.RID inner join RFIChild on rfichild.RFIID=RFI.RFIID";

  const conditions = [];
  const params = {};

  if (filterCriteria.fromDate && filterCriteria.toDate) {
    conditions.push('CDate BETWEEN @fromDate AND @toDate');
    params.fromDate = filterCriteria.fromDate;
    params.toDate = filterCriteria.toDate;
  }

  if (conditions.length > 0) {
    Sql += ' WHERE ' + conditions.join(' AND ');
  }

  if (conditions.length > 0) {
    Sql += ' AND ';
  } else {
    Sql += ' WHERE ';
  }
  Sql += 'ReferalMaster.RID = @rID';
  params.rID = filterCriteria.rID;

  // console.log(Sql);
  const request = new sql.Request(sqlServerCon);

  request.input('rID', sql.Int, params.rID);
  request.input('fromDate', sql.Date, params.fromDate);
  request.input('toDate', sql.Date, params.toDate);

  request.query(Sql, (queryError, results) => {
    if (queryError) {
      console.error('Error executing SQL query:', queryError);
      return res.status(500).json({ error: 'Error executing SQL query' });
    } else {
      res.json(results.recordset);
    }
  });
});

app.get('/api/GetDrPatientData/:RFIID', async (req, res) => {
  const RFIID = req.params.RFIID;
  console.log(RFIID)

  const Sql = `select * from (select distinct SNo, PSLNo as RTID, RFIMaster.RFIID, TGName, SGName, SGSName, MethodName, Inter, TMaster.TName, TMaster.TestType, Method as TestMethod, TestNote, '' as TestDescription, Uname as UnitName, RValue, case when Sex='Male' then TMaster.MinV when Sex='Female' then TMaster.MinVM end as MinV, case when Sex='Male' then TMaster.MaxV when Sex='Female' then TMaster.MaxVM end as MaxV,case When Sex='Male' then TMaster.MinW When Sex='Female' then TMaster.MinWM end as MinW, case when Sex='Male' then TMaster.MaxW when Sex='Female' then TMaster.MaxWM end as MaxW, Case when Sex='Male'  then TMaster.Display when Sex='Female' then TMaster.DisplayM end as Display, REgNo, Cdate as ColDate,ReportOn  as RcdDate,UpdateDate as RepDate, ResultMaster.EDate as ResultEDate, Title, PName, [Day], [Month], [Year], Dr, Oref, Sex, ContactNo, CollCen, RFIMaster.TName as TechName, RName as RefName, TMaster.O1 as Heading, SGPrint, 0 as Rate, PSLNo,'' as RStatus from REsultMaster left join SGMaster on SGMaster.SGID=REsultMaster.SGID inner join TGMaster on TGMaster.TGID=SGMaster.TGID inner join TMaster on TMaster.TID=REsultMaster.TID inner join RFIMaster on RFIMaster.RFIID=REsultMaster.RFIID inner join RFIChild on RFIChild.RCID=REsultMaster.RCID inner join ReferalMaster on ReferalMaster.RID = RFIMaster.RID Where RFIMaster.RFIID = @RFIID and TMaster.TestType not in ('AGE WISE RANGE') union select distinct SNo, PSLNo as RTID, RFIMaster.RFIID,  TGName, SGName, SGSName,MethodName, Inter, TMaster.TName, TMaster.TestType,Method as TestMethod,TestNote,'' as TestDescription, Uname as UnitName, RValue, case when Sex='Male' then TAM.MinV when Sex='Female' then TAM.MinVM end as MinV, case when Sex='Male' then TAM.MaxV when Sex='Female' then TAM.MaxVM end as MaxV,case When Sex='Male' then TAM.MinW When Sex='Female' then TAM.MinWM end as MinW, case when Sex='Male' then TAM.MaxW when Sex='Female' then TAM.MaxWM end as MaxW, Case when Sex='Male'  then TAM.Display when Sex='Female' then TAM.DisplayM end as Display,REgNo,  Cdate as ColDate,ReportOn  as RcdDate,UpdateDate as RepDate, ResultMaster.EDate as ResultEDate, Title, PName,[Day],[Month],[Year],Dr, Oref ,Sex, ContactNo, CollCen, RFIMaster.TName as TechName,RName as RefName, TMaster.O1 as Heading, SGPrint, 0 as Rate, PSLNo,'' as RStatus from REsultMaster inner join SGMaster on SGMaster.SGID=REsultMaster.SGID inner join TGMaster on TGMaster.TGID=SGMaster.TGID inner join TMaster on TMaster.TID=REsultMaster.TID  inner join TAgeMaster TAM on TAM.TID=TMaster.TID inner join RFIMaster on RFIMaster.RFIID=REsultMaster.RFIID inner join RFIChild on RFIChild.RCID=REsultMaster.RCID inner join ReferalMaster on ReferalMaster.RID=RFIMaster.RID Where RFIMaster.RFIID= @RFIID and TMaster.TestType in ('AGE WISE RANGE')and 30 between LAge and UAge and AgeType='Year' and RFIMaster.RFIStatus='Done')x order by SNo, RTID`;

  const request = new sql.Request(sqlServerCon);
  request.input('RFIID', sql.Int, RFIID);
  try {
    const result = await request.query(Sql);
    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      // res.json([result.recordset[0]]);
      // console.log(' result:', result);
      res.json(result.recordset);
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Error executing SQL query' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = router;