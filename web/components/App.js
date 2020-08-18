import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import TodoList from "./TodoList";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const App = ({ loading, data, error }) => {
    const { user, isAuthenticated } = useAuth0();

    console.log(user);

    return (
      <div>
        <h1>Todo</h1>
        <TodoList todos={data ? data.todos : []} />
        {!isAuthenticated && <LoginButton />}
        {isAuthenticated && <LogoutButton />}
      </div>
    );
  }

export default App;