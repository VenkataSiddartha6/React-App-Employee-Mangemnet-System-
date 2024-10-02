import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from "react-router-dom";  
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const navigate = useNavigate();  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    // Frontend validation
    if (!formData.username.trim()) {
      validationErrors.username = "Username is required";
    }
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password should be at least 6 characters";
    }

    setErrors(validationErrors);

   
    if (Object.keys(validationErrors).length === 0) {
      try {
        
        const response = await axios.get(`http://localhost:8087/employee/${formData.username}/${formData.password}`);

        if (response.data) {
          alert('Login successful!');
          console.log('Employee:', response.data);
          navigate('/dashboard');  
        } else {
          setBackendError('Invalid credentials. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        setBackendError('Error connecting to the backend.');
      }
    }
  };

  return (
    <div>
      <p className='top-right'>
      <Link to="/">Home</Link>
      </p>
      <h4>Login</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="off"
            onChange={handleChange}
          />
          {errors.username && <span>{errors.username}</span>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="******"
            onChange={handleChange}
          />
          {errors.password && <span>{errors.password}</span>}
        </div>

        {backendError && <div className="error">{backendError}</div>} {/* Backend error display */}

        <button type="submit">Submit</button>
        <p className="mt-2">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
