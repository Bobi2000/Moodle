import type { NextApiRequest, NextApiResponse } from "next";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";
import { isQualifiedName } from "typescript";

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
    // const user = req.body;
    // await db
    //   .collection("Users")
    //   .doc(user.id)
    //   .update({ email: user.email, role: user.role, username: user.username });

    // res.status(200).json({ message: "Successfully edit a user" });

    const entry = req.body;

    await db
      .collection("Courses")
      .doc(entry.courseId)
      .collection("Lessons")
      .doc(entry.lessonId)
      .update({ name: entry.data.name, description: entry.data.description })
      .then(() => {
        res.status(200).json({ isLessonEdited: true } as any);
        return;
      });

    return;
  }

  if (req.method === "DELETE") {
    const query = req.query;
    const { courseId, lessonId }: { courseId: string; lessonId: string } =
      query as any;

    await db
      .collection("Courses")
      .doc(courseId)
      .collection("Lessons")
      .doc(lessonId)
      .delete()
      .then(() => {
        res.status(200).json({ isLessonDeleted: true } as any);
        return;
      });
  }
}
