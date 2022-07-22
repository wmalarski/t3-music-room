import { Spinner, StackDivider, VStack } from "@chakra-ui/react";
import { Pagination } from "@components/Pagination/Pagination";
import { ResultMessage } from "@components/ResultMessage/ResultMessage";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { ReactElement, useState } from "react";
import { messageCurrentReducer } from "./MessageList.utils";
import { MessageListItem } from "./MessageListItem/MessageListItem";

type Props = {
  room: Room;
};

export const MessageList = ({ room }: Props): ReactElement => {
  const [page, setPage] = useState(0);
  const take = 100;

  const query = trpc.proxy.messages.selectMessages.useQuery({
    roomId: room.id,
    skip: page * take,
    take,
  });

  if (query.status === "loading" || query.status === "idle") {
    return <Spinner />;
  }

  if (query.status === "error") {
    return <ResultMessage message={query.error.message} variant="error" />;
  }

  const [messages, maxSize] = query.data;

  if (messages.length <= 0) {
    return <ResultMessage variant="empty" />;
  }

  const reduced = messages.reduce(messageCurrentReducer, []);

  return (
    <VStack divider={<StackDivider />}>
      {reduced.map(({ message, status }) => (
        <MessageListItem
          isCurrent={status === "current"}
          key={message.id}
          message={message}
        />
      ))}
      <Pagination
        current={page}
        maxPage={Math.ceil(maxSize / take)}
        onChange={setPage}
      />
    </VStack>
  );
};
