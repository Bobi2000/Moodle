import { useEffect, useState } from "react";

import ReactBigCalendar from "./../shared/components/ReactBigCalendar";

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);

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
          if (!data.isUserTeacher && !data.isUserAdmin) {
            fetchStudentEnrolledCourses(localStorage.getItem("userId")!);
          }
        });
    } else {
      fetch(`/api/news`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((news: any[]) => {
          console.log(news);
          setNews(news);
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

  const fetchStudentEnrolledCourses = (userId: string) => {
    fetch(`/api/enrolledCourses?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((courses: any) => {
        setCourses(courses.courses);
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
      {news.length !== 0 &&
        news.map((news) => (
          <div key={news.id} className="flex justify-center pt-6">
            <div className="w-1/3 rounded overflow-hidden shadow-lg">
              <img
                className="w-full"
                src={news.img}
                alt="Sunset in the mountains"
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{news.title}</div>
                <p className="text-gray-700 text-base">{news.description}</p>
              </div>
              <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #news
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #grading
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #newebsite
                </span>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
