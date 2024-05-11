import { AxiosError, AxiosResponse } from "axios";
import { get } from "lodash";
import { showNotification } from "./notification";

export const showErrorNotification = (err: AxiosError) => {
  const message: string = get(err as object, "response.data.message")!;

  if (message) {
    showNotification("error", message);
    return;
  }

  if (!err || !err.response || !message) {
    showNotification("error", "Errors encountered.");
    return;
  }

  const { status } = err.response as AxiosResponse;

  if (+status == 401) {
    showNotification(
      "error",
      "You don't have permissions to perform this action."
    );
    return;
  }
};
