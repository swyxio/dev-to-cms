import fetch from "node-fetch";
import { NextApiRequest, NextApiResponse } from "next";

const DEBUG = false;
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (DEBUG) console.log("header: ", req.headers);
  const { host, origin, referer, ...filtered } = req.headers;
  try {
    let result = await fetch(
      `https://serve.onegraph.com/graphql?app_id=1bbf3448-3c24-4480-a58a-66811879d5df`,
      {
        method: "POST",
        headers: filtered,
        body: req.body
      }
    ).then(x => x.json());
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};
