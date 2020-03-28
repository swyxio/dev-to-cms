import fetch from "node-fetch";
import { NextApiRequest, NextApiResponse } from "next";

const DEBUG = true;
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (DEBUG) console.log("method: ", req.method);
  switch (req.method) {
    case "GET":
      try {
        const posts = await fetch("https://dev.to/api/articles/me", {
          headers: {
            "api-key": req.headers["api-key"]
          }
        }).then(x => x.json());
        return res.status(200).json(posts);
      } catch (err) {
        return res.status(500).send(err);
      }
    case "PUT":
    case "POST":
      try {
        if (DEBUG) console.log("body", req.body);
        const result = await fetch("https://dev.to/api/articles/", {
          method: "POST",
          headers: {
            "api-key": req.headers["api-key"],
            "Content-Type": "application/json"
          },
          body: JSON.stringify(req.body)
        }).then(x => x.json());
        return res.status(200).json(result);
      } catch (err) {
        return res.status(500).send(err);
      }
    case "DELETE":
    default:
      throw new Error("you forgot a case or to return");
  }
};
