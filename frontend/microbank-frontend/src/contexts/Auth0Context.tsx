import { Auth0Provider } from '@auth0/auth0-react';
import { ReactNode } from 'react';

interface Auth0WrapperProps {
  children: ReactNode;
}

export function Auth0Wrapper({ children }: Auth0WrapperProps) {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin + '/dashboard'
      }}
    >
      {children}
    </Auth0Provider>
  );
}
