import { Message, User } from "@prisma/client";

type MessageReducer = {
  message: Message & { user: User };
  status: "ended" | "current" | "next";
};

export const messageCurrentReducer = (
  prev: MessageReducer[],
  curr: MessageReducer["message"]
): MessageReducer[] => {
  const last = prev.length > 0 ? prev[prev.length - 1] : null;

  switch (last?.status) {
    case "next":
    case "current": {
      prev.push({
        message: curr,
        status: "next",
      });
      break;
    }
    default:
      prev.push({
        message: curr,
        status: curr.endedAt ? "ended" : "current",
      });
  }

  return prev;
};
