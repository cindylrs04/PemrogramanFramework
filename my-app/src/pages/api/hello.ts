// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
  alamat: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = {
    name: 'Cindy Laili Larasati',
    alamat: 'jl.suka suka no 1'
  }

  res.setHeader('Content-Type', 'application/json')
  res.status(200).send(JSON.stringify(data, null, 2))
}