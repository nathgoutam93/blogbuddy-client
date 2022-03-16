import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext, useEffect, useState } from "react";
import fetchGetUser from "../utils/getUser";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export default function UserProvider({ children }) {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return setUserData(null);

    getAccessTokenSilently().then((token) => {
      fetchGetUser(user.sub, token)
        .then(({ data, errors }) => {
          if (errors) console.error(errors);

          setUserData({
            username: data.users_by_pk.username,
            userId: data.users_by_pk.user_id,
            workingOn: data.users_by_pk.working_on,
          });
          setUserBlogs(data.users_by_pk.Blogs);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return (
    <UserContext.Provider
      value={{ userData, setUserData, userBlogs, setUserBlogs }}
    >
      {children}
    </UserContext.Provider>
  );
}
