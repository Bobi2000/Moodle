import type { NextApiRequest, NextApiResponse } from "next";

import db from "./../../firebase/firebase";

export default async function manageGet(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const entries = await db.collection("Users").get();
    const entriesData = entries.docs.map((entry) => {
      return { ...entry.data(), id: entry.id };
    }) as any;

    const output = entriesData.map(({ password, ...rest }: any) => rest);

    res.status(200).send(output);
    return;
  }

  if (req.method === "PUT") {
    const user = req.body;
    const entries = await db
      .collection("Users")
      .doc(user.id)
      .update({ email: user.email, role: user.role, username: user.username });

    res.status(200).json({ message: "Successfully edit a user" });
    return;
  }

  if (req.method === "POST") {
    res.status(200).send({ message: "POST" } as any);
    return;
  }
}
