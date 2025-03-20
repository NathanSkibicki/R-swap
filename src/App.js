import React, { useState } from 'react';
import { writeStringToFirestore } from './firebase';

function App() {
  const [inputString, setInputString] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputString.trim()) return;

    setIsLoading(true);
    setStatus('Writing to Firestore...');

    try {
      const docId = await writeStringToFirestore(inputString);
      setStatus(`Successfully wrote to Firestore! Document ID: ${docId}`);
      setInputString('');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Firestore Write Test</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="string-input" style={{ display: 'block', marginBottom: '5px' }}>
            Enter a resume point using Latex:
          </label>
          <input
            id="string-input"
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading || !inputString.trim()}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#4285F4', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: isLoading || !inputString.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Writing...' : 'Write to Firestore'}
        </button>
      </form>
      
      {status && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: status.includes('Error') ? '#FFEBEE' : '#E8F5E9',
          border: `1px solid ${status.includes('Error') ? '#FFCDD2' : '#C8E6C9'}`,
          borderRadius: '4px'
        }}>
          {status}
        </div>
      )}
    </div>
  );
}

export default App;