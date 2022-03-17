import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext, useEffect, useState } from "react";
import fetchGetUser from "../utils/getUser";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export default function UserProvider({ children }) {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState({ username: "", userId: "" });
  const [userBlogs, setUserBlogs] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return setUserData({ username: "", userId: "" });

    const getUserData = async () => {
      const token = await getAccessTokenSilently();
      const { errors, data } = await fetchGetUser(user.sub, token);
      if (errors) console.error(errors);
      setUserData({
        username: data.users_by_pk.username,
        userId: data.users_by_pk.user_id,
      });
      setUserBlogs(data.users_by_pk.Blogs);
    };

    getUserData();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return (
    <UserContext.Provider
      value={{ userData, setUserData, userBlogs, setUserBlogs }}
    >
      {children}
    </UserContext.Provider>
  );
}
