import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  name: string;
  link: string;
};

export default function Course() {
  const router = useRouter();

  const [a, forceUpdate] = useReducer((x) => x + 1, 0);

  const [course, setCourse] = useState<any>();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAddingResousesOpenedId, setIsAddingResousesOpenedId] =
    useState<string>();

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
  }, [router.isReady, a]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch("/api/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: router.query.id,
        lessonId: isAddingResousesOpenedId,
        data,
      }),
    })
      .then((response: any) => response.json())
      .then((data: any) => {
        if (data.isResourcesCreated) {
          setIsAddingResousesOpenedId("");
          forceUpdate();
        }
      });
  };

  return (
    <>
      {!loading && (
        <>
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            {course.name}
          </h1>
          <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            {course.description}
          </p>
          {isOwner && (
            <>
              <Link
                href={`/course/add/${router.query.id}`}
                className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black font-bold items-center justify-cente"
              >
                Add Lesson
              </Link>
              <Link
                href={`/course/grade/${router.query.id}`}
                className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black font-bold items-center justify-cente"
              >
                Grade
              </Link>
            </>
          )}

          {lessons.length !== 0 &&
            lessons.map((lesson) => (
              <div key={lesson.id} className="flex justify-center pt-6">
                <div className="block p-6 rounded-lg shadow-lg bg-white w-8/12">
                  <span className="text-gray-900 text-xl leading-tight font-medium mb-2">
                    {lesson.course.name}
                  </span>

                  <p className="text-gray-700 text-base mb-4">
                    {lesson.course.description}
                  </p>

                  {lesson.course.lessons &&
                    lesson.course.lessons.length !== 0 &&
                    lesson.course.lessons.map((res: any) => (
                      <div key={res.id}>
                        <span>
                          <a href={res.link} download>
                            {res.name}
                          </a>
                        </span>
                      </div>
                    ))}

                  <br />

                  {isOwner && (
                    <>
                      <button
                        onClick={() => {
                          setIsAddingResousesOpenedId(lesson.id);
                        }}
                        type="button"
                        className="inline-block px-6 py-2.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                      >
                        Add Resources
                      </button>
                      <Link
                        href={{
                          pathname: `/course/edit/${lesson.id}`,
                          query: {
                            courseId: router.query.id,
                            name: lesson.course.name,
                            description: lesson.course.description,
                          },
                        }}
                        className="ml-5 inline-block px-6 py-2.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          fetch(
                            `/api/lesson?courseId=${router.query.id}&lessonId=${lesson.id}`,
                            {
                              method: "DELETE",
                              headers: {
                                "Content-Type": "application/json",
                              },
                            }
                          )
                            .then((response) => response.json())
                            .then((data: any) => {
                              setLessons(
                                lessons.filter(
                                  (curLesson) => curLesson.id !== lesson.id
                                )
                              );
                            });
                        }}
                        type="button"
                        className="ml-5 inline-block px-6 py-2.5 bg-red-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                      >
                        Delete
                      </button>

                      {isAddingResousesOpenedId &&
                        isAddingResousesOpenedId === lesson.id && (
                          <>
                            <form
                              onSubmit={handleSubmit(onSubmit)}
                              className="w-full"
                            >
                              <div className="flex items-center border-b border-blue-500 py-2">
                                <input
                                  {...register("name", { required: true })}
                                  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                  type="text"
                                  placeholder="Resourse Name"
                                />
                                <input
                                  {...register("link", { required: true })}
                                  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                  type="text"
                                  placeholder="Resourse Link"
                                />
                                <button
                                  className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
                                  type="submit"
                                >
                                  Add Resourse
                                </button>
                                <button
                                  className="flex-shrink-0 border-transparent border-4 text-blue-500 hover:text-blue-800 text-sm py-1 px-2 rounded"
                                  type="button"
                                  onClick={() => {
                                    setIsAddingResousesOpenedId("");
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </>
                        )}
                    </>
                  )}
                </div>
              </div>
            ))}
        </>
      )}
    </>
  );
}
