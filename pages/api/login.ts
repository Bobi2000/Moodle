import type { NextApiRequest, NextApiResponse } from "next";

import db from "./../../firebase/firebase";

type Data = {
  isUserSuccessfullyLoggedIn?: boolean;
  isUserAdmin?: boolean;
  userId?: string;
};

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" } as any);
    return;
  }

  const data = req.body;

  const entries = await db.collection("Users").get();
  const entriesData = entries.docs.map((entry) => {
    return { ...entry.data(), id: entry.id };
  }) as any;

  const curUser = entriesData.filter(
    (e: { username: string; password: string }) =>
      e.username == data.username && e.password == data.password
  )[0];

  if (!curUser) {
    res.status(200).json({ isUserSuccessfullyLoggedIn: false });
    return;
  }

  let isUserAdmin = false;

  if (curUser.hasOwnProperty("role") && curUser.role === "admin") {
    isUserAdmin = true;
  }

  res.status(200).json({
    isUserSuccessfullyLoggedIn: true,
    userId: curUser.id,
    isUserAdmin,
  });
}
