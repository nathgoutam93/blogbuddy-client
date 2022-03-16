import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import UserProvider from "./context/userContext";
// import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
// import { setContext } from "@apollo/client/link/context";
// import { useAuth0 } from "@auth0/auth0-react";
// import { createHttpLink } from "@apollo/client";

const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const auth0Audience = "blogbuddy-hasura";

// const hasuraUri = "https://legal-cod-63.hasura.app/v1/graphql";

// This code ensures that the access token from Auth0 is passed into the headers of each request made by Apollo.

// const AuthorizedApolloProvider = ({ children }) => {
//   const { getAccessTokenSilently, isLoading, isAuthenticated } = useAuth0();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   } else {
//     const httpLink = createHttpLink({
//       uri: hasuraUri,
//     });

//     const authLink = setContext(async () => {
//       if (isAuthenticated) {
//         const token = await getAccessTokenSilently();
//         return {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//       } else {
//         return {};
//       }
//     });

//     const apolloClient = new ApolloClient({
//       link: authLink.concat(httpLink),
//       cache: new InMemoryCache(),
//       connectToDevTools: true,
//     });

//     return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
//   }
// };

ReactDOM.render(
  <React.StrictMode>
    <Router>
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
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
