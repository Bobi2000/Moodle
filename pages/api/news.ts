import type { NextApiRequest, NextApiResponse } from "next";

import db from "../../firebase/firebase";

export default async function getCourse(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    
    const entrie = await db
      .collection("News")
      .orderBy("title")
      .get();

      const news = entrie.docs.map((e) => {
        return { ...e.data(), id: e.id };
      }) as any;


    res.status(200).json(news);
    return;
  }
}
