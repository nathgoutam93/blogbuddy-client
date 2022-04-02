import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/userContext";
import CreateNewBlog from "../utils/createNewBlog";
import { IoHomeOutline, IoPersonOutline, IoExitOutline } from "react-icons/io5";

export default function Dashboard() {
  const { user, isLoading, logout, getAccessTokenSilently } = useAuth0();
  const { userData, setUserBlogs } = useUser();

  const navigator = useNavigate();
  const callbackURL = window.location.origin;

  const handleCreateBLog = async () => {
    const token = await getAccessTokenSilently();
    const { errors, data } = await CreateNewBlog(user.sub, token);
    if (errors) console.log(errors);
    setUserBlogs((prevState) => [...prevState, data.insert_blogs_one]);
    navigator(`/blogs/${data.insert_blogs_one.id}`);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen w-full grid-cols-6 flex-col bg-gray-100 p-4 lg:grid">
      <header className="sticky top-4 flex h-10 w-full items-center justify-between rounded-xl p-4 lg:hidden">
        <Link
          to="/"
          className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text font-milonga text-2xl font-bold text-transparent"
        >
          BlogBuddy
        </Link>
        <div className="flex items-center justify-center font-nunito">
          <NavLink
            to={"/dashboard/profile"}
            className="w-max rounded-3xl p-2 px-4 text-xl text-gray-800 hover:bg-gray-100"
          >
            <IoPersonOutline size={25} />
          </NavLink>
        </div>
      </header>
      <header className="col-span-1 hidden flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 pb-10 font-nunito shadow-md lg:flex">
        <div className="flex flex-col space-y-6">
          <h1 className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text font-milonga text-2xl font-bold text-transparent">
            BlogBuddy
          </h1>
          <nav className="flex flex-col space-y-4">
            <NavLink
              to={"/dashboard/home"}
              className="flex w-max items-center justify-center space-x-2 rounded-3xl p-2 px-4 text-xl text-gray-700 hover:bg-gray-100"
            >
              <IoHomeOutline />
              <span>Home</span>
            </NavLink>
            <NavLink
              to={"/dashboard/profile"}
              className="flex w-max items-center justify-center space-x-2 rounded-3xl p-2 px-4 text-xl text-gray-700 hover:bg-gray-100"
            >
              <IoPersonOutline />
              <span>Profile</span>
            </NavLink>
            <button
              className="w-max cursor-pointer rounded-3xl bg-gradient-to-r from-teal-400 to-green-500 p-2 px-4 text-white hover:from-teal-500 hover:to-green-600"
              onClick={handleCreateBLog}
            >
              Create New Blog
            </button>
          </nav>
        </div>
        <button
          onClick={() => logout({ returnTo: callbackURL })}
          className="flex w-max items-center justify-center space-x-2 rounded-3xl p-2 px-4 text-xl text-gray-700 hover:bg-gray-100 hover:text-red-500"
        >
          <IoExitOutline />
          <span>Log out</span>
        </button>
      </header>
      <div className="col-span-4 flex h-full flex-col items-center justify-evenly p-2">
        <Outlet />
      </div>
      <div className="col-span-1 hidden flex-col items-center space-y-4 p-4 pt-10 lg:flex">
        <img
          src={`https://avatars.dicebear.com/api/identicon/${userData?.username}.svg`}
          alt="Profile Pic"
          width={96}
          height={96}
          className="rounded-xl border border-gray-200 shadow-md"
        />
        <p className="font-nunito text-gray-600">@{userData?.username}</p>
      </div>
    </div>
  );
}
