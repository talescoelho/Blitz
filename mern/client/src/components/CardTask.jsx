import React, { useEffect, useState } from 'react';
import {
  Card, Navbar, Button, Container, Form, Col,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { GiConfirmed } from 'react-icons/gi';
import { TiDeleteOutline } from 'react-icons/ti';
import { FcCancel } from 'react-icons/fc';
import PropTypes from 'prop-types';
import UpdateTask from '../services/UpdateTask';
import DeleteTask from '../services/DeleteTask';

const variant = {
  pendente: 'danger',
  andamento: 'warning',
  pronto: 'success',
};

function CardTask({ task, updateAllTasks }) {
  const [state, setState] = useState(task);
  const [update, setUpdate] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);

  const formatDate = (date) => {
    const dateFormat = date.split('T')[0].split('-').join('/');
    const hourFormat = date.split('T')[1].split('.')[0]
      .split(':').reduce((acc, val, index) => {
        let num = val;
        if (index === 0) {
          num = Number(val) - 3;
          if (Number(num) < 10) {
            num = `0${num}`;
          }
          return `${num}`;
        }
        return `${acc}:${num}`;
      }, '');
    return `${dateFormat}, ${hourFormat}`;
  };

  const [changeTask, setChangeTask] = useState({
    task: state.task,
    status: state.status,
    update: formatDate(state.update),
  });

  useEffect(() => {
    setState(task);
  }, [task]);

  const uperCase = (text) => text.split('')
    .reduce((acc, el) => (acc.length === 1 ? acc.toUpperCase() + el : acc + el));

  const handleChange = ({ target }) => {
    setChangeTask({ ...changeTask, [target.name]: target.value });
  };

  const updateTask = async () => {
    const id = '_id';
    const { status } = changeTask;
    await UpdateTask(localStorage.getItem('token'), task[id], { task: changeTask.task, status });
    setUpdate(false);
  };

  const handleDellete = async () => {
    const id = '_id';
    const response = await DeleteTask(localStorage.getItem('token'), task[id]);
    updateAllTasks(response);
  };

  return (
    <div>
      <Card
        border={variant[changeTask.status]}
        style={{ width: '18rem' }}
        className="mb-2"
      >
        <Card bg={variant[changeTask.status]}>
          <Navbar>
            <Container>
              <Navbar.Brand>
                {!update
                  ? uperCase(changeTask.status)
                  : (
                    <select name="status" onChange={handleChange}>
                      <option>Status</option>
                      <option value="pendente">Pendente</option>
                      <option value="andamento">Andamento</option>
                      <option value="pronto">Pronto</option>
                    </select>
                  )}
              </Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                { (!update && !deleteTask)
                  && (
                    <>
                      <Button variant="outline-light" onClick={() => setUpdate(true)}>
                        <FiEdit size="1.4em" color="black" />
                      </Button>
                      <Button variant="outline-light" style={{ marginLeft: '5px' }} onClick={() => setDeleteTask(true)}>
                        <RiDeleteBin5Line size="1.4em" color="black" />
                      </Button>
                    </>
                  )}
                { update && (
                  <>
                    <Button variant="outline-light" onClick={updateTask}>
                      <GiConfirmed size="1.4em" color="black" />
                    </Button>
                    <Button variant="outline-light" style={{ marginLeft: '5px' }} onClick={() => setUpdate(false)}>
                      <FcCancel size="1.4em" color="black" />
                    </Button>
                  </>
                )}
                { deleteTask && (
                  <>
                    <Button variant="outline-light" style={{ marginLeft: '5px' }} onClick={handleDellete}>
                      <TiDeleteOutline size="1.4em" color="black" />
                    </Button>
                    <Button variant="outline-light" style={{ marginLeft: '5px' }} onClick={() => setDeleteTask(false)}>
                      <FcCancel size="1.4em" color="black" />
                    </Button>
                  </>
                )}
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Card>
        <Card.Body>
          <Card.Title>
            {!update ? uperCase(changeTask.task)
              : (
                <>
                  <Col sm="10">
                    <Form.Control
                      type="text"
                      name="task"
                      placeholder={uperCase(state.task)}
                      value={changeTask.task}
                      onChange={handleChange}
                    />
                  </Col>
                </>
              )}
          </Card.Title>
          <Card.Text>
            {uperCase(state.name)}
            <br />
            {`Criado: ${formatDate(state.create)}`}
            <br />
            { changeTask.status === 'andamento'
              ? (
                `Iniciado: ${changeTask.update}\n`
              )
              : changeTask.status === 'pronto'
                && (
                  `Finalizado: ${changeTask.update}`
                )}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

CardTask.propTypes = {
  task: PropTypes.objectOf(),
}.isRequired;

export default CardTask;
