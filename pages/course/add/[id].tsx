import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  name: string;
  description: string;
};

export default function Course() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch("/api/lesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: router.query.id,
        data,
      }),
    })
      .then((response: any) => response.json())
      .then((data: any) => {
        if (data.isLessonCreated) {
          router.push(`/course/${router.query.id}`);
        }
      });
  };

  useEffect(() => {
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
          setIsLoading(false);
        }
      });
  }, []);

  return (
    <>
      {!isLoading && (
        <>
          <section className="bg-gray-50 dark:bg-gray-900 pt-10">
            <div className="flex flex-col items-center  px-6 py-8 mx-auto md:h-screen lg:py-0">
              <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Add Lesson
                  </h1>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 md:space-y-6"
                  >
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Lesson Name
                      </label>
                      <input
                        {...register("name", { required: true })}
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Lesson Name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Lesson Description
                      </label>
                      <textarea
                        {...register("description", { required: true })}
                        rows={4}
                        name="description"
                        id="description"
                        placeholder="Lesson Description"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Make New Lesson
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
