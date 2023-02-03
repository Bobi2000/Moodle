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

    const lessonsEntriesData = lessonsEntrie.docs.map((entry) => {
      return { ...entry.data(), id: entry.id };
    }) as any;

    res.status(200).json({course: entrie.data(), lessons: lessonsEntriesData});
    return;
  }
}
