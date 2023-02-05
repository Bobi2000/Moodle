import type { NextApiRequest, NextApiResponse } from "next";

import db from "../../firebase/firebase";

export default async function enrolledCourses(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const query = req.query;
    const { userId } = query;

    const courses: any = [];

    const entrie = await db
      .collection("Users")
      .doc(userId! as string)
      .collection("EnrolledCourses")
      .get();

    const idEntries = entrie.docs.map((entry) => {
      return { ...entry.data(), id: entry.id };
    }) as any;

    await Promise.all(
      idEntries.map(async (entry: any) => {
        await db
          .collection("Courses")
          .doc(entry.courseId)
          .get()
          .then((en) => {
            courses.push({ ...en.data(), id: entry.courseId });
          });
      })
    ).then(() => {
      courses.sort((a: any, b: any) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      res.status(200).json({ courses: courses });
      return;
    });
  }
}
