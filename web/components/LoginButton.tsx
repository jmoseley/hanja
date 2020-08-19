import React, { FunctionComponent } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton: FunctionComponent<{}> = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;
