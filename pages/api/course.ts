import type { NextApiRequest, NextApiResponse } from "next";

import db from "../../firebase/firebase";

export default async function makeCourse(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const query = req.query;
    const { userId } = query;

    const entries = await db.collection("Courses").where("userId", "==", userId).get();
    const entriesData = entries.docs.map((entry) => {
      return { ...entry.data(), id: entry.id };
    }) as any;

    res.status(200).json(entriesData);
    return;
  }

  if (req.method === "PUT") {
    res.status(200).json({ message: "Put" });
    return;
  }

  if (req.method === "POST") {
    const data = req.body;

    const course = { userId: data.userId, ...data.data };

    await db
      .collection("Courses")
      .doc()
      .set(course)
      .then(() => {
        res.status(200).json({ isCourseCreated: true } as any);
        return;
      });
  }
}
