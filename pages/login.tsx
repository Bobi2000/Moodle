import Link from "next/link";
import { useRouter } from "next/router";

import { useContext, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { UserContext } from "@/context/UserContext";

type Inputs = {
  username: string;
  password: string;
};

type LoginResponse = {
  isUserSuccessfullyLoggedIn?: boolean;
  userId?: string;
  isUserAdmin?: boolean;
  isUserTeacher?: boolean;
};

export default function Login() {
  const { dispatch: userDisptach, state } = useContext(UserContext);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data: LoginResponse) => {
        if (!data.isUserSuccessfullyLoggedIn) {
          setError("username", {
            type: "server",
            message: "Incorrect login credentials.",
          });
        } else if (data.isUserSuccessfullyLoggedIn) {
          localStorage.setItem("userId", data.userId!);
          userDisptach({ type: "LOGGIN" });
          if (data.isUserAdmin && data.isUserAdmin === true) {
            localStorage.setItem("isAdmin", "true");
            userDisptach({ type: "ISADMIN" });
          }

          if (data.isUserTeacher && data.isUserTeacher === true) {
            localStorage.setItem("isTeacher", "true");
            userDisptach({ type: "ISTEACHER" });
          }

          router.push("/");
        }
      });
  };

  useEffect(() => {
    if (state.isLogged) {
      router.push("/");
    }
  });

  return (
    <section className="bg-gray-50 dark:bg-gray-900 pt-10">
      <div className="flex flex-col items-center  px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Log in
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
            >
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Username
                </label>
                <input
                  {...register("username", { required: true })}
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your Username"
                />
                {errors.username && errors.username.type === "required" && (
                  <span className="text-red-600">This field is required</span>
                )}
                {errors.username && errors.username.type === "server" && (
                  <span className="text-red-600">
                    {errors.username.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.password && (
                  <span className="text-red-600">This field is required</span>
                )}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Login
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don`&#39;`t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up today!
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
