import { Flex } from "@chakra-ui/react";
import { paths } from "@utils/paths";
import { trpc } from "@utils/trpc";
import Link from "next/link";
import { ReactElement } from "react";
import { CreateRoomModal } from "./CreateRoomModal/CreateRoomModal";

export const Rooms = (): ReactElement => {
  const query = trpc.useQuery([
    "rooms.selectMyMemberships",
    { skip: 0, take: 100 },
  ]);

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
