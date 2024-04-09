import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react'
import App from './App';
import {BrowserRouter} from "react-router-dom";
import { UserProvider } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
    <ChakraProvider>
    <BrowserRouter>
    <App/>
    </BrowserRouter>
    </ChakraProvider>
    </UserProvider>
  </React.StrictMode>
);


