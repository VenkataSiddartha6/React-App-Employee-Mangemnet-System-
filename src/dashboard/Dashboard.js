import React, { useState, useEffect } from 'react';
import './Dashboard.css'; 
import axios from 'axios';
import { Link, redirect } from 'react-router-dom';


const Dashboard = () => {
    var [activeSection, setActiveSection] = useState('showEmployee');
    const [employeeData, setEmployeeData] = useState([]);
    const [error, setError] = useState(null);
     const [editingEmployee, setEditingEmployee] = useState(null);
     const [isEditable, setIsEditable] = useState(false);

    const fetchEmployeeData = async () => {
      try {
          const response = await axios.get('http://localhost:8087/showAllEmployeeDetails');
          setEmployeeData(response.data); 
      }catch (error) {
        console.error('Error fetching employee data:', error);
        setError('Failed to load employee data.');
    }
};

  
  const [formData, setFormData] = useState({
      employeeId: '',
      employeeName: '',
      employeeDesignation: '',
      employeeEmail: '',
      employeeContact: '',
      employeeSalary: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, [name]: value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!formData.employeeId.trim()) {
        validationErrors.employeeId = "Employee-Id is required";
    }
    if (!formData.employeeName.trim()) {
        validationErrors.employeeName = "Employee-Name is required";
    }
    if (!formData.employeeDesignation.trim()) {
        validationErrors.employeeDesignation = "Employee-Designation is required";
    }
    if (!formData.employeeEmail.trim()) {
        validationErrors.employeeEmail = "Employee-Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.employeeEmail)) {
        validationErrors.employeeEmail = "Email is not valid";
    }
    if (!formData.employeeContact.trim()) {
        validationErrors.employeeContact = "Employee-Contact is required";
    } else if (formData.employeeContact.length !== 10) {
        validationErrors.employeeContact = "Employee-contact should be exactly 10 digits";
    }
    if (!formData.employeeSalary.trim()) {
        validationErrors.employeeSalary = "Employee-Salary is required";
    }

    
    setErrors(validationErrors);


    if (Object.keys(validationErrors).length === 0) {
        // Your submit logic here (e.g., API call)
      
          const response = await axios.post('http://localhost:8087/employeeDetails/addEmployeeDetails', formData);

          if (response) {
            const data = await response.data;
            setSubmitted(true);
            alert('Form Submitted Successfully!');
            console.log('Employee added:', data);
            activeSection = 'showEmployee';          
          return  redirect("/dashboard");
           } else {
            alert('Error while submitting the form');
          }
  
}
};



const handleDelete = async (e) => {
  e.preventDefault();
  if (!formData.employeeId.trim()) {
      setErrors({ employeeId: 'Employee-Id is required' });
      return;
  }

  try {
      const response = await axios.delete(`http://localhost:8087/remove/${formData.employeeId}`);
      console.log(response);
      if (response.data === 'deleted') {
          alert('Employee deleted successfully!');
          fetchEmployeeData();  
      } else {
          alert('Error while deleting employee');
      }
  } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error connecting to the backend');
  }
};



const handleGetDetails = async () => {
    if (!formData.employeeId.trim()) {
        setErrors({ employeeId: 'Employee ID is required' });
        return;
    }

    try {
        const response = await axios.get(`http://localhost:8087/search/${formData.employeeId}`);
        const employee = response.data;

        if (employee) {
            setFormData({
                employeeId: employee.employeeId,
                employeeName: employee.employeeName,
                employeeDesignation: employee.employeeDesignation,
                employeeEmail: employee.employeeEmail,
                employeeContact: employee.employeeContact,
                employeeSalary: employee.employeeSalary,
            });
            setIsEditable(true);
            setErrors({});
        } else {
            setErrors({ employeeId: 'No employee found with this ID' });
            setIsEditable(false); 
            setFormData({
                employeeId: formData.employeeId,
                employeeName: '',
                employeeDesignation: '',
                employeeEmail: '',
                employeeContact: '',
                employeeSalary: '',
            });
        }
    } catch (error) {
        console.error('Error fetching employee data:', error);
        setErrors({ employeeId: 'Error fetching employee details' });
        setIsEditable(false); 
    }
};

const handleUpdate = async (e) => {
    e.preventDefault();
  
    const validationErrors = {};
  
    
    if (!formData.employeeId) {
      validationErrors.employeeId = "Employee-Id is required";
    }
  
    
    if (!formData.employeeName.trim()) {
      validationErrors.employeeName = "Employee-Name is required";
    }
  
    
    if (!formData.employeeDesignation.trim()) {
      validationErrors.employeeDesignation = "Employee-Designation is required";
    }
  

    if (!formData.employeeEmail.trim()) {
      validationErrors.employeeEmail = "Employee-Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.employeeEmail)) {
      validationErrors.employeeEmail = "Email is not valid";
    }
  

    if (!formData.employeeContact) {
      validationErrors.employeeContact = "Employee-Contact is required";
    } else if (formData.employeeContact.toString().length !== 10) {
      validationErrors.employeeContact = "Employee-contact should be exactly 10 digits";
    }
  
    
    if (!formData.employeeSalary) {
      validationErrors.employeeSalary = "Employee-Salary is required";
    }
  
    setErrors(validationErrors);
  
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.put('http://localhost:8087/update', formData);
  
        if (response.status === 200) {
          alert('Employee updated successfully!');
        } else {
          alert('Error while updating employee');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to the backend');
      }
    }
  };

    

    const renderContent = () => {
      
        switch (activeSection) {
            case 'showEmployee':
                return (<div>
                  <p className='top-right'>
                  <Link to="/">Sign-Out</Link>
                  </p>
                  <table className="employee-table">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Employee Designation</th>
                        <th>Employee Email</th>
                        <th>Employee Contact</th>
                        <th>Employee Salary</th>
                    </tr>
                </thead>
                <tbody>
                 {employeeData.length > 0 ? (
                                    employeeData.map(employee => (
                                        <tr key={employee.employeeId}>
                                            <td>{employee.employeeId}</td>
                                            <td>{employee.employeeName}</td>
                                            <td>{employee.employeeDesignation}</td>
                                            <td>{employee.employeeEmail}</td>
                                            <td>{employee.employeeContact}</td>
                                            <td>{employee.employeeSalary}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No employees found.</td>
                                    </tr>
                                )}
                </tbody>
                </table>
                </div>);
            case 'addEmployee':
                return <div>
                  <p className='top-right'>
                  <Link to="/">Sign-Out</Link>
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label>Employee-Id:</label>
                      <input type='number' name='employeeId' placeholder='EmployeeID' onChange={handleChange}/>
                      {errors.employeeId && <span>{errors.employeeId}</span>}
                    </div>
                    <div>
                      <label>Employee-Name:</label>
                      <input type='text' name='employeeName' placeholder='EmployeeName' onChange={handleChange}/>
                      {errors.employeeName && <span>{errors.employeeName}</span>}
                    </div>
                    <div>
                      <label>Employee-Designation:</label>
                      <input type='text' name='employeeDesignation' placeholder='EmployeeDesignation' onChange={handleChange}/>
                      {errors.employeeDesignation && <span>{errors.employeeDesignation}</span>}
                    </div>
                    <div>
                      <label>Employee-Email:</label>
                      <input type='email' name='employeeEmail' placeholder='EmployeeEmail' onChange={handleChange}/>
                      {errors.employeeEmail && <span>{errors.employeeEmail}</span>}
                    </div>
                    <div>
                      <label>Employee-Conatct:</label>
                      <input type='number' name='employeeContact' placeholder='EmployeeConatct' onChange={handleChange}/>
                      {errors.employeeConatct && <span>{errors.employeeConatct}</span>}
                    </div>
                    <div>
                      <label>Employee-Salary:</label>
                      <input type='number' name='employeeSalary' placeholder='EmployeeSalary' onChange={handleChange}/>
                      {errors.employeeSalary && <span>{errors.employeeSalary}</span>}
                    </div>
                    <button>Add-Employee</button>
                  </form>
                </div>;
            case 'deleteEmployee':
                return (
                    <div>
                      <p className='top-right'>
                      <Link to="/">Sign-Out</Link>
                      </p>
                        <form onSubmit={handleDelete}>
                            <div>
                                <label>Employee-Id:</label>
                                <input type='number' name='employeeId' placeholder='EmployeeID' onChange={handleChange} />
                                {errors.employeeId && <span>{errors.employeeId}</span>}
                            </div>
                            <button>Delete Employee</button>
                        </form>
                    </div>
                );
                case 'editEmployee':
                return (
                    <div>
                        <p className='top-right'>
                            <Link to="/">Sign-Out</Link>
                        </p>
                        <h2>Edit Employee</h2>
                        <form onSubmit={handleUpdate}>
                            <div>
                                <label>Employee-Id:</label>
                                <input
                                    type='number'
                                    name='employeeId'
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                />
                                <button type="button" onClick={handleGetDetails}>
                                    Get Details
                                </button>
                                {errors.employeeId && <span>{errors.employeeId}</span>}
                            </div>
                            <div>
                                <label>Employee-Name:</label>
                                <input
                                    type='text'
                                    name='employeeName'
                                    value={formData.employeeName}
                                    onChange={handleChange}
                                    disabled={!isEditable} // Disable if isEditable is false
                                />
                                {errors.employeeName && <span>{errors.employeeName}</span>}
                            </div>
                            <div>
                                <label>Employee-Designation:</label>
                                <input
                                    type='text'
                                    name='employeeDesignation'
                                    value={formData.employeeDesignation}
                                    onChange={handleChange}
                                    disabled={!isEditable} // Disable if isEditable is false
                                />
                                {errors.employeeDesignation && <span>{errors.employeeDesignation}</span>}
                            </div>
                            <div>
                                <label>Employee-Email:</label>
                                <input
                                    type='email'
                                    name='employeeEmail'
                                    value={formData.employeeEmail}
                                    onChange={handleChange}
                                    disabled={!isEditable} // Disable if isEditable is false
                                />
                                {errors.employeeEmail && <span>{errors.employeeEmail}</span>}
                            </div>
                            <div>
                                <label>Employee-Contact:</label>
                                <input
                                    type='number'
                                    name='employeeContact'
                                    value={formData.employeeContact}
                                    onChange={handleChange}
                                    disabled={!isEditable} // Disable if isEditable is false
                                />
                                {errors.employeeContact && <span>{errors.employeeContact}</span>}
                            </div>
                            <div>
                                <label>Employee-Salary:</label>
                                <input
                                    type='number'
                                    name='employeeSalary'
                                    value={formData.employeeSalary}
                                    onChange={handleChange}
                                    disabled={!isEditable} // Disable if isEditable is false
                                />
                                {errors.employeeSalary && <span>{errors.employeeSalary}</span>}
                            </div>
                            <button type="submit" disabled={!isEditable}>
                                Update Employee
                            </button>
                        </form>
                    </div>
                );
            default:
                return <div><h2>Welcome to the Dashboard</h2></div>;
        }
    };
    useEffect(() => {
      if (activeSection === 'showEmployee') {
          fetchEmployeeData();
      }
  }, [activeSection]);


    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Dashboard</h2>
                <ul>
                    <li onClick={() => setActiveSection('showEmployee')}>Show Employee</li>
                    <li onClick={() => {setActiveSection('addEmployee'); setErrors({})}}>Add Employee</li>
                    <li onClick={() => {setActiveSection('deleteEmployee'); setErrors({})}}>Delete Employee</li>
                    <li onClick={() => {setActiveSection('editEmployee'); setErrors({})}}>Edit Employee</li>
                </ul>
            </div>
            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Dashboard;