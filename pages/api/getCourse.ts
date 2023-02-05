import type { NextApiRequest, NextApiResponse } from "next";

import db from "../../firebase/firebase";

export default async function getCourse(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const query = req.query;
    const { id } = query;

    if (!id) {
      res.status(405).send({ message: "No such ID" } as any);
      return;
    }

    const entrie = await db
      .collection("Courses")
      .doc(id! as string)
      .get();

    const lessonsEntrie = await db
      .collection("Courses")
      .doc(id! as string)
      .collection("Lessons")
      .orderBy("date")
      .get();

    const lessonsEntriesData = (await Promise.all(
      lessonsEntrie.docs
        .map(async (entry) => {
          const resourses = await db
            .collection("Courses")
            .doc(id! as string)
            .collection("Lessons")
            .doc(entry.id)
            .collection("Resources")
            .orderBy("name")
            .get();

          const resousesEntriesData = resourses.docs.map((entry) => {
            return { ...entry.data(), id: entry.id };
          });

          const course = { ...entry.data(), lessons: resousesEntriesData };

          return { course, id: entry.id };
        })
        .map(async (led) => {
          const data = await led;
          return data;
        })
    )) as any;

    res
      .status(200)
      .json({ course: entrie.data(), lessons: lessonsEntriesData });
    return;
  }
}
