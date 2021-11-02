import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from 'react-router-dom';
import login from '../services/Login';
import './css/Login.css';

function Login() {
  const [validated, setValidated] = useState(false);
  const [user, setUser] = useState({ email: '', password: '' });
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

  return (
    <div>
      <Form noValidate validated={validated}>
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
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Manter Logado" />
        </Form.Group>
        <Button variant="primary" type="button" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Login;
