import React, { useEffect, useState } from 'react';
import { useJwt } from 'react-jwt';
import { Redirect } from 'react-router-dom';
import { Container, Navbar, Button } from 'react-bootstrap';
import verifyToken from '../services/VerifyToken';
import GetAllTasks from '../services/GetAllTasks';
import LogOut from '../services/LogOut';
import CardTask from '../components/CardTask';
import './css/Home.css';
import InsertTask from '../components/InsertTask';

function Home() {
  const [logged, setLogged] = useState(true);
  const [allTasks, setGetAllTasks] = useState(null);
  const [allTasksInitial, setGetAllTasksInitial] = useState(null);
  const [sorted, setSorted] = useState(false);
  const token = verifyToken();
  useEffect(async () => {
    const tasks = await GetAllTasks(token);
    setGetAllTasks(tasks);
    setGetAllTasksInitial(tasks);
  }, []);

  const { decodedToken } = useJwt(token);

  if (token && !decodedToken) {
    return <div>Loading...</div>;
  }

  const handleClick = async () => {
    setLogged(false);
    LogOut();
  };

  if (!token || !logged) {
    return <Redirect to="/" />;
  }

  const id = '_id';

  const updateAllTasks = (responseTasks) => {
    setGetAllTasks(responseTasks);
    setGetAllTasksInitial(responseTasks);
  };

  const sortFields = (index) => {
    setGetAllTasks([...allTasks.sort((a, b) => {
      if (sorted) {
        if (a[index] < b[index]) {
          return -1;
        }
        if (a[index] > b[index]) {
          return 1;
        }
        return 0;
      }
      if (a[index] > b[index]) {
        return -1;
      }
      if (a[index] < b[index]) {
        return 1;
      }
      return 0;
    })]);
    setSorted(!sorted);
  };

  const filterByState = (stateTask) => {
    if (stateTask !== 'todos') {
      setGetAllTasks([...allTasksInitial.filter(({ status }) => status === stateTask)]);
    } else {
      setGetAllTasks([...allTasksInitial]);
    }
  };

  return (
    <div>
      <Navbar bg="light" variant="light">
        <Container>
          <img src="logo.png" alt="pageIcon" style={{ width: '120px', marginRight: '5%' }} />
          <Navbar.Brand>
            {`Bem Vindo: ${decodedToken.name}`}
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Button variant="primary" onClick={handleClick}>
              Log Out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="insert-task">
        { allTasks
          && (
          <InsertTask
            token={token}
            updateAllTasks={updateAllTasks}
            allTasks={allTasks}
            setGetAllTasksInitial={setGetAllTasksInitial}
          />
          )}
      </div>
      <div className="sort-task">
        <Button type="button" onClick={() => sortFields('status')}>
          Status
        </Button>
        <Button type="button" onClick={() => sortFields('task')}>
          Nome
        </Button>
        <Button type="button" onClick={() => sortFields('create')}>
          Data Criação
        </Button>
        <Button type="button" onClick={() => filterByState('andamento')} variant="warning">
          Andamento
        </Button>
        <Button type="button" onClick={() => filterByState('pronto')} variant="success">
          Pronto
        </Button>
        <Button type="button" onClick={() => filterByState('pendente')} variant="danger">
          Pendente
        </Button>
        <Button type="button" onClick={() => filterByState('todos')}>
          Todos
        </Button>
      </div>
      <div className="cards-container">
        { allTasks
          ? allTasks.map((task) => (
            <CardTask
              key={task[id]}
              task={task}
              updateAllTasks={updateAllTasks}
              admin={decodedToken.role === 'admin'}
            />
          ))
          : <div>Loading..</div> }
      </div>
    </div>
  );
}

export default Home;
