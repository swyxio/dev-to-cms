import fetch from "node-fetch";
import { NextApiRequest, NextApiResponse } from "next";

const DEBUG = true;
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (DEBUG) console.log("method: ", req.method, " reqURL", req.url);
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
          const getArticleIfPublished = fetch(
            `https://dev.to/api/articles/${postID}`,
            {
              headers: {
                "api-key": req.headers["api-key"],
                "Content-Type": "application/json"
              }
            }
          ).then(x => x.json());
          const getUnPublishedArticle = fetch(
            `https://dev.to/api/articles/me/unpublished`,
            {
              headers: {
                "api-key": req.headers["api-key"],
                "Content-Type": "application/json"
              }
            }
          )
            .then(x => x.json())
            .then(res =>
              res.error ? res : res.find(x => String(x.id) === postID)
            );
          const [ArticleIfPublished, UnPublishedArticle] = await Promise.all([
            getArticleIfPublished,
            getUnPublishedArticle
          ]);
          result = ArticleIfPublished.error
            ? UnPublishedArticle
            : ArticleIfPublished;
        } else {
          throw new Error("our assumptions are wrong!");
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
    case "PUT":
      try {
        // https://docs.dev.to/api/#operation/updateArticle
        if (DEBUG) console.log("body", req.body);
        const result = await fetch(`https://dev.to/api/articles/${postID}`, {
          method: "PUT",
          headers: {
            "api-key": req.headers["api-key"],
            "Content-Type": "application/json"
          },
          body: JSON.stringify(req.body)
        }).then(x => x.json());
        console.log({ result });
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
    case "DELETE":
    default:
      throw new Error("you forgot a case or to return");
  }
};
