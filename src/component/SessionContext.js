import React, { createContext, useContext, useState } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [userLoginType, setUserLoginType] = useState(null);
  const [userlabName, setUserlabName] = useState(null);
  const [sId, setSId] = useState(null);
  const [centreType, setCentreType] = useState(null);
  const [line1, setLine1] = useState(null);
  const [oID, setOID] = useState(null);
  const [rID, setRID] = useState(null);
  const [dLoginName, setDLoginName] = useState(null);
  const [rfiID, setRFIID] = useState(null);
  const [loginNameT, setLoginNameT] = useState(null);
  const [loginName, setLoginName] = useState(null);

  return (
    <SessionContext.Provider value={{ userLoginType, setUserLoginType, userlabName, setUserlabName, sId, setSId, centreType, setCentreType, line1, setLine1, oID, setOID, rfiID, setRFIID, loginNameT, setLoginNameT, loginName, setLoginName, rID, setRID, dLoginName, setDLoginName }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
