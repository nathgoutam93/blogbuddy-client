import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { useUser } from "../context/userContext";
import UpdateUser from "../utils/updateUser";
import InputField from "./commons/inputField";
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
    <div className="flex w-full flex-col items-center justify-start lg:justify-center">
      <div className="flex flex-col items-center space-y-4 p-4 pt-10 lg:hidden">
        <img
          src={`https://avatars.dicebear.com/api/identicon/${username}.svg`}
          alt="Profile Pic"
          width={96}
          height={96}
          className="rounded-xl border border-gray-200 shadow-md"
        />
        <p className="font-nunito text-gray-600">@{username}</p>
      </div>
      <div className="my-4 flex w-full max-w-xl flex-col space-y-4 p-2 font-nunito">
        <InputField
          label="username"
          value={newUsername}
          onChange={setNewUsername}
        />
        <button
          className="flex w-max cursor-pointer items-center rounded-3xl bg-gradient-to-r from-teal-400 to-green-500 p-2 px-4 text-white hover:from-teal-500 hover:to-green-600"
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
      <div className="w-full max-w-xl space-y-4 p-2 font-nunito">
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
        <p className="rounded-xl bg-gray-50 p-4 text-sm">
          Note: Access tokens are stored locally in the browser.
        </p>
      </div>
      <button
        onClick={() => logout({ returnTo: callbackURL })}
        className="my-10 flex h-max w-max items-center justify-center space-x-2 rounded-3xl p-2 px-4 font-nunito text-xl text-gray-700 hover:bg-gray-100 hover:text-red-500 lg:hidden"
      >
        <IoExitOutline />
        <span>Log out</span>
      </button>
    </div>
  );
}
