import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import axios from 'axios';

function App() {
  const [shouldRender, setShouldRender] = useState(true);
  const [data, setData] = useState(null);
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
      } else {
        const dataRes = await axios.get(`${baseUrl}/data`);
        setData(dataRes.data || null);
      }
    })();
  }, []);
  if (!shouldRender) return (<div className="posts">You've been blocked and need to be further verified.</div>)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {
          data ? (
            <div className="posts">
              {
                data?.data?.map((item, idx) => (<div key={idx}>
                  <h4 style={{ paddingBottom: 0, marginBottom: 0 }}>{item?.title}</h4>
                  <p style={{ paddingTop: 0, marginTop: 0 }}>{item?.body}</p>
                </div>))
              }
            </div>
          ) : (<p>Loading...</p>)
        }
      </header>
    </div>
  );
}

export default App;
