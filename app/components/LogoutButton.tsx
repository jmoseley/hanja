import React, { FunctionComponent } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getAppUrl } from '../util/appUrl';

const LogoutButton: FunctionComponent = () => {
  const { logout } = useAuth0();

  return <button onClick={() => logout({ returnTo: getAppUrl() })}>Log Out</button>;
};

export default LogoutButton;
