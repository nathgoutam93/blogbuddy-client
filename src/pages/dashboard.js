import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/userContext";
import CreateNewBlog from "../utils/createNewBlog";

export default function Dashboard() {
  const {
    user,
    isLoading,
    isAuthenticated,
    logout,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();
  const { userData, setUserBlogs } = useUser();

  const navigator = useNavigate();
  const callbackURL = window.location.origin;

  const handleCreateBLog = async () => {
    if (!isAuthenticated)
      return loginWithRedirect({
        redirectUri: callbackURL,
      });

    const token = await getAccessTokenSilently();
    const { errors, data } = await CreateNewBlog(user.sub, token);
    if (errors) console.log(errors);
    setUserBlogs((prevState) => [...prevState, data.insert_blogs_one]);
    navigator(`/blogs/${data.insert_blogs_one.id}`);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="w-full h-screen p-4 flex flex-col lg:grid grid-cols-6 bg-gray-100">
      <header className="sticky top-4 w-full h-10 px-4 flex justify-between items-center lg:hidden">
        <Link
          to="/"
          className="text-2xl font-bold font-milonga text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-teal-900"
        >
          BlogBuddy
        </Link>
        <div>
          <NavLink
            to={"/dashboard/profile"}
            className="w-max p-2 px-4 text-xl text-gray-800 hover:bg-gray-100 rounded-3xl"
          >
            Profile
          </NavLink>
          <NavLink
            to={"/dashboard/settings"}
            className="w-max p-2 px-4 text-xl text-gray-800 hover:bg-gray-100 rounded-3xl"
          >
            Settings
          </NavLink>
        </div>
      </header>
      <header className="hidden col-span-1 p-4 pb-10 lg:flex flex-col justify-between bg-white rounded-xl shadow-md border border-gray-200">
        <div className="flex flex-col space-y-6">
          <h1 className="text-2xl font-bold font-milonga text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-teal-900">
            BlogBuddy
          </h1>
          <nav className="flex flex-col space-y-4">
            <NavLink
              to={"/dashboard/home"}
              className="w-max p-2 px-4 text-xl text-gray-800 hover:bg-gray-100 rounded-3xl"
            >
              Home
            </NavLink>
            <NavLink
              to={"/dashboard/profile"}
              className="w-max p-2 px-4 text-xl text-gray-800 hover:bg-gray-100 rounded-3xl"
            >
              Profile
            </NavLink>
            <NavLink
              to={"/dashboard/settings"}
              className="w-max p-2 px-4 text-xl text-gray-800 hover:bg-gray-100 rounded-3xl"
            >
              Settings
            </NavLink>
            <button
              className="w-max p-2 px-4 text-white bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl cursor-pointer"
              onClick={handleCreateBLog}
            >
              Create New Blog
            </button>
          </nav>
        </div>
        <button
          onClick={() => logout({ returnTo: callbackURL })}
          className="w-max p-2 px-4 text-xl text-gray-800 hover:text-red-500 hover:bg-gray-100 rounded-3xl"
        >
          Log out
        </button>
      </header>
      <div className="h-full col-span-4 p-2 flex flex-col justify-evenly items-center">
        <Outlet />
      </div>
      <div className="hidden col-span-1 p-4 pt-10 lg:flex flex-col items-center space-y-4">
        <div className="h-24 w-24 bg-white rounded-2xl shadow-md overflow-hidden">
          <img src={user?.picture} alt="profile pic" />
        </div>
        <p className="text-gray-600">@{userData?.username}</p>
      </div>
    </div>
  );
}
