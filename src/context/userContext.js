import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext, useEffect, useState } from "react";
import { generateUsername } from "friendly-username-generator";
import { v4 as uuidV4 } from "uuid";
import fetchGetUser from "../utils/getUser";
import PropTypes from "prop-types";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const { user, isloading, isAuthenticated, getAccessTokenSilently } =
    useAuth0();
  const [userData, setUserData] = useState({ username: "", userId: "" });
  const [userBlogs, setUserBlogs] = useState([]);

  useEffect(() => {
    if (isloading) return;

    if (!isAuthenticated)
      return setUserData({
        username: generateUsername({
          useHyphen: false,
          useRandomNumber: false
        }),
        userId: uuidV4()
      });

    const getUserData = async () => {
      const token = await getAccessTokenSilently();
      const { errors, data } = await fetchGetUser(user.sub, token);
      if (errors) console.error(errors);
      setUserData({
        userId: data.users_by_pk.user_id,
        username: data.users_by_pk.username
      });
      setUserBlogs(data.users_by_pk.Blogs);
    };

    getUserData();
  }, [isloading, isAuthenticated, user, getAccessTokenSilently]);

  return (
    <UserContext.Provider
      value={{ userData, setUserData, userBlogs, setUserBlogs }}
    >
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.element
};
