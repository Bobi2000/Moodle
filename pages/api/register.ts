import type { NextApiRequest, NextApiResponse } from "next";

import db from "./../../firebase/firebase";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const data = req.body;

  const entries = await db.collection("Users").get();
  const entriesData = entries.docs.map((entry) => entry.data());

  let isUsernameTaken: boolean = false;
  let isEmailTaken: boolean = false;
  let isUserSuccessfullyRegistered: boolean = false;

  if (entriesData.some((e) => e.username == data.username)) {
    isUsernameTaken = true;
  }

  if (entriesData.some((e) => e.email == data.email)) {
    isEmailTaken = true;
  }

  if (isUsernameTaken || isEmailTaken) {
    res
      .status(400)
      .json({ isUserSuccessfullyRegistered, isUsernameTaken, isEmailTaken });
    return;
  }

  await db
    .collection("Users")
    .doc()
    .set(data)
    .then(() => {
      isUserSuccessfullyRegistered = true;

      res.status(200).json({ isUserSuccessfullyRegistered });
    });
}
