import React from "react";
import Head from "../../components/head";
import Nav from "../../components/nav";
import { useApiKey } from "../../components/useApiKey";
import { useMutation, useQuery } from "react-query";
import EditorComponent from "../../components/editorComponent";
import { useRouter } from "next/router";
import { useNotification } from "../../components/Notification";

const header =
  process.env.NODE_ENV === "production"
    ? "https://dev-to-cms.now.sh"
    : "http://localhost:3000";

type Article = {
  title: string;
  published: boolean;
  body_markdown: string;
  tags: string[];
  series?: string;
  canonical_url?: string;
};

/**
 *
 *
 * PAGE for EDITING EXISTING POSTS
 *
 *
 *  */

export default function EditExistingPosts() {
  const router = useRouter();
  const { postId } = router.query;
  const [apiKey] = useApiKey();

  const { postNotification, NotificationElement } = useNotification();
  const updateExistingArticle = (args: { apiKey: string; article: Article }) =>
    fetch(`${header}/api/devto/${postId}`, {
      method: "PUT",
      headers: {
        "api-key": args.apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ article: args.article })
    })
      .then(x => x.json())
      .then(data => {
        console.log("posting...", data);
        postNotification({
          type: "success",
          title: `Post ${data.id} updated`,
          message: (
            <span>
              Post url{" "}
              <a
                href={data.url}
                className="text-indigo-600 hover:text-green-600 hover:underline"
                target="_blank"
              >
                {data.url}
              </a>
            </span>
          )
        });
      });

  const [mutate, mutationStatus] = useMutation(updateExistingArticle);

  const { status, data, error } = useQuery(
    postId && ["post", postId],
    () => {
      console.log(`fetching ${header}/api/devto/${postId}`);
      return fetch(`${header}/api/devto/${postId}`, {
        headers: {
          "api-key": apiKey
          // "Content-Type": "application/json"
        }
      }).then(x => x.json());
    },
    {
      refetchOnWindowFocus: false // https://twitter.com/tannerlinsley/status/1245869449829212160
    }
  );

  const onSubmit = data => {
    mutate({
      apiKey,
      article: data
    });
  };

  console.log({ postId, status, error, data, mutationStatus }); // todo - render in UI

  return (
    <div>
      <Head title="Editor" />
      <Nav />
      <EditorComponent
        submitState={mutationStatus}
        {...{
          NotificationElement,
          onSubmit
        }}
        existingPost={{ data, status }}
      />
    </div>
  );
}
