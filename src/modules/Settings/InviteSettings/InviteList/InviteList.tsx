import { Box, Spinner, StackDivider, VStack } from "@chakra-ui/react";
import { Pagination } from "@components/Pagination/Pagination";
import { ResultMessage } from "@components/ResultMessage/ResultMessage";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { ReactElement, useState } from "react";

type Props = {
  room: Room;
};

export const InviteList = ({ room }: Props): ReactElement => {
  const [page, setPage] = useState(0);
  const take = 10;

  const query = trpc.proxy.invites.selectInvites.useQuery({
    roomId: room.id,
    skip: 0,
    take,
  });

  if (query.status === "loading" || query.status === "idle") {
    return <Spinner />;
  }

  if (query.status === "error") {
    return <ResultMessage message={query.error.message} variant="error" />;
  }

  const [invites, maxSize] = query.data;

  if (invites.length <= 0) {
    return <ResultMessage variant="empty" />;
  }

  return (
    <VStack divider={<StackDivider />}>
      {query.data[0].map((member) => (
        <Box key={member.id}>{member.user.name}</Box>
      ))}
      <Pagination
        current={page}
        maxPage={Math.ceil(maxSize / take)}
        onChange={setPage}
      />
    </VStack>
  );
};
