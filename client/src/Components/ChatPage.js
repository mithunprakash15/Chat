import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Paper } from '@material-ui/core';

const socket = io('http://localhost:3001');

function ChatPage() {
  const { username } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    if (loggedIn) {
      socket.emit('login', username);
      console.log('Socket connected:', socket.connected);
      fetchUsers();
      socket.on('new user', (newUser) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
      });
      socket.on('old messages', (oldMessages) => {
        setMessages(oldMessages);
      });
      socket.on('private message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
      return () => socket.disconnect();
    }
  }, [loggedIn, username]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      const userList = response.data;
      setUsers(userList.filter((user) => user.username !== username));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = () => {
    socket.emit('logout');
    setLoggedIn(false);
  };

  const handleSendMessage = () => {
    if (loggedIn) {
      socket.emit('private message', { to: selectedUser, message: messageInput });
   
      setMessageInput('');
    } else {
      console.log('User not logged in');
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  
    socket.emit('get old messages', { from: username, to: user });
    
    const userMessages = messages.filter(
      (msg) =>
        (msg.from === user && msg.to === username) || (msg.from === username && msg.to === user)
    );
    setMessages(userMessages);
  
    socket.emit('private message', { to: user, message: `Hello ${user}!` });
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '30%', padding: '10px', borderRight: '1px solid #ccc' }}>
        <h3>Users</h3>
        <ul>
          {users.map((user) => (
        <div key={user.username} onClick={() => handleUserClick(user.username)}>
        {user.username}
      </div>
          ))}
        </ul>
      </div>
      <div style={{ flex: '1', padding: '10px' }}>
        <div style={{ textAlign: 'right', padding: '10px' }}>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <h3>Chat History</h3>
        <Paper elevation={3} style={{ padding: '10px', maxHeight: '300px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ textAlign: msg.from === username ? 'right' : 'left' }}>
              <strong>{msg.from}: </strong>{msg.message}
            </div>
          ))}
        </Paper>
        <TextField
          type="text"
          variant="outlined"
          label="Type a message"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          style={{ marginTop: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginTop: '10px' }}>
          Send
        </Button>
      </div>
    </div>
  );
}

export default ChatPage;
