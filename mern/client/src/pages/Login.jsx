/* eslint-disable no-alert */
import React, { useState } from 'react';
import { Form, Button, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from 'react-router-dom';
import login from '../services/Login';
import verifyToken from '../services/VerifyToken';
import './css/Login.css';

function Login() {
  const [validated, setValidated] = useState(false);
  const [user, setUser] = useState({ email: 'user@email.com', password: '123456' });
  const [loggedUser, setLoggedUser] = useState(false);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    const logged = await login(user);
    if (logged.message) {
      alert('usuário ou senha não conferem');
      return setLoggedUser(false);
    }
    return setLoggedUser(true);
  };

  const handleChange = ({ target }) => {
    setUser({ ...user, [target.name]: target.value });
  };

  if (loggedUser) {
    return <Redirect to="/home" />;
  }

  const token = verifyToken();
  if (token) {
    return <Redirect to="/home" />;
  }

  return (
    <div className="main-items">
      <Form noValidate validated={validated}>
        <Row className="justify-content-center">
          <img src="logo.png" alt="pageIcon" style={{ width: '50%' }} />
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
            />
            <Button variant="primary" type="button" onClick={handleSubmit} style={{ width: '100%', marginTop: '10px' }}>
              Submit
            </Button>
          </Form.Group>
        </Row>
      </Form>
    </div>
  );
}

export default Login;
