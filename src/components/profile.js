import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { useUser } from "../context/userContext";
import UpdateUser from "../utils/updateUser";
import InputField from "./commons/inputField";
import { BsPersonFill } from "react-icons/bs";

export default function Profile() {
  const { getAccessTokenSilently } = useAuth0();
  const {
    userData: { username, userId },
    setUserData
  } = useUser();

  const [newUsername, setNewUsername] = useState("");
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

  return (
    <div className="w-full h-full flex flex-col justify-start lg:justify-center items-center">
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
    </div>
  );
}
