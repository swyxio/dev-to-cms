import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Link from "next/link";
import { useApiKey } from "../components/useApiKey";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";

import dynamic from "next/dynamic";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

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
export default () => {
  const [apiKey] = useApiKey();
  const [mutate, { status, error }] = useMutation(createNewArticle);
  const { register, handleSubmit, watch, errors } = useForm();
  const [postBody, setPostBody] = React.useState("");
  const onSubmit = data => {
    mutate({
      apiKey,
      article: {
        title: data.post_title,
        published: data.post_isPublished || false,
        body_markdown: postBody,
        tags: data.post_tags && data.post_tags.split(",").map(x => x.trim())
        // series: "Hello series"
      }
    });
  };
  const [isShowingFrontmatter, setIsShowingFrontmatter] = React.useState(true);

  return (
    <div>
      <Head title="Editor" />
      <Nav />
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-5 bg-gray-300">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="sticky flex justify-between border-b border-gray-200 px-4 py-5 sm:px-6">
            {/* header */}
            <h1 className="inline">
              {watch("post_title") || (
                <span className="text-red-500">TITLE REQUIRED</span>
              )}
            </h1>

            <button
              onClick={() => setIsShowingFrontmatter(!isShowingFrontmatter)}
            >
              {!isShowingFrontmatter && <span>Show FrontMatter!</span>}
              <svg
                className="-mr-1 ml-2 h-5 w-5 inline"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {isShowingFrontmatter && (
              <div className="md:grid md:grid-cols-3 md:gap-6 border-b border-gray-200 pb-5">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Frontmatter
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      Metadata for every post
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <form action="#" method="POST">
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                      <div className="px-4 py-5 bg-white sm:p-6">
                        <div className="mb-5 col-span-6 sm:col-span-4">
                          <label
                            htmlFor="post_title"
                            className="block text-sm font-medium leading-5 text-gray-700"
                          >
                            Post Title
                          </label>
                          <input
                            name="post_title"
                            placeholder="My Amazing Post"
                            className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            autoFocus
                            ref={register({ required: true, minLength: 3 })}
                          />
                        </div>

                        <div className="mb-5 col-span-6 sm:col-span-4">
                          <label
                            htmlFor="post_tags"
                            className="block text-sm font-medium leading-5 text-gray-700"
                          >
                            Tags (comma separated, e.g. React, JavaScript,
                            Advice, Reflections)
                          </label>
                          <input
                            name="post_tags"
                            placeholder="React, JavaScript, Advice, Reflections"
                            className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            ref={register({ required: true, minLength: 3 })}
                          />
                        </div>

                        <div className="mb-5 mt-4">
                          <div className="flex items-start">
                            <div className="absolute flex items-center h-5">
                              <input
                                name="post_isPublished"
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                ref={register}
                              />
                            </div>
                            <div className="pl-7 text-sm leading-5">
                              <label
                                htmlFor="post_isPublished"
                                className="font-medium text-gray-700"
                              >
                                Published
                              </label>
                              <p className="text-gray-500">
                                Is this publicly viewable?
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                          <div className="col-span-3 sm:col-span-2">
                            <label
                              htmlFor="post_canonical_url"
                              className="block text-sm font-medium leading-5 text-gray-700"
                            >
                              Canonical URL?
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                http://
                              </span>
                              <input
                                name="post_canonical_url"
                                className="form-input flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                placeholder="www.example.com"
                                ref={register}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="hidden sm:block">
              <div className="">
                <div className="">
                  <div className="mt-6">
                    <label
                      htmlFor="post_body"
                      className="block text-sm leading-5 font-medium text-gray-700"
                    >
                      Post Body (Markdown)
                    </label>
                    <div className="rounded-md shadow-sm">
                      <MonacoEditor
                        editorDidMount={() => {
                          // @ts-ignore
                          window.MonacoEnvironment.getWorkerUrl = (
                            _moduleId: string,
                            label: string
                          ) => {
                            if (label === "json")
                              return "_next/static/json.worker.js";
                            if (label === "css")
                              return "_next/static/css.worker.js";
                            if (label === "html")
                              return "_next/static/html.worker.js";
                            if (
                              label === "typescript" ||
                              label === "javascript"
                            )
                              return "_next/static/ts.worker.js";
                            return "_next/static/editor.worker.js";
                          };
                        }}
                        width="800"
                        height="600"
                        language="markdown"
                        theme="vs-dark"
                        value={postBody}
                        options={{
                          minimap: {
                            enabled: false
                          },
                          fontSize: 16,
                          wordWrap: "on",
                          lineNumbersMinChars: 3,
                          wrappingIndent: "same",
                          mouseWheelZoom: true,
                          copyWithSyntaxHighlighting: false
                          // acceptSuggestionOnEnter: "smart" // not sure i want this
                        }}
                        onChange={setPostBody}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Ctrl + Scroll/Pinch to Zoom Fontsize
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between bg-gray-50 border-t border-gray-200 px-4 py-4 sm:px-6">
            <Link href="/">
              <span className="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs leading-4 font-medium rounded text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150"
                >
                  Cancel
                </button>
              </span>
            </Link>
            <span className="inline-flex rounded-md shadow-sm">
              <div>
                Status:
                {/* todo: change color based on status */}
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-gray-100 text-gray-800">
                  {status}
                </span>
                {error && <div className="bg-red-50">{error}</div>}
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs leading-4 font-medium rounded text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
              >
                Submit
              </button>
            </span>
          </div>

          <div>
            {errors.exampleRequired && <span>This field is required</span>}
          </div>
        </form>
      </div>
    </div>
  );
};
