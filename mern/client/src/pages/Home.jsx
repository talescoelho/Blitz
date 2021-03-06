import React, { useEffect, useState } from 'react';
import { useJwt } from 'react-jwt';
import { Redirect } from 'react-router-dom';
import { Container, Navbar, Button } from 'react-bootstrap';
import verifyToken from '../services/VerifyToken';
import GetAllTasks from '../services/GetAllTasks';
import GetAllUsers from '../services/GetAllUsers';
import LogOut from '../services/LogOut';
import CardTask from '../components/CardTask';
import UsersCard from '../components/UsersCard';
import './css/Home.css';
import InsertTask from '../components/InsertTask';

function Home() {
  const [logged, setLogged] = useState(true);
  const [allTasks, setGetAllTasks] = useState(null);
  const [allUsers, setGetAllUsers] = useState(null);
  const [allTasksInitial, setGetAllTasksInitial] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [usersTasks, setUsersTasks] = useState(true);
  const token = verifyToken();
  useEffect(async () => {
    const tasks = await GetAllTasks(token);
    const users = await GetAllUsers(token);
    setGetAllTasks(tasks);
    setGetAllTasksInitial(tasks);
    setGetAllUsers(users);
  }, []);

  const { decodedToken } = useJwt(token);

  if (!decodedToken && allTasks) {
    localStorage.setItem('token', '');
    return <Redirect to="/" />;
  }

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

  const sortFields = (key) => {
    setGetAllTasks([...allTasks.sort((a, b) => {
      if (!sorted) return a[key].localeCompare(b[key]);
      return b[key].localeCompare(a[key]);
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

  const TasksCards = () => (
    <div>
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
          Data Cria????o
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

  const UsersCards = () => (
    <div className="cards-container">
      { allUsers && allUsers.map((user) => <UsersCard user={user} />)}
    </div>
  );

  return (
    <div>
      {
        decodedToken.role === 'admin' ? (
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
            <div className="buttons-container">
              <Button onClick={() => setUsersTasks(false)}>Users</Button>
              <Button onClick={() => setUsersTasks(true)}>Tasks</Button>
            </div>
            {
              usersTasks ? TasksCards()
                : UsersCards()
            }
          </div>
        ) : (
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
            { TasksCards() }
          </div>
        )
      }
    </div>
  );
}

export default Home;
