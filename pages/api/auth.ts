import type { NextApiRequest, NextApiResponse } from "next";

import db from "./../../firebase/firebase";

type Data = {
  isUserAdmin?: boolean;
  isUserTeacher?: boolean;
};

export default async function isTeacher(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" } as any);
    return;
  }
  const userId = req.body;

  const curUser = await db.collection("Users").doc(userId).get();

  if (!curUser) {
    res.status(400).send({ message: "There is not such a user" } as any);
    return;
  }

  let isUserAdmin = false;
  let isUserTeacher = false;
  
  if(curUser.data()!.role === "admin") {
    isUserAdmin = true;
  }

  if(curUser.data()!.role === "teacher") {
    isUserTeacher = true;
  }

  res.status(200).json({
    isUserAdmin,
    isUserTeacher
  });
}
