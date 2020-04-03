import React from "react";
import { Post } from "../types";
import Link from "next/link";
import { useQuery } from "react-query";
import { safeStringArr } from "../utils";
const header =
  process.env.NODE_ENV === "production"
    ? "https://dev-to-cms.now.sh"
    : "http://localhost:3000";

export default ({ apiKey }: { apiKey: string }) => {
  const { status, data: posts, error: err } = useQuery(
    "postsList",
    () =>
      fetch(`${header}/api/devto`, {
        headers: {
          "api-key": apiKey
        }
      }).then(x => x.json()),
    {
      staleTime: 1000 * 10 * 60 // 10 mins
    }
  );
  if (status === "loading")
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        loading
      </div>
    );
  if (err) return <pre>{err}</pre>;
  console.log({ posts });
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul>
        {posts &&
          posts.map((post: Post) => {
            return (
              <li>
                <Link href={`/editor/${post.id}`}>
                  <a className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-full"
                            src={post.user.profile_image_90}
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <div className="text-sm leading-5 font-medium text-indigo-600 truncate">
                              {post.title}
                            </div>
                            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
                              {safeStringArr(post.tag_list).map(tag => (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium leading-4 bg-gray-100 text-gray-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="hidden md:block">
                            <div>
                              <div className="text-sm leading-5 text-gray-900">
                                Published:
                                {post.published_at ? (
                                  <time dateTime={post.published_at}>
                                    {` ${post.published_at.slice(0, 10)}`}
                                  </time>
                                ) : (
                                  <span>No</span>
                                )}
                              </div>
                              <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                                <span>Views {post.page_views_count}</span>
                                <span>
                                  Reactions {post.positive_reactions_count}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
