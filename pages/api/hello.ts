// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import StartFirebase from '@/firebase/firebase';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const db = StartFirebase();
  const ress = await db.collection('users').doc('KHGv9B9xRcbkCN16yE5h').set(data);
  console.log(res);

  res.status(200).json({ name: 'John Doe' })
}
