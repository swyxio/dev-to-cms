import React from "react";
import Head from "../../components/head";
import Nav from "../../components/nav";
import { useApiKey } from "../../components/useApiKey";
import { useMutation } from "react-query";
import EditorComponent from "../../components/editorComponent";

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

const createNewArticle = (args: { apiKey: string; article: Article }) =>
  fetch(`${header}/api/devto`, {
    method: "POST",
    headers: {
      "api-key": args.apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ article: args.article })
  });

/**
 *
 *
 * PAGE for CREATING NEW POST
 *
 *
 *  */

export default () => {
  const [apiKey] = useApiKey();
  const [mutate, { status, error }] = useMutation(createNewArticle);

  const onSubmit = data => {
    mutate({
      apiKey,
      article: data
    });
  };

  console.log({ status, error }); // todo - render in UI

  return (
    <div>
      <Head title="Editor" />
      <Nav />
      <EditorComponent onSubmit={onSubmit} />
    </div>
  );
};
