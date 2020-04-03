/*
Add these to your `package.json`:
  "onegraph-auth": "2.1.0"
*/

import OneGraphAuth from "onegraph-auth";

const header =
  process.env.NODE_ENV === "production"
    ? "https://dev-to-cms.now.sh"
    : "http://localhost:3000";

let auth;
if (typeof window !== "undefined") {
  auth = new OneGraphAuth({
    appId: "1bbf3448-3c24-4480-a58a-66811879d5df"
  });
}

// This setup is only needed once per application
async function fetchOneGraph(operationsDoc, operationName, variables) {
  const result = await fetch(`${header}/api/onegraph`, {
    method: "POST",
    headers: {
      ...auth.authHeaders()
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName
    })
  });

  return await result.json();
}

const operationsDoc = `
  query MyArticlesQuery {
    me {
      devTo {
        isLoggedIn
        articles {
          edges {
            node {
              title
              publishedAt
              tags
              user {
                profileImage90
              }
              id
              positiveReactionsCount
            }
          }
        }
      }
    }
  }
  
  mutation CreateArticleMutation(
    $apikey: String!
    $article: DevToArticleCreateArticleArg!
  ) {
    devTo(auths: { devToAuth: { apiKey: $apikey } }) {
      createArticle(input: { article:$article}) {
        article {
          id
        }
      }
    }
  }

`;

function fetchMyArticlesQuery() {
  return fetchOneGraph(operationsDoc, "MyArticlesQuery", {});
}

export function executeCreateArticleMutation(
  apikey,
  article
): Promise<{ errors: OneGraphError[]; data: CreateArticleResponse }> {
  return fetchOneGraph(operationsDoc, "CreateArticleMutation", {
    apikey: apikey,
    article: article
  });
}

export async function fetchArticles() {
  try {
    const { errors, data } = (await fetchMyArticlesQuery()) as {
      errors: OneGraphError[];
      data: OneGraphData;
    };

    const serviceName = auth.findMissingAuthServices(errors)[0];

    if (serviceName) {
      // Automatic progressive authentication!
      // -------------------------------------
      // If we detected missing auth in the last call, then
      // ask the user to log into the missing service
      // to complete our query/mutation.
      // Note: that this will open a popup window, so it
      // should really only be called in response to a user action
      // (like the onClick handler for a login button)
      console.warn("Missing auth for service:", serviceName);
      await auth.login(serviceName);
    } else if (errors) {
      // handle errors from OneGraph and various APIs
      console.error(errors);
    }

    // do something great with this precious data
    return { errors, data };
  } catch (fetchError) {
    // Handle fetch errors
    console.error("fetchError: ", fetchError);
  }
}

export interface CreateArticleResponse {
  devTo: CreateArticleDevTo;
}

export interface CreateArticleDevTo {
  createArticle: CreateArticle;
}

export interface CreateArticle {
  article: Article;
}

export interface Article {
  id: number;
}

export interface OneGraphError {
  message: string;
  path: string[];
  extensions: Extensions;
}

export interface Extensions {
  service: string;
  upstream: Upstream;
  type: string;
  traceId: string;
}

export interface Upstream {
  error: string;
  status: number;
}

export interface OneGraphData {
  me: Me;
}

export interface Me {
  devTo: DevTo;
}

export interface DevTo {
  isLoggedIn: boolean;
  articles: Articles;
}

export interface Articles {
  edges: Edge[];
}

export interface Edge {
  node: Node;
}

export interface Node {
  title: string;
  publishedAt: Date | null;
  tags: null;
  user: {
    profileImage90: string;
  };
  id: number;
  positiveReactionsCount: number;
}
