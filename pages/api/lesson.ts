import type { NextApiRequest, NextApiResponse } from "next";

import db from "../../firebase/firebase";

export default async function lesson(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    res.status(200).json({});
    return;
  }

  if (req.method === "PUT") {
    res.status(200).json({});
    return;
  }

  if (req.method === "POST") {
    const data = req.body;

    const lesson = { courseId: data.courseId, ...data.data, date: Date.now() };

    await db
      .collection("Courses")
      .doc(lesson.courseId)
      .collection("Lessons")
      .doc()
      .set(lesson)
      .then(() => {
        res.status(200).json({ isLessonCreated: true } as any);
        return;
      });
  }
}
