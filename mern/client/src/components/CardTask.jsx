/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Card, Navbar, Button, Container,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';

const variant = {
  pendente: 'warning',
  andamento: 'danger',
  pronto: 'success',
};

function CardTask({ task }) {
  const [state, setState] = useState(task);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setState(task);
  }, [task]);

  const uperCase = (text) => text.split('')
    .reduce((acc, el) => (acc.length === 1 ? acc.toUpperCase() + el : acc + el));

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

  const updateTask = () => {
    setUpdate(false);
  };

  return (
    <div>
      <Card
        bg={variant[state.status]}
        style={{ width: '18rem' }}
        className="mb-2"
      >
        <Card.Header>
          <Navbar>
            <Container>
              <Navbar.Brand>
                {!update
                  ? uperCase(state.status)
                  : (
                    <select onChange={updateTask}>
                      <option value="pendente">Pendente</option>
                      <option value="andamento">Andamento</option>
                      <option value="pronto">Pronto</option>
                    </select>
                  )}
              </Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                { !update
                  && (
                  <Button variant="outline-light" onClick={() => setUpdate(true)}>
                    <FiEdit size="1.4em" color="black" />
                  </Button>
                  )}
                <Button variant="outline-light" style={{ marginLeft: '5px' }}>
                  <RiDeleteBin5Line size="1.4em" color="black" />
                </Button>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Card.Header>
        <Card.Body>
          <Card.Title>
            {uperCase(state.task)}
          </Card.Title>
          <Card.Text>
            {uperCase(state.name)}
            <div>
              {`Criado: ${formatDate(state.create)}`}
            </div>
            { state.status === 'andamento'
              ? (
                <div>
                  {`Iniciado: ${formatDate(state.update)}`}
                </div>
              )
              : state.status === 'pronto'
                && (
                <div>
                  {`Finalizado: ${formatDate(state.update)}`}
                </div>
                )}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CardTask;
