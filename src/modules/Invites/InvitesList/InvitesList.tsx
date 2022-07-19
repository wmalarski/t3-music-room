import { Spinner, StackDivider, VStack } from "@chakra-ui/react";
import { Pagination } from "@components/Pagination/Pagination";
import { ResultMessage } from "@components/ResultMessage/ResultMessage";
import { trpc } from "@utils/trpc";
import { ReactElement, useState } from "react";
import { InviteListItem } from "./InviteListItem/InviteListItem";

export const InviteList = (): ReactElement => {
  const [page, setPage] = useState(0);
  const take = 10;

  const query = trpc.proxy.invites.selectUserInvites.useQuery({
    skip: page * take,
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
      {invites.map((invite) => (
        <InviteListItem invite={invite} key={invite.id} />
      ))}
      <Pagination
        current={page}
        maxPage={Math.ceil(maxSize / take)}
        onChange={setPage}
      />
    </VStack>
  );
};
