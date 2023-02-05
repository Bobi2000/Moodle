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

  if (req.method === "DELETE") {
    const query = req.query;
    const { courseId, lessonId }: { courseId: string; lessonId: string } =
      query as any;
  }

  if (req.method === "POST") {
    const data = req.body;

    const resourse = {
      courseId: data.courseId,
      lessonId: data.lessonId,
      ...data.data,
    };

    await db
      .collection("Courses")
      .doc(resourse.courseId)
      .collection("Lessons")
      .doc(resourse.lessonId)
      .collection("Resources")
      .doc()
      .set({ ...data.data })
      .then(() => {
        res.status(200).json({ isResourcesCreated: true } as any);
        return;
      });
  }
}
