import React from "react";

const header =
  process.env.NODE_ENV === "production"
    ? "https://dev-to-cms.now.sh"
    : "http://localhost:3000";

export default ({ apiKey }: { apiKey: string }) => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [err, setErr] = React.useState("");
  React.useEffect(() => {
    if (apiKey) {
      fetch(`${header}/api/devto`, {
        headers: {
          "api-key": apiKey
        }
      })
        .then(x => x.json())
        .then(x => {
          if (x.error) {
            setErr(x); // TODO: FIX THIS!! IN THE API ROUTE
          } else {
            setPosts(x);
          }
        });
    }
  }, [apiKey]);
  console.log({ posts });
  if (err) return <pre>{err}</pre>;
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul>
        {posts &&
          posts.map(post => {
            return (
              <li>
                <a
                  href="#"
                  className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
                >
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
                            {post.tag_list.map(tag => (
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
                              <time dateTime={post.published_at}>
                                {` ${post.published_at.slice(0, 10)}`}
                              </time>
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
              </li>
            );
          })}
      </ul>
    </div>
  );
};

type Post = {
  type_of: string;
  id: number;
  title: string;
  description: string;
  cover_image: string;
  published: true;
  published_at: string;
  tag_list: string[];
  slug: string;
  path: string;
  url: string;
  canonical_url: string;
  comments_count: number;
  positive_reactions_count: number;
  page_views_count: number;
  published_timestamp: string;
  body_markdown: string;
  user: {
    name: string;
    username: string;
    twitter_username: string;
    github_username: string;
    website_url: string;
    profile_image: string;
    profile_image_90: string;
  };
  organization: {
    name: string;
    username: string;
    slug: string;
    profile_image: string;
    profile_image_90: string;
  };
  flare_tag: {
    name: string;
    bg_color_hex: string;
    text_color_hex: string;
  };
};
