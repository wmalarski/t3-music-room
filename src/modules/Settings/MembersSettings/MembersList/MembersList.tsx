import { Box, StackDivider, VStack } from "@chakra-ui/react";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { ReactElement } from "react";

type Props = {
  room: Room;
};

export const MembersList = ({ room }: Props): ReactElement => {
  const query = trpc.proxy.members.selectRoomMembers.useQuery({
    roomId: room.id,
    skip: 0,
    take: 100,
  });

  return (
    <VStack divider={<StackDivider />}>
      {query.status === "success" &&
        query.data.map((member) => (
          <Box key={member.id}>{member.user.name}</Box>
        ))}
    </VStack>
  );
};
