import type { NextApiRequest, NextApiResponse } from "next";

import db from "../../firebase/firebase";

export default async function makeCourse(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const data = req.body;

    const courseId = data.courseId;
    const userId = data.userId;

    await db
      .collection("Users")
      .doc(userId)
      .collection("EnrolledCourses")
      .doc()
      .set({ courseId: courseId })
      .then(() => {
        res.status(200).json({ isCourseEnrolled: true } as any);
        return;
      });
  }

  if (req.method === "DELETE") {
    const data = req.body;

    const enrolledCourseId = data.enrolledCourseId;
    const userId = data.userId;

    await db
      .collection("Users")
      .doc(userId)
      .collection("EnrolledCourses")
      .doc(enrolledCourseId)
      .delete()
      .then(() => {
        res.status(200).json({ isCourseDeleted: true } as any);
        return;
      });
  }
}
