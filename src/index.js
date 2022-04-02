import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { DarkModeProvider } from "./context/darkModeContext";
import UserProvider from "./context/userContext";
import App from "./App";
import "./index.css";

const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const auth0Audience = process.env.REACT_APP_AUTH0_AUDIENCE;

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <DarkModeProvider>
        <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          redirectUri={window.location.origin}
          audience={auth0Audience}
        >
          <UserProvider>
            <App />
          </UserProvider>
        </Auth0Provider>
      </DarkModeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
