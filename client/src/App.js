import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import axios from 'axios';

function App() {
  const [shouldRender, setShouldRender] = useState(true);
  useEffect(() => {
    const 
      baseUrl = 'http://localhost:5000',
      fpPublicKey = process.env.REACT_APP_FP_API_PUBLIC_KEY,
      fpPromise = FingerprintJS.load({ apiKey: fpPublicKey });
    (async () => {
      // Get the visitor identifier when you need it.
      const fp = await fpPromise  
      const result = await fp.get()

      const visitorId = result.visitorId;
      const res = await axios.get(`${baseUrl}/visitors/${visitorId}`);
      if (res.data?.scraper_detected) {
        setShouldRender(false);
      }
    })();
  }, []);
  if (!shouldRender) return (<div>You need to verified via CAPTCHA</div>)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
