import { useRouter } from "next/router";

import { useContext, useEffect, useState } from "react";

import { UserContext } from "@/context/UserContext";

type UsersRepsonse = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export default function Register() {
  const { state } = useContext(UserContext);
  const router = useRouter();

  const [users, setUsers] = useState<UsersRepsonse[]>();

  useEffect(() => {
    if (!(state.isLogged && state.isAdmin)) {
      router.push("/");
    }

    fetch("/api/manage", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((users: UsersRepsonse[]) => {
        setUsers(users);
      });
  }, []);

  return (
    <div className="text-gray-900 bg-gray-200">
      <div className="p-4 flex">
        <h1 className="text-3xl">Users</h1>
      </div>
      <div className="px-3 py-4 flex justify-center">
        <table className="w-full text-md bg-white shadow-md rounded mb-4">
          <tbody>
            <tr className="border-b">
              <th className="text-left p-3 px-5">Name</th>
              <th className="text-left p-3 px-5">Email</th>
              <th className="text-left p-3 px-5">Role</th>
              <th></th>
            </tr>
            {users?.length !== 0 &&
              users?.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-orange-100 bg-gray-100"
                >
                  <td className="p-3 px-5">
                    <input
                      type="text"
                      value={user.username}
                      onChange={({ target }) => {
                        setUsers((prevState) => {
                          return prevState!.map((curUser) => {
                            if (curUser.id === user.id) {
                              return { ...curUser, username: target.value };
                            }

                            return curUser;
                          });
                        });
                      }}
                      className="bg-transparent"
                    />
                  </td>
                  <td className="p-3 px-5">
                    <input
                      type="text"
                      value={user.email}
                      onChange={({ target }) => {
                        setUsers((prevState) => {
                          return prevState!.map((curUser) => {
                            if (curUser.id === user.id) {
                              return { ...curUser, email: target.value };
                            }

                            return curUser;
                          });
                        });
                      }}
                      className="bg-transparent"
                    />
                  </td>
                  <td className="p-3 px-5">
                    <select
                      value={user.role}
                      onChange={({ target }) => {
                        setUsers((prevState) => {
                          return prevState!.map((curUser) => {
                            if (curUser.id === user.id) {
                              return { ...curUser, role: target.value };
                            }

                            return curUser;
                          });
                        });
                      }}
                      className="bg-transparent"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="p-3 px-5 flex justify-end">
                    <button
                    onClick={() => {
                      fetch("/api/manage", {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(user),
                      })
                        .then((response) => response.json())
                        .then((data: any) => {
                          console.log(data);
                        });
                    }}
                      type="button"
                      className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
