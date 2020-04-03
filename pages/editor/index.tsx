import React from "react";
import Head from "../../components/head";
import Nav from "../../components/nav";
import { useApiKey } from "../../components/useApiKey";
import { useMutation } from "react-query";
import EditorComponent from "../../components/editorComponent";
import { useRouter } from "next/router";
import { Post } from "../../types";
import { handleErrors } from "../../utils";
import { useNotification } from "../../components/Notification";
import { executeCreateArticleMutation } from "../../components/OneGraphController";

const header =
  process.env.NODE_ENV === "production"
    ? "https://dev-to-cms.now.sh"
    : "http://localhost:3000";

type Article = {
  title: string;
  published: boolean;
  bodyMarkdown: string;
  tags: string[];
  series?: string;
  canonicalUrl?: string;
};

/**
 *
 *
 * PAGE for CREATING NEW POST
 *
 *
 *  */

export default () => {
  const [apiKey] = useApiKey();
  const router = useRouter();
  const { postNotification, NotificationElement } = useNotification();
  const createNewArticle = (args: { apiKey: string; article: Article }) =>
    executeCreateArticleMutation(args.apiKey, args.article)
      .then(handleErrors(postNotification))
      .then(data => {
        console.log({ data });
        router.push(`/editor/${data.devTo.createArticle.article.id}`);
      });
  const [mutate, { status, error }] = useMutation(createNewArticle);

  const onSubmit = data => {
    mutate({
      apiKey,
      article: data
    });
  };
  console.log({ status, error });
  return (
    <div>
      <Head title="Editor" />
      <Nav />
      <EditorComponent
        {...{
          NotificationElement,
          onSubmit
        }}
        submitState={{ status, error }}
      />
    </div>
  );
};
