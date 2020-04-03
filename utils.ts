// https://www.tjvantoll.com/2015/09/13/fetch-and-errors/

import { useNotification } from "./components/Notification";

type RT = ReturnType<typeof useNotification>;
export const handleErrors = (
  postNotification: RT["postNotification"]
) => async (response: Response) => {
  if (!response.ok) {
    const err = Error(await response.text());
    err.name = response.statusText;
    console.log("about to post", err);
    postNotification({
      type: "error",
      message: err.message,
      title: err.name
    });
    throw err;
  }
  return response;
};

export function safeStringArr(arg?: string | string[]): string[] {
  if (!arg) return [];
  return Array.isArray(arg) ? arg : arg.split(",").map(x => x.trim());
}
