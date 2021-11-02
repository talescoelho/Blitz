import React, { useEffect, useState } from 'react';
import { useJwt } from 'react-jwt';
import { Redirect } from 'react-router-dom';
import { Container, Navbar, Button } from 'react-bootstrap';
import verifyToken from '../services/VerifyToken';
import GetAllTasks from '../services/GetAllTasks';
import LogOut from '../services/LogOut';
import CardTask from '../components/CardTask';

function Home() {
  const [logged, setLogged] = useState(true);
  const [allTasks, setGetAllTasks] = useState(null);
  const token = verifyToken();
  useEffect(async () => {
    const tasks = await GetAllTasks(token);
    setGetAllTasks(tasks);
  }, []);

  // console.log(allTasks);

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
      { allTasks
        ? allTasks.map((task) => <CardTask task={task} />)
        : <p>Loading..</p> }
    </div>
  );
}

export default Home;
