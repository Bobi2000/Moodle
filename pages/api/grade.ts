import type { NextApiRequest, NextApiResponse } from "next";

import db from "./../../firebase/firebase";

export default async function manageGet(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const query = req.query;
    const { courseId }: any = query;

    const entries = await db
      .collection("CourseUsers")
      .where("courseId", "==", courseId)
      .get();

    // const users = await Promise.all(
    //   entries.docs
    //     .map(async (e) => {
    //       return await db.collection("Users").doc(e.data().userId).get();
    //     })
    //     .map(async (u) => {
    //       const cu = await u;
    //       return { ...cu.data(), id: cu.id };
    //     })
    // );

    const userss: any = await Promise.all(
      entries.docs
        .map(async (e) => {
          const curUsers = await db
            .collection("Users")
            .doc(e.data().userId)
            .get();

          const enrolledCourseId = await db
            .collection("Users")
            .doc(e.data().userId)
            .collection("EnrolledCourses")
            .where("courseId", "==", courseId)
            .get()
            .then((e) => {
              return e.docs.map((e) => {
                return e.id;
              });
            });

          const curGrades = await db
            .collection("Users")
            .doc(e.data().userId)
            .collection("EnrolledCourses")
            .doc(enrolledCourseId[0])
            .collection("Grades")
            .get();

          return { curUsers, curGrades };
        })
        .map(async (u) => {
          const cu = await u;

          const entriesData = cu.curGrades.docs.map((grade) => {
            return { ...grade.data(), gradeId: grade.id };
          });

          return {
            ...cu.curUsers.data(),
            idUser: cu.curUsers.id,
            entriesData,
          };
        })
    );

    res.status(200).send(userss);
    return;
  }

  if (req.method === "POST") {
    console.log('POST')
    const data = req.body;
    const { courseId, grade } = data;

    let enrolledCourseId = "";

    const enrolledCourses = await db
      .collection("Users")
      .doc(grade.userId)
      .collection("EnrolledCourses")
      .get();

    enrolledCourses.docs.map((a) => {
      if (a.data().courseId === courseId) {
        enrolledCourseId = a.id;
      }
    });

    const enrolledCourse = await db
      .collection("Users")
      .doc(grade.userId)
      .collection("EnrolledCourses")
      .doc(enrolledCourseId)
      .collection("Grades")
      .doc()
      .set({ grade: grade.grade });

    res.status(200).json({ isGraded: true });
  }
}
