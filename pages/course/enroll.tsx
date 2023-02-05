import { useRouter } from "next/router";

import { useEffect, useState } from "react";

export default function Enroll() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<any>();
  const [currentlyAC, setCurrentlyAC] = useState<any[]>();

  useEffect(() => {
    fetch(`/api/userCourses?id=${localStorage.getItem("userId")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: any) => {
        setCourses(data.courses);
        setCurrentlyAC(data.ids);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {!isLoading && (
        <div className="text-gray-900 bg-gray-200">
          <div className="p-4 flex">
            <h1 className="text-3xl">All Courses</h1>
          </div>
          <div className="px-3 py-4 flex justify-center">
            <table className="w-full text-md bg-white shadow-md rounded mb-4">
              <tbody>
                <tr className="border-b">
                  <th className="text-left p-3 px-5">Name</th>
                  <th className="text-left p-3 px-5">Description</th>
                  <th></th>
                </tr>
                {courses?.length !== 0 &&
                  courses?.map((course: any) => (
                    <tr
                      key={course.id}
                      className="border-b hover:bg-orange-100 bg-gray-100"
                    >
                      <td className="p-3 px-5">{course.name}</td>
                      <td className="p-3 px-5"> {course.description}</td>
                      <td className="p-3 px-5 flex justify-end">
                        {currentlyAC?.filter((c) => c.courseId === course.id)
                          .length !== 0 && (
                          <button
                            onClick={() => {
                              fetch("/api/enroll", {
                                method: "DELETE",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  enrolledCourseId: currentlyAC?.filter(
                                    (c) => c.courseId === course.id
                                  )[0].id,
                                  userId: localStorage.getItem("userId"),
                                }),
                              })
                                .then((response: any) => response.json())
                                .then((data: any) => {
                                  if (data.isCourseDeleted) {
                                    location.reload();
                                  }
                                });
                            }}
                            type="button"
                            className="mr-3 text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                          >
                            Leave
                          </button>
                        )}
                        {currentlyAC?.filter((c) => c.courseId === course.id)
                          .length === 0 && (
                          <>
                            <button
                              onClick={() => {
                                fetch("/api/enroll", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    courseId: course.id,
                                    userId: localStorage.getItem("userId"),
                                  }),
                                })
                                  .then((response: any) => response.json())
                                  .then((data: any) => {
                                    if (data.isCourseEnrolled) {
                                      router.push(`/course/${course.id}`);
                                    }
                                  });
                              }}
                              type="button"
                              className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            >
                              Enroll
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
