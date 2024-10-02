import React, { useState } from 'react';
import './Signup.module.css';
import { Link } from "react-router-dom";

const Signup = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [ submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
        ...formData, [name] : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    
    if(!formData.username.trim()) {
        validationErrors.username = "Username is required";
    }

    if(!formData.email.trim()) {
        validationErrors.email = "Email is required";
    } else if(!/\S+@\S+\.\S+/.test(formData.email)){
        validationErrors.email = "Email is not valid";
    }

    if(!formData.password.trim()) {
        validationErrors.password = "Password is required";
    } else if(formData.password.length < 6){
        validationErrors.password = "Password should be at least 6 characters";
    }

    if(formData.confirmPassword !== formData.password) {
        validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);

    if(Object.keys(validationErrors).length === 0) {
        
        const newEmployee = {
          userName: formData.username,
          emailId: formData.email,
          password: formData.password
        };

        try {
          const response = await fetch('http://localhost:8087/employee/addEmployee', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmployee),
          });

          if (response.ok) {
            const data = await response.json();
            setSubmitted(true);
            alert('Form Submitted Successfully!');
            console.log('Employee added:', data);
          } else {
            alert('Error while submitting the form');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Error connecting to the backend');
        }
    }
  }

  return (
    <div>
      <p className='top-right'>
      <Link to="/">Home</Link>
      </p>
      <h4>Signup</h4>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          placeholder='username'  
          autoComplete='off'  
          onChange={handleChange}   
        />
        {errors.username && <span>{errors.username}</span>}  
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder='example@gmail.com'
          autoComplete='off'
          onChange={handleChange} 
        />
        {errors.email && <span>{errors.email}</span>}  
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder='******'
          onChange={handleChange} 
        />
        {errors.password && <span>{errors.password}</span>}  
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder='******'
          onChange={handleChange} 
        />
			
      </div>
      <button type="submit">Submit</button>
      <p className="mt-2">
        Already have an account? <Link to="/Login">Login</Link>
      </p> 
    </form>
    </div>
  );
};

export default Signup;