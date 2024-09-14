import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme"; // Import your custom theme
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";

const domain = process.env.REACT_APP_AUTH0_DOMAIN ?? "";
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID ?? "";

// Create a root with React 18 API
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

// Render the app with ChakraProvider and React Router v6
root.render(

  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{ redirect_uri: `${window.location.origin}/profile` }}
  >

    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </Auth0Provider>
);