import fetch from "node-fetch";
import { NextApiRequest, NextApiResponse } from "next";

const DEBUG = false;
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (DEBUG) console.log("method: ", req.method);
  const {
    query: { postID }
  } = req;
  switch (req.method) {
    case "GET":
      try {
        let result;
        if (postID) {
          // we are requesting existing id
          console.log({ postID });
          result = await fetch(`https://dev.to/api/articles/${postID}`, {
            headers: {
              "api-key": req.headers["api-key"],
              "Content-Type": "application/json"
            }
          }).then(x => x.json());
        } else {
          // getting list of articles
          result = await fetch("https://dev.to/api/articles/me/all", {
            headers: {
              "api-key": req.headers["api-key"]
            }
          }).then(x => x.json());
        }
        if (result.error) {
          return res.status(result.status).send(result.error);
        } else {
          return res.status(200).json(result);
        }
      } catch (err) {
        console.error(err);
        return res.status(500).send(err);
      }
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

        if (result.error) {
          return res.status(result.status).send(result.error);
        } else {
          return res.status(200).json(result);
        }
      } catch (err) {
        return res.status(500).send(err);
      }
    case "DELETE":
    default:
      throw new Error("you forgot a case or to return");
  }
};
