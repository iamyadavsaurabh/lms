import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContextProvider } from './AppContext';

const ContextWrapper = ({ children }) => {
  const navigate = useNavigate();

  return (
    <AppContextProvider navigate={navigate}>
      {children}
    </AppContextProvider>
  );
};

export default ContextWrapper;
