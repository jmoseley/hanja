import React, { FunctionComponent } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton: FunctionComponent = () => {
  const { logout } = useAuth0();

  return <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>;
};

export default LogoutButton;
