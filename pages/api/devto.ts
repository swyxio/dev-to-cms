import fetch from "node-fetch";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const posts = await fetch("https://dev.to/api/articles/me", {
    headers: {
      "api-key": req.headers["api-key"]
    }
  }).then(x => x.json());
  res.status(200).json(posts);
};
