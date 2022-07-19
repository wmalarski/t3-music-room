import { Spinner, StackDivider, VStack } from "@chakra-ui/react";
import { Pagination } from "@components/Pagination/Pagination";
import { ResultMessage } from "@components/ResultMessage/ResultMessage";
import { Member, Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { ReactElement, useState } from "react";
import { MembersListItem } from "./MembersListItem/MembersListItem";

type Props = {
  room: Room;
  userMember: Member;
};

export const MembersList = ({ room, userMember }: Props): ReactElement => {
  const [page, setPage] = useState(0);
  const take = 10;

  const query = trpc.proxy.members.selectRoomMembers.useQuery({
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

  const [invites, maxSize] = query.data;

  if (invites.length <= 0) {
    return <ResultMessage variant="empty" />;
  }

  return (
    <VStack divider={<StackDivider />}>
      {invites.map((member) => (
        <MembersListItem
          key={member.id}
          member={member}
          userMember={userMember}
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
