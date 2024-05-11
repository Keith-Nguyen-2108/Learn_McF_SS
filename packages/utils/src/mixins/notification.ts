import { notification } from "ant-design-vue";

type NotificationType = "success" | "info" | "warning" | "error";

type messageType = {
  message: string;
  description: string;
};

export const showNotification = (
  type: NotificationType = "error",
  inforMessage: string | messageType
) => {
  if (typeof inforMessage == "string") {
    notification[type]({
      message: inforMessage,
    });
  } else {
    const { message, description } = inforMessage;
    notification[type]({
      message: message || "",
      description: description || "",
    });
  }
};
