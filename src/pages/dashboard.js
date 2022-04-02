import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/userContext";
import CreateNewBlog from "../utils/createNewBlog";
import { IoHomeOutline, IoPersonOutline, IoExitOutline } from "react-icons/io5";
import { useDarkMode } from "../context/darkModeContext";
import { MdLightMode } from "react-icons/md";
import { BsFillMoonStarsFill } from "react-icons/bs";

export default function Dashboard() {
  const { user, isLoading, logout, getAccessTokenSilently } = useAuth0();
  const { userData, setUserBlogs } = useUser();

  const navigator = useNavigate();
  const callbackURL = window.location.origin;

  const { dark, setDark } = useDarkMode();

  const handleCreateBLog = async () => {
    const token = await getAccessTokenSilently();
    const { errors, data } = await CreateNewBlog(user.sub, token);
    if (errors) console.log(errors);
    setUserBlogs((prevState) => [...prevState, data.insert_blogs_one]);
    navigator(`/blogs/${data.insert_blogs_one.id}`);
  };

  const handleDark = () => {
    if (dark) {
      window.document.documentElement.classList.remove("dark");
    } else {
      window.document.documentElement.classList.add("dark");
    }
    localStorage.setItem("dark", JSON.stringify(!dark));
    setDark(!dark);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen w-full grid-cols-6 flex-col bg-primary-light p-4 dark:bg-primary-dark lg:grid">
      <header className="sticky top-4 flex h-10 w-full items-center justify-between rounded-xl bg-primary-light p-4 dark:bg-primary-dark lg:hidden">
        <Link
          to="/"
          className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text font-milonga text-2xl font-bold text-transparent"
        >
          BlogBuddy
        </Link>
        <div className="flex items-center justify-center font-nunito">
          <NavLink
            to={"/dashboard/profile"}
            className="w-max rounded-3xl p-2 px-4 text-xl text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-primary-dark"
          >
            <IoPersonOutline size={25} />
          </NavLink>
          {dark ? (
            <BsFillMoonStarsFill
              size={25}
              className="cursor-pointer text-gray-600"
              onClick={handleDark}
            />
          ) : (
            <MdLightMode
              size={25}
              className="cursor-pointer text-gray-600"
              onClick={handleDark}
            />
          )}
        </div>
      </header>
      <header className="col-span-1 hidden min-w-max flex-col justify-between rounded-xl border border-gray-200 bg-secondary-light p-4 pb-10 font-nunito dark:border-secondary-dark dark:bg-secondary-dark lg:flex">
        <div className="flex flex-col space-y-6">
          <h1 className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text font-milonga text-2xl font-bold text-transparent">
            BlogBuddy
          </h1>
          <nav className="flex flex-col space-y-4">
            <NavLink to={"/dashboard/home"} className="nav-primary">
              <IoHomeOutline />
              <span>Home</span>
            </NavLink>
            <NavLink to={"/dashboard/profile"} className="nav-primary">
              <IoPersonOutline />
              <span>Profile</span>
            </NavLink>
            <button
              className="btn-primary w-max cursor-pointer rounded-3xl "
              onClick={handleCreateBLog}
            >
              Create New Blog
            </button>
          </nav>
        </div>

        <button
          onClick={() => logout({ returnTo: callbackURL })}
          className="nav-primary hover:text-red-500"
        >
          <IoExitOutline />
          <span>Log out</span>
        </button>
      </header>
      <div className="col-span-4 flex h-full flex-col items-center justify-evenly p-2">
        <Outlet />
      </div>
      <div className="col-span-1 hidden flex-col items-center space-y-4 p-4 pt-10  lg:flex">
        <img
          src={`https://avatars.dicebear.com/api/identicon/${userData?.username}.svg`}
          alt="Profile Pic"
          width={96}
          height={96}
          className="rounded-xl border border-gray-200 shadow-md dark:border-secondary-dark"
        />
        <p className="font-nunito text-gray-600 dark:text-gray-400">
          @{userData?.username}
        </p>
        <div className="flex space-x-2 px-4">
          <MdLightMode size={25} className="text-gray-600" />
          <label htmlFor="dark" className="flex cursor-pointer items-center">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                id="dark"
                checked={dark}
                onChange={handleDark}
              />
              <div className="block h-6 w-10 rounded-full bg-gray-400"></div>
              <div className="dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition"></div>
            </div>
          </label>
          <BsFillMoonStarsFill size={25} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
}
