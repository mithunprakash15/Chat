import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { username, password });
      const userData = response.data;
      console.log("hi",userData);

      if (userData.status === 'success') {
        navigate(`/chat/${username}`);
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px' }}>
        <h2 style={{marginLeft:"80px" , marginBottom:"30px"}}>Login</h2>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <div style={{ fontSize: '14px', textAlign: 'right', marginBottom:'20px' }}>
              Not a user? <Link to="/register" style={{ textDecoration: 'none' }}>Register here</Link>
            </div>
          <Button variant="contained" onClick={handleLogin} style={{  color: 'white', fontSize: '12px', padding: '8px 16px' }}
            >
            Login
          </Button>
          
        </form>
      </Paper>
    </div>
  );
};

export default Login;
