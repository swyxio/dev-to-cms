// https://www.tjvantoll.com/2015/09/13/fetch-and-errors/

import { useNotification } from "./components/Notification";
import {
  OneGraphError,
  CreateArticleResponse
} from "./components/OneGraphController";

type RT = ReturnType<typeof useNotification>;
export const handleErrors = (
  postNotification: RT["postNotification"]
) => async (response: {
  errors: OneGraphError[];
  data: CreateArticleResponse;
}) => {
  if (response.errors) {
    postNotification({
      type: "error",
      message: response.errors.map(x => x.message).join("\n\n"),
      title: "Error"
    });
    throw response.errors;
  }
  return response.data;
};

export function safeStringArr(arg?: string | string[]): string[] {
  if (!arg) return [];
  return Array.isArray(arg) ? arg : arg.split(",").map(x => x.trim());
}
