import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/register', { email, username, password });
      const userData = response.data;

      if (userData.status === 'success') {
        navigate('/');
      } else {
        console.log('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px' }}>
        <h2 style={{marginLeft:"65px" , marginBottom:"30px"}}>Register</h2>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={handleRegister}
              style={{ color: 'white', fontSize: '12px', padding: '8px 12px', width: '100%' }}
            >
              Register
            </Button>
            <div style={{ fontSize: '14px', marginTop: '10px', textAlign: 'center' }}>
              Already have an account? <Link to="/" style={{ textDecoration: 'none' }}>Login here</Link>
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Register;
