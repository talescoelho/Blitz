/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';
import NewUser from '../services/NewUser';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement');

function InsertNewUser({ token }) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [task, setTask] = useState({
    name: '', email: '', password: '', area: '',
  });

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const inserNewTask = async () => {
    await NewUser(token, task);
  };

  return (
    <>
      <Button onClick={openModal} type="button" style={{ width: '100%', marginTop: '10px' }}>Registrar</Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>
              <h2>Nome</h2>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter Name"
              autoComplete="off"
              value={task.name}
              onChange={({ target }) => setTask({ ...task, [target.name]: target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>
              <h2>Email</h2>
            </Form.Label>
            <Form.Control
              type="text"
              name="email"
              placeholder="Enter Email"
              autoComplete="off"
              value={task.email}
              onChange={({ target }) => setTask({ ...task, [target.name]: target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>
              <h2>Password</h2>
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter Password"
              autoComplete="off"
              value={task.password}
              onChange={({ target }) => setTask({ ...task, [target.name]: target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>
              <h2>Area</h2>
            </Form.Label>
            <Form.Select
              type="text"
              name="area"
              onChange={({ target }) => setTask({ ...task, [target.name]: target.value })}
            >
              <option value="ti">TI</option>
              <option value="rh">RH</option>
              <option value="adm">ADM</option>
            </Form.Select>
          </Form.Group>

          <Button
            variant="primary"
            type="button"
            style={{ width: '100%' }}
            onClick={() => {
              inserNewTask();
              closeModal();
            }}
          >
            Submit
          </Button>
        </Form>
      </Modal>
    </>
  );
}

InsertNewUser.propTypes = {
  token: PropTypes.string,
}.isRequired;

export default InsertNewUser;
