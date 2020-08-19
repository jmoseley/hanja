import React, { FunctionComponent } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import TodoList from "./TodoList";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const App: FunctionComponent<{}> = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div>
      <h1>Todo</h1>
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
