import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Article, Post } from "../types";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });
import { useFormik } from "formik";
const marked = require("marked");
import { safeStringArr } from "../utils";
import("wc-spinners/dist/half-circle-spinner.js");

//  https://marked.js.org/#/USING_ADVANCED.md#options
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, language) {
    const hljs = require("highlight.js");
    const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
    return hljs.highlight(validLanguage, code).value;
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});

/**
 *
 * Main
 *
 */
export default function EditorComponent(props: {
  onSubmit: (data: Article) => void;
  submitState: {
    status: "success" | "loading" | "error";
    error: Error | null;
  };
  existingPost?: {
    data: Post;
    status: "success" | "loading" | "error";
  };
  NotificationElement: JSX.Element;
}) {
  const { onSubmit, existingPost, submitState, NotificationElement } = props;

  // React.useEffect(() => {
  //   import("wc-spinners/dist/half-circle-spinner.js");
  // });
  /** visual toggles */
  const [isShowingFrontmatter, setIsShowingFrontmatter] = React.useState(true);
  const [isShowingMarkdown, setIsShowingMarkdown] = React.useState(true);
  const [isShowingPreview, setIsShowingPreview] = React.useState(true);

  let formik = useFormik({
    initialValues: {
      post_title: "",
      post_body: "",
      post_canonical_url: "",
      post_isPublished: false,
      post_tags: ""
    },
    onSubmit: values => {
      console.log({ values });
      onSubmit({
        title: values.post_title,
        published: values.post_isPublished,
        body_markdown: values.post_body,
        tags: values.post_tags.split(",").map(x => x.trim()),
        series: undefined, //TODO, fix
        canonical_url: values.post_canonical_url
      });
    }
  });
  React.useEffect(() => {
    formik.setValues({
      post_title: existingPost?.data?.title || "",
      post_body: existingPost?.data?.body_markdown || "",
      post_canonical_url: existingPost?.data?.canonical_url || "",
      post_isPublished: !!existingPost?.data?.published_at,
      post_tags: safeStringArr(existingPost?.data?.tag_list).join(", ") || ""
    });
  }, [existingPost?.data]);

  if (existingPost?.status === "loading")
    return (
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-5 bg-gray-300">
        Loading...
      </div>
    );

  const markdownPreviewHTML: string = marked(formik.values.post_body);
  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-5 bg-gray-300">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white overflow-hidden shadow rounded-lg"
      >
        <div className="sticky flex justify-between border-b border-gray-200 px-4 py-5 sm:px-6">
          {/* header */}
          <h1 className="inline">
            {formik.values["post_title"] || (
              <span className="text-red-500">TITLE REQUIRED</span>
            )}
          </h1>

          <button
            type="button"
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
                          required
                          onChange={formik.handleChange}
                          value={formik.values.post_title}
                        />
                      </div>

                      <div className="mb-5 col-span-6 sm:col-span-4">
                        <label
                          htmlFor="post_tags"
                          className="block text-sm font-medium leading-5 text-gray-700"
                        >
                          Tags (comma separated, e.g. React, JavaScript, Advice,
                          Reflections)
                        </label>
                        <input
                          name="post_tags"
                          placeholder="React, JavaScript, Advice, Reflections"
                          className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          required
                          onChange={formik.handleChange}
                          value={formik.values.post_tags}
                        />
                      </div>

                      <div className="mb-5 mt-4">
                        <div className="flex items-start">
                          <div className="absolute flex items-center h-5">
                            <input
                              name="post_isPublished"
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                              onChange={formik.handleChange}
                              checked={formik.values.post_isPublished}
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
                              onChange={formik.handleChange}
                              value={formik.values.post_canonical_url}
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
                  <div className="flex justify-center pb-5">
                    <button
                      type="button"
                      onClick={() =>
                        setIsShowingMarkdown(
                          isShowingPreview ? !isShowingMarkdown : true
                        )
                      }
                      className={`${
                        isShowingMarkdown ? "bg-gray-200" : "bg-white"
                      } relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"`}
                    >
                      Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setIsShowingPreview(
                          isShowingMarkdown ? !isShowingPreview : true
                        )
                      }
                      className={`${
                        isShowingPreview ? "bg-gray-200" : "bg-white"
                      } -ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                    >
                      Preview
                    </button>
                  </div>
                  <div className="flex rounded-md shadow-sm">
                    {isShowingMarkdown && (
                      <div className="flex-1">
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
                          width="100%"
                          height="600"
                          language="markdown"
                          theme="vs-dark"
                          value={formik.values.post_body}
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
                          onChange={post =>
                            formik.setFieldValue("post_body", post)
                          }
                        />
                      </div>
                    )}
                    {isShowingPreview && (
                      <iframe
                        className="flex-1"
                        // dangerouslySetInnerHTML={{ __html: markdownPreviewHTML }}
                        srcDoc={githubstyles + markdownPreviewHTML}
                      />
                    )}
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
            {NotificationElement}
            <button
              type="submit"
              disabled={submitState.status === "loading"}
              className={`${
                submitState.status === "loading"
                  ? "bg-gray-500"
                  : "bg-indigo-600 hover:bg-indigo-500"
              } inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs leading-4 font-medium rounded text-white focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150`}
            >
              {submitState.status === "loading" && (
                <half-circle-spinner size="12" className="pr-1" />
              )}
              Submit
            </button>
          </span>
        </div>

        {/* <div>
          {errors.exampleRequired && <span>This field is required</span>}
        </div> */}
      </form>
    </div>
  );
}

const githubstyles = `
<style>

.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #333;
  background: #f8f8f8;
}

.hljs-comment,
.hljs-quote {
  color: #998;
  font-style: italic;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-subst {
  color: #333;
  font-weight: bold;
}

.hljs-number,
.hljs-literal,
.hljs-variable,
.hljs-template-variable,
.hljs-tag .hljs-attr {
  color: #008080;
}

.hljs-string,
.hljs-doctag {
  color: #d14;
}

.hljs-title,
.hljs-section,
.hljs-selector-id {
  color: #900;
  font-weight: bold;
}

.hljs-subst {
  font-weight: normal;
}

.hljs-type,
.hljs-class .hljs-title {
  color: #458;
  font-weight: bold;
}

.hljs-tag,
.hljs-name,
.hljs-attribute {
  color: #000080;
  font-weight: normal;
}

.hljs-regexp,
.hljs-link {
  color: #009926;
}

.hljs-symbol,
.hljs-bullet {
  color: #990073;
}

.hljs-built_in,
.hljs-builtin-name {
  color: #0086b3;
}

.hljs-meta {
  color: #999;
  font-weight: bold;
}

.hljs-deletion {
  background: #fdd;
}

.hljs-addition {
  background: #dfd;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}
pre {
  background-color: #ccc;
  padding: 10px;
}
</style>
`;
