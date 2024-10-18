// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';


const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Dashboard</h2>
            <ul>
                <li>
                    <Link to="/show-employee">Show Employee</Link>
                </li>
                <li>
                    <Link to="/add-employee">Add Employee</Link>
                </li>
                <li>
                    <Link to="/delete-employee">Delete Employee</Link>
                </li>
                <li>
                    <Link to="/edit-employee">Edit Employee</Link>
                </li>
            </ul>

            
        </div>
        
    );
};

export default Sidebar;
