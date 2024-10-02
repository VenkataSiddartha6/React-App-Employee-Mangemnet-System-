import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import Signup from "./signup/Signup";
import Login from "./login/Login";
import Dashboard from "./dashboard/Dashboard";

class App extends Component {
  render() {
    return (
      <div>
        <header>Employee Management System</header>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />  {/* Home Route */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;