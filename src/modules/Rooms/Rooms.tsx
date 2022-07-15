import { Flex } from "@chakra-ui/react";
import { paths } from "@utils/paths";
import { trpc } from "@utils/trpc";
import Link from "next/link";
import { ReactElement } from "react";

export const Rooms = (): ReactElement => {
  const query = trpc.useQuery(["rooms.selectMyRooms", { skip: 0, take: 100 }]);

  return (
    <Flex flexDirection="column">
      {query.status === "success" &&
        query.data.map((room) => (
          <Link href={paths.room(room.id)} key={room.id}>
            {room.name}
          </Link>
        ))}
    </Flex>
  );
};
