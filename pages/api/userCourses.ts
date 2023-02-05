import type { NextApiRequest, NextApiResponse } from "next";

import db from "../../firebase/firebase";

export default async function makeCourse(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const query = req.query;
    const { id } = query;

    const courseEntries = await db.collection("Courses").orderBy("name").get();

    const entrie = await db
      .collection("Users")
      .doc(id! as string)
      .collection("EnrolledCourses")
      .get();

    const entriesData = courseEntries.docs.map((entry) => {
      return { ...entry.data(), id: entry.id };
    }) as any;

    const idEntries = entrie.docs.map((entry) => {
      return { ...entry.data(), id: entry.id };
    }) as any;

    res.status(200).json({courses: entriesData, ids: idEntries});
    return;
  }
}
