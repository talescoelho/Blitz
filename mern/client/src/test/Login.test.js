/* eslint-disable */
// App.test.js
import React from 'react';
import App from '../App';
import Home from '../pages/Home';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import { LocalStorageMock } from '@react-mock/localstorage';

const server = setupServer(
  rest.get('/tasks', (req, res, ctx) => {
    return res(ctx.json(
      [{
        "_id": "6182a8c2253f77b9bc8075c7",
        "task": "RH task 1",
        "private": false,
        "userId": "6182a8b1253f77b9bc8075c6",
        "area": "rh",
        "status": "pronto",
        "create": "2021-11-03T15:20:34.287Z",
        "update": "2021-11-03T17:29:23.845Z"
    },
    {
        "_id": "6182a8cb253f77b9bc8075c9",
        "task": "RH task 3",
        "private": false,
        "userId": "6182a8b1253f77b9bc8075c6",
        "area": "rh",
        "status": "andamento",
        "create": "2021-11-03T15:20:43.664Z",
        "update": "2021-11-03T17:29:17.677Z"
    }]
    ))
  }),
  )
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmgiLCJhcmVhIjoicmgiLCJfaWQiOiI2MTgyYThiMTI1M2Y3N2I5YmM4MDc1YzYiLCJyb2xlIjoidXNlciIsImlhdCI6MTYzNjAyNDYzM30.uK8GFAHYynEx3DHu7XnuldOQHTv05NpB4HCKwdCx7dA"

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Verificando página de login', () => {
  test('Verificando se existe o campo Email.', () => {
    render(<App />);
    const inputEmail = screen.getByPlaceholderText('Enter email');
    expect(inputEmail).toBeInTheDocument();
    expect(inputEmail).toHaveProperty('type', 'email');
  });

  test('Verificando se existe o campo Password.', () => {
    render(<App />);
    const inputPassword = screen.getByPlaceholderText('Enter Password');
    expect(inputPassword).toBeInTheDocument();
    expect(inputPassword).toHaveProperty('type', 'password');
  });

  test('Verificando se existe o Botão de Login.', () => {
    render(<App />);
    const inputButton = screen.getByText('Logar');
    expect(inputButton).toBeInTheDocument();
    expect(inputButton).toHaveProperty('type', 'button');
  });

  test('Verificando se consegue Logar.', async () => {
    const { getByPlaceholderText, getByText, history } = renderWithRouter(
      <LocalStorageMock items={{ token: '' }}>
        <App />
      </LocalStorageMock>
    );

    const inputButton = getByText('Logar');
    // userEvent.type(inputEmail, EMAIL_USER);
    // userEvent.type(inputPassword, EMAIL_PASSWORD);
    localStorage.setItem('token', 'xablas')
    userEvent.click(inputButton);
    localStorage.setItem('token', token)

    const logged = screen.getByText('Loading...');
    // console.log(logged)
    // console.log(fetchEl)
    expect(logged).toBeInTheDocument();
  });
});
