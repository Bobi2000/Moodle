import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Course() {
  const router = useRouter();

  const [course, setCourse] = useState<any>();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (!router.isReady) return;

    fetch(`/api/getCourse?id=${router.query.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((entry: any) => {
        setCourse(entry.course);
        setLessons(entry.lessons);

        setLoading(false);
        if (entry.course.userId === localStorage.getItem("userId")) {
          setIsOwner(true);
        }
      });
  }, [router.isReady]);

  return (
    <>
      {!loading && (
        <>
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            {course!.name}
          </h1>
          <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            {course!.description}
          </p>
          {isOwner && (
            <Link
              href={`/course/add/${router.query.id}`}
              className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black font-bold items-center justify-cente"
            >
              Add Lesson
            </Link>
          )}

          {lessons.length !== 0 &&
            lessons.map((lesson) => (
              <div key={lesson.id} className="flex justify-center pt-6">
                <div className="block p-6 rounded-lg shadow-lg bg-white w-8/12">
                  <span className="text-gray-900 text-xl leading-tight font-medium mb-2">
                    {lesson.name}
                  </span>

                  <p className="text-gray-700 text-base mb-4">
                    {lesson.description}
                  </p>
                  <button
                    type="button"
                    className="inline-block px-6 py-2.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="ml-5 inline-block px-6 py-2.5 bg-red-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </>
      )}
    </>
  );
}
