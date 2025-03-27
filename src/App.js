import React, { useState, useEffect} from 'react';
import { writeStringToFirestore, getAllStringsFromFirestore, deleteMultipleFromFirestore } from './firebase';
import Switch from '@mui/material/Switch'
import { Grid2 } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

function App() {
  const [inputString, setInputString] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [strings, setStrings] = useState([]);
  const [isLoadingStrings, setIsLoadingStrings] = useState(false);
  const [category, setCategory] = useState('Project')
  const [selectedStrings, setSelectedStrings] = useState([]);
  
  useEffect(() => {
    const fetchStrings = async ()=>{
      setIsLoadingStrings(true)
      try{
        const allStrings = await getAllStringsFromFirestore()
        setStrings(allStrings)
      }
      catch(error){
        console.error("Err fetching Str")
        setStatus('err getting strings')
      }
      finally{
        setIsLoading(false)
      }
    }
    fetchStrings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputString.trim()) return;

    setIsLoading(true);
    setStatus('Writing to Firestore...');

    try {
      const docId = await writeStringToFirestore(inputString, category);
      setStatus(`Successfully wrote to Firestore! Document ID: ${docId}`);
      setInputString('');

      const updateStrings = await getAllStringsFromFirestore();
      setStrings(updateStrings)
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) =>{
    category === 'Project' ? setCategory('Experience') : setCategory('Project')
    console.log(category)
  }

  const handleCheckboxChange = (stringId) => {
    setSelectedStrings(prev => 
      prev.includes(stringId) 
        ? prev.filter(id => id !== stringId) 
        : [...prev, stringId]
    );
  }

  const handleDeleteSelected = async () => {
    if (selectedStrings.length === 0) {
      setStatus('No strings selected for deletion');
      return;
    }

    setIsLoading(true);
    setStatus('Deleting selected strings...');

    try {
      await deleteMultipleFromFirestore(selectedStrings);
      
      // Refresh the strings list
      const updatedStrings = await getAllStringsFromFirestore();
      setStrings(updatedStrings);
      
      // Clear selected strings
      setSelectedStrings([]);
      
      setStatus(`Successfully deleted ${selectedStrings.length} string(s)`);
    } catch (error) {
      setStatus(`Error deleting strings: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="App" style={{ padding: '5px', maxWidth: '1000px', margin: '0 auto' }}>
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
      <div style={{marginTop:'10px'}}>
        <h4>{category}</h4>
        <Switch category={category} onChange={handleChange}/>
      </div>
      
      <div>
        {strings.length > 0 && (
          <div>
            <Grid2 container spacing={2} alignItems="center">
              <Grid2 xs={8}>
                <h4>Current Resume Points</h4>
              </Grid2>
              <Grid2 xs={4}>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={handleDeleteSelected}
                  disabled={selectedStrings.length === 0}
                >
                  Delete Selected
                </Button>
              </Grid2>
            </Grid2>
            
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
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Checkbox 
                    checked={selectedStrings.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  <div style={{flex: 1}}>
                    <p style={{ margin: '0 0 5px 0' }}><strong>Text:</strong> {item.text}</p>
                    <p style={{ margin: '0', fontSize: '0.8em', color: '#757575' }}>
                      <strong>Category:</strong> {item.category || 'N/A'} | 
                      <strong> ID:</strong> {item.id} | 
                      <strong> Timestamp:</strong> {item.timestamp?.toDate?.().toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;