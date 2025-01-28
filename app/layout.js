'use client';

import { Provider } from 'react-redux';
import store from './store';
import { useState, useEffect } from 'react';
import './globals.css';
import Header from './components/Header.js';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({ children }) {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <html lang="en" className="h-full">
      <Provider store={store}>
        <body
          className={`font-pixelify ${
            isDarkTheme ? 'dark' : ''
          } flex flex-col h-full`}
        >
          <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />

          <div className="flex-grow overflow-auto">{children}</div>
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme={isDarkTheme ? 'dark' : 'light'}
          />
          <Footer />
        </body>
      </Provider>
    </html>
  );
}
