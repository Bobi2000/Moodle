import { useEffect, useState } from "react";

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(localStorage.getItem("userId")),
      })
        .then((response) => response.json())
        .then((data: any) => {
          if (data.isUserTeacher) {
            fetchTeacherCourses(localStorage.getItem("userId")!);
          }
        });
    }
  }, []);

  const fetchTeacherCourses = (userId: string) => {
    fetch(`/api/course?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((courses: any[]) => {
        setCourses(courses);
      });
  };

  return (
    <>
      {courses.length !== 0 &&
        courses.map((course) => (
          <div key={course.id} className="flex justify-center pt-6">
            <div className="block p-6 rounded-lg shadow-lg bg-white w-8/12">
              <a href={`/course/${course.id}`}>
                <span className="text-gray-900 text-xl leading-tight font-medium mb-2">
                  {course.name}
                </span>
              </a>

              <p className="text-gray-700 text-base mb-4">
                {course.description}
              </p>
              {/* <button
                type="button"
                className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Button
              </button> */}
            </div>
          </div>
        ))}
    </>
  );
}
