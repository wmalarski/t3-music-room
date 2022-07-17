import { VStack } from "@chakra-ui/react";
import { Room } from "@prisma/client";
import { ReactElement } from "react";
import { MembersList } from "../../Settings/MembersSettings/MembersList/MembersList";

type Props = {
  room: Room;
};

export const MembersSettings = ({ room }: Props): ReactElement => {
  return (
    <VStack>
      <MembersList room={room} />
    </VStack>
  );
};
