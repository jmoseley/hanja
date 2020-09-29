import React, { FunctionComponent } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import TodoList from './TodoList';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const App: FunctionComponent = () => {
  const { isAuthenticated, error } = useAuth0();

  return (
    <div>
      <h1>Hanja Todo App 📝</h1>
      {error && <div>Login Error: {error.message}</div>}
      {!isAuthenticated && <LoginButton />}
      {isAuthenticated && (
        <div>
          <TodoList />
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default App;
