/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';
import NewTask from '../services/NewTask';
import GetAllTasks from '../services/GetAllTasks';

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

function InsertTask({ token, updateAllTasks, setGetAllTasksInitial }) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [task, setTask] = useState('');
  const [check, setCheck] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const inserNewTask = async () => {
    await NewTask(token, { task, private: check });
    const response = await GetAllTasks(token);
    updateAllTasks(response);
    setGetAllTasksInitial(response);
  };

  return (
    <div>
      <Button onClick={openModal} type="button">Nova Taks</Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>
              <h2>Insira uma nova Taks</h2>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter task"
              autoComplete="off"
              value={task}
              onChange={({ target }) => setTask(target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Privado" value={check} onClick={() => setCheck(!check)} />
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
    </div>
  );
}

InsertTask.propTypes = {
  token: PropTypes.string,
}.isRequired;

export default InsertTask;
