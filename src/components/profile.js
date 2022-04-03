import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/userContext";
import { ImSpinner2 } from "react-icons/im";
import { IoExitOutline } from "react-icons/io5";
import InputField from "./commons/inputField";
import UpdateUser from "../utils/updateUser";

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
    <div className="flex min-h-max w-full flex-col items-center justify-start lg:justify-center">
      <div className="flex translate-y-full animate-enter-b flex-col items-center space-y-4 p-4 pt-10 opacity-0 lg:hidden">
        <img
          src={`https://avatars.dicebear.com/api/identicon/${username}.svg`}
          alt="Profile Pic"
          width={96}
          height={96}
          className="rounded-xl border border-gray-200 shadow-md dark:border-secondary-dark"
        />
        <p className="font-nunito text-gray-600 dark:text-gray-400">
          @{username}
        </p>
      </div>
      <div
        style={{ animationDelay: "100ms" }}
        className="my-4 flex w-full max-w-xl translate-y-full animate-enter-b flex-col space-y-4 p-2 font-nunito opacity-0"
      >
        <InputField
          label="username"
          value={newUsername}
          onChange={setNewUsername}
        />
        <button
          style={{ animationDelay: "200ms" }}
          className="btn-primary translate-y-full animate-enter-b opacity-0"
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
      <div
        style={{ animationDelay: "300ms" }}
        className="w-full max-w-xl translate-y-full animate-enter-b space-y-4 p-2 font-nunito opacity-0"
      >
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
        <p
          style={{ animationDelay: "400ms" }}
          className="translate-y-full animate-enter-b rounded-xl bg-gray-50 p-4 text-sm text-gray-900 opacity-0 dark:bg-secondary-dark dark:text-gray-100"
        >
          Note: Access tokens are stored locally in the browser.
        </p>
      </div>
      <button
        style={{ animationDelay: "500ms" }}
        onClick={() => logout({ returnTo: callbackURL })}
        className="nav-primary my-6 translate-y-full animate-enter-b opacity-0 hover:text-red-500 lg:hidden"
      >
        <IoExitOutline />
        <span className="mb-1.5">Log out</span>
      </button>
    </div>
  );
}
