import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { GiConfirmed } from 'react-icons/gi';
import { TiCancelOutline } from 'react-icons/ti';
import {
  Card, ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function UsersCard({
  user: {
    name, email, area, role,
  },
}) {
  const [state, setState] = useState(false);
  const [user, setUser] = useState({ area, role });
  const [changeUser, setChangeUser] = useState({ area, role });

  return (
    <div className="card-item card-spaces">
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{name}</Card.Title>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem>{`Email: ${email}`}</ListGroupItem>
          <ListGroupItem>
            {'Area: '}
            {!state ? user.area : (
              <select
                onChange={({ target }) => setChangeUser({ ...changeUser, area: target.value })}
              >
                <option> </option>
                <option value="ti">TI</option>
                <option value="rh">RH</option>
                <option value="adm">ADM</option>
              </select>
            )}
          </ListGroupItem>
          <ListGroupItem>
            {'Role: '}
            {!state ? user.role : (
              <select
                onChange={({ target }) => setChangeUser({ ...changeUser, role: target.value })}
              >
                <option> </option>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            )}
          </ListGroupItem>
        </ListGroup>
        <Card.Body>
          {
            !state
              ? <Button type="button" onClick={() => setState(true)}>Edit User</Button>
              : (
                <>
                  <Button
                    variant="outline-light"
                    onClick={() => {
                      setUser({ ...changeUser });
                      setState(false);
                    }}
                  >
                    <GiConfirmed size="1.4em" color="black" />
                  </Button>
                  <Button variant="outline-light" style={{ marginLeft: '5px' }} onClick={() => setState(false)}>
                    <TiCancelOutline size="1.5em" color="black" />
                  </Button>
                </>
              )
          }
        </Card.Body>
      </Card>
    </div>
  );
}

UsersCard.propTypes = {
  area: PropTypes.string,
  email: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
}.isRequired;

export default UsersCard;
