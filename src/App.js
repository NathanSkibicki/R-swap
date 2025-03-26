import React, { useState } from 'react';
import { writeStringToFirestore, getAllStringsFromFirestore } from './firebase';
import Switch from '@mui/material/Switch'

function App() {
  const [inputString, setInputString] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [strings, setStrings] = useState([]);
  const [isLoadingStrings, setIsLoadingStrings] = useState(false);
  const [category, setCategory] = useState('Project')
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputString.trim()) return;

    setIsLoading(true);
    setStatus('Writing to Firestore...');

    try {
      const docId = await writeStringToFirestore(inputString, category);
      setStatus(`Successfully wrote to Firestore! Document ID: ${docId}`);
      setInputString('');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async(e) => {
    e.preventDefault();
    console.log("u clicked");
    
    setIsLoadingStrings(true);
    
    try {
      const allStrings = await getAllStringsFromFirestore();
      setStrings(allStrings);
      console.log("Retrieved strings:", allStrings);
    } catch (error) {
      console.error("Error retrieving strings:", error);
      setStatus(`Error retrieving strings: ${error.message}`);
    } finally {
      setIsLoadingStrings(false);
    }
  };

  const handleChange = (event) =>{
    category === 'Project' ? setCategory('Experience') : setCategory('Project')
    console.log(category)
  }

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Enter Resume Point</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="string-input" style={{ display: 'block', marginBottom: '5px' }}>
            Enter Resume Point:
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
            cursor: isLoading || !inputString.trim() ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isLoading ? 'Writing...' : 'Publish'}
        </button>
        
        <button 
          onClick={handleClick}
          disabled={isLoadingStrings}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#34A853', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: isLoadingStrings ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoadingStrings ? 'Loading...' : 'Show All Resume Points'}
        </button>
      </form>
      
      {status && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: status.includes('Error') ? '#FFEBEE' : '#E8F5E9',
          border: `1px solid ${status.includes('Error') ? '#FFCDD2' : '#C8E6C9'}`,
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {status}
        </div>
      )}
      
      {strings.length > 0 && (
        <div>
          <h2>Stored Strings</h2>
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto', 
            border: '1px solid #E0E0E0', 
            borderRadius: '4px',
            padding: '10px'
          }}>
            {strings.map((item) => (
              <div key={item.id} style={{ 
                padding: '10px', 
                borderBottom: '1px solid #E0E0E0',
                marginBottom: '10px'
              }}>
                <p style={{ margin: '0 0 5px 0' }}><strong>Text:</strong> {item.text}</p>
                <p style={{ margin: '0', fontSize: '0.8em', color: '#757575' }}>
                  <strong>Category:</strong> {item.category || 'N/A'} | 
                  <strong> ID:</strong> {item.id} | 
                  <strong> Timestamp:</strong> {item.timestamp?.toDate?.().toLocaleString() || 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <h1>{category}</h1>
        <Switch category={category} onChange={handleChange}/>
      </div>
       
    </div>
  );
}

export default App;