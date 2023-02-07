import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Grade = {
  grade: number;
  userId: string;
};

export default function Course() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (!router.isReady) return;

    if (!localStorage.getItem("userId")) {
      router.push("/");
      return;
    }

    fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(localStorage.getItem("userId")),
    })
      .then((response) => response.json())
      .then((data: any) => {
        if (data.isUserTeacher !== true) {
          router.push("/");
        } else {
          fetchAllStudents();
          setIsLoading(false);
        }
      });
  }, [router.isReady]);

  const fetchAllStudents = () => {
    fetch(`/api/grade?courseId=${router.query.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((students: any[]) => {
        console.log(students);
        setStudents(students);
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Grade>();

  const onSubmit: SubmitHandler<Grade> = (data) => {
    console.log(data);
    fetch("/api/grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: router.query.id,
        grade: data,
      }),
    })
      .then((response) => response.json())
      .then((data: any) => {
        if (data.isGraded === true) {
          console.log("Successfully graded! ");
        }
      });
  };

  return (
    <>
      {!isLoading && (
        <>
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
                    <th className="text-left p-3 px-5">Grades</th>
                    <th className="text-left p-3 px-5">Average</th>
                    <th></th>
                  </tr>
                  {students?.length !== 0 &&
                    students.map((student) => (
                      <tr
                        key={student.email}
                        className="border-b hover:bg-orange-100 bg-gray-100"
                      >
                        <td className="p-3 px-5">{student.username}</td>
                        <td className="p-3 px-5">{student.email}</td>
                        <td className="p-3 px-5">
                          {student.entriesData &&
                            student.entriesData.length !== 0 &&
                            student.entriesData.map((grade: any) => (
                              <span key={grade.gradeId}> {grade.grade} </span>
                            ))}
                        </td>
                        <td className="p-3 px-5"></td>
                        <td className="p-3 px-5 flex justify-end">
                          <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="w-full"
                          >
                            <div className="flex items-center border-b border-blue-500 py-2">
                              <input
                                {...register("grade", { required: true })}
                                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                type="number"
                                placeholder="Grade"
                                step=".50"
                              />
                              <input
                                {...register("userId", {
                                  required: true,
                                  value: student.idUser,
                                })}
                                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                type="text"
                                hidden
                              />
                              <button
                                className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
                                type="submit"
                              >
                                Grade
                              </button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
