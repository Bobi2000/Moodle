import Link from "next/link";
import { useRouter } from "next/router";

import { useContext, useEffect, useState } from "react";

import { UserContext } from "@/context/UserContext";

type Props = {
  isLogged: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
};

const Navbar: React.FC<Props> = ({ isLogged, isAdmin, isTeacher }: Props) => {
  const [active, setActive] = useState<boolean>(false);

  const { dispatch: userDisptach } = useContext(UserContext);

  const router = useRouter();

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <>
      <nav className="flex items-center flex-wrap bg-gray-900 p-3 ">
        <Link className="inline-flex items-center p-2 mr-4 " href="/">
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-white h-8 w-8 mr-2"
          >
            <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
          </svg>
          <span className="text-xl text-white font-bold tracking-wide">
            Moodle
          </span>
        </Link>
        <button
          className=" inline-flex p-3 hover:bg-blue-900 rounded lg:hidden text-white ml-auto hover:text-white outline-none"
          onClick={handleClick}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div
          className={`${
            active ? "" : "hidden"
          }   w-full lg:inline-flex lg:flex-grow lg:w-auto`}
        >
          <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto">
            {!isLogged && (
              <>
                <Link
                  href="/login"
                  className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-blue-900 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-blue-900 hover:text-white"
                >
                  Register
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  href="#"
                  className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center"
                >
                  Admin
                </Link>
                <Link
                  href="/manage"
                  className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-blue-900 hover:text-white"
                >
                  Manage
                </Link>
              </>
            )}

            {isTeacher && (
              <>
                <Link
                  href="#"
                  className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center"
                >
                  Teacher
                </Link>
                <Link
                  href="/addCourse"
                  className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-blue-900 hover:text-white"
                >
                  Add Course
                </Link>
              </>
            )}

            {!isTeacher && !isAdmin && (
              <>
                <Link
                  href="#"
                  className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center"
                >
                  Student
                </Link>
                <Link
                  href="/course/enroll"
                  className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-blue-900 hover:text-white"
                >
                  Enroll Course
                </Link>
              </>
            )}

            {isLogged && (
              <>
                <button
                  onClick={() => {
                    localStorage.removeItem("userId");
                    localStorage.removeItem("isAdmin");
                    localStorage.removeItem("isTeacher");
                    userDisptach({ type: "LOGOUT" });
                    router.push("/").then(() => {
                      location.reload();
                    });
                  }}
                  className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-blue-900 hover:text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
