import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { useUser } from "../context/userContext";
import UpdateUser from "../utils/updateUser";
import InputField from "./commons/inputField";
import { BsPersonFill } from "react-icons/bs";
import { IoExitOutline } from "react-icons/io5";

const callbackURL = window.location.origin;

export default function Profile() {
  const { logout, getAccessTokenSilently } = useAuth0();
  const {
    userData: { username, userId },
    setUserData
  } = useUser();

  const [newUsername, setNewUsername] = useState(username ?? "");
  const [hashnodeKey, setHashnodeKey] = useState(
    localStorage.getItem("hashnodeKey") ?? ""
  );
  const [devtoKey, setDevtoKey] = useState(
    localStorage.getItem("devtoKey") ?? ""
  );
  const [loading, setLoading] = useState(false);

  const handleUpdateUser = async () => {
    setLoading(true);
    const token = await getAccessTokenSilently();
    const { errors, data } = await UpdateUser(userId, newUsername, token);
    if (errors) console.log(errors);
    setUserData({
      userId: data.update_users_by_pk.user_id,
      username: data.update_users_by_pk.username
    });
    setLoading(false);
  };

  useEffect(() => {
    if (username) setNewUsername(username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem("hashnodeKey", hashnodeKey);
  }, [hashnodeKey]);

  useEffect(() => {
    localStorage.setItem("devtoKey", devtoKey);
  }, [devtoKey]);

  return (
    <div className="w-full h-full flex flex-col justify-start lg:justify-center items-center space-y-4">
      <div className="p-4 pt-10 flex lg:hidden flex-col items-center space-y-4">
        <BsPersonFill size={96} className="text-gray-600" />
        <p className="text-gray-600 font-nunito">@{username}</p>
      </div>
      <div className="w-full max-w-xl p-2 flex flex-col font-nunito space-y-4">
        <InputField
          label="username"
          value={newUsername}
          onChange={setNewUsername}
        />
        <button
          className="w-max p-2 px-4 flex items-center text-white bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl cursor-pointer"
          disabled={!newUsername || newUsername === username}
          onClick={handleUpdateUser}
        >
          {loading ? (
            <>
              <span>Updating</span>
              <ImSpinner2 className="ml-2 animate-spin" />
            </>
          ) : (
            <span>Update Username</span>
          )}
        </button>
      </div>
      <div className="p-2 w-full max-w-xl font-nunito space-y-4">
        <InputField
          label="Hashnode Access Token"
          value={hashnodeKey}
          onChange={setHashnodeKey}
        />
        <InputField
          label="Dev.to Access Token"
          value={devtoKey}
          onChange={setDevtoKey}
        />
        <p className="p-4 text-sm bg-gray-50 rounded-xl">
          Note: Access tokens are stored locally in the browser.
        </p>
      </div>
      <button
        onClick={() => logout({ returnTo: callbackURL })}
        className="w-max p-2 px-4 font-nunito flex lg:hidden justify-center items-center text-xl text-gray-700 hover:text-red-500 hover:bg-gray-100 rounded-3xl space-x-2"
      >
        <IoExitOutline />
        <span>Log out</span>
      </button>
    </div>
  );
}
