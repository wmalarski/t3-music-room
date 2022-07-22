import { Box, Spinner, VStack } from "@chakra-ui/react";
import { Pagination } from "@components/Pagination/Pagination";
import { ResultMessage } from "@components/ResultMessage/ResultMessage";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { ReactElement, useState } from "react";

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

  return (
    <VStack>
      {messages.map((message) => (
        <Box key={message.id}>
          <pre>{JSON.stringify(message, null, 2)}</pre>
        </Box>
      ))}
      <Pagination
        current={page}
        maxPage={Math.ceil(maxSize / take)}
        onChange={setPage}
      />
    </VStack>
  );
};
