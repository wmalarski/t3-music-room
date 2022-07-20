import { Spinner, VStack } from "@chakra-ui/react";
import { Pagination } from "@components/Pagination/Pagination";
import { ResultMessage } from "@components/ResultMessage/ResultMessage";
import { paths } from "@utils/paths";
import { trpc } from "@utils/trpc";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { CreateRoomModal } from "./CreateRoomModal/CreateRoomModal";

export const Rooms = (): ReactElement => {
  const [page, setPage] = useState(0);
  const take = 100;

  const client = trpc.useContext();

  const query = trpc.proxy.members.selectMyMembers.useQuery(
    { skip: page * take, take },
    {
      onSuccess: ([data]) => {
        data.forEach((member) => {
          client.setQueryData(
            ["members.selectMemberByRoomId", { roomId: member.room.id }],
            member
          );
        });
      },
    }
  );

  if (query.status === "loading" || query.status === "idle") {
    return <Spinner />;
  }

  if (query.status === "error") {
    return <ResultMessage message={query.error.message} variant="error" />;
  }

  const [members, maxSize] = query.data;

  if (members.length <= 0) {
    return <ResultMessage variant="empty" />;
  }

  return (
    <VStack>
      {members.map((member) => (
        <Link href={paths.room(member.room.id)} key={member.room.id}>
          {member.room.name}
        </Link>
      ))}
      <Pagination
        current={page}
        maxPage={Math.ceil(maxSize / take)}
        onChange={setPage}
      />
      <CreateRoomModal />
    </VStack>
  );
};
