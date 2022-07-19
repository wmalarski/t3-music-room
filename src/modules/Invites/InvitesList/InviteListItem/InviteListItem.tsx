import { HStack, Text } from "@chakra-ui/react";
import { Invite } from "@prisma/client";
import { ReactElement } from "react";

type Props = {
  invite: Invite;
};

export const InviteListItem = ({ invite }: Props): ReactElement => {
  return (
    <HStack>
      <Text>{invite.email}</Text>
    </HStack>
  );
};
