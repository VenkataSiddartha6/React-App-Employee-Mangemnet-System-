
import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Link } from 'react-router-dom';
import './Home.css';

class Home extends Component {
  render() {
    return (
      <Container>
        <h1>Home</h1>
        <p className="top-right">
         <Link to="/login">Login</Link> | <Link to="/Signup">Signup</Link>
      </p>
      </Container>
    );
  }
}

export default Home;