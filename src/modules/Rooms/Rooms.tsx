import { Flex } from "@chakra-ui/react";
import { paths } from "@utils/paths";
import { trpc } from "@utils/trpc";
import Link from "next/link";
import { ReactElement } from "react";
import { CreateRoomModal } from "./CreateRoomModal/CreateRoomModal";

export const Rooms = (): ReactElement => {
  const client = trpc.useContext();

  const query = trpc.useQuery(
    ["members.selectMyMembers", { skip: 0, take: 100 }],
    {
      onSuccess: ([data]) => {
        data.forEach((member) => {
          client.setQueryData(
            ["members.selectMemberByRoomId", { id: member.room.id }],
            member
          );
        });
      },
    }
  );

  return (
    <Flex flexDirection="column">
      {query.status === "success" &&
        query.data[0].map((member) => (
          <Link href={paths.room(member.room.id)} key={member.room.id}>
            {member.room.name}
          </Link>
        ))}
      <CreateRoomModal />
    </Flex>
  );
};
