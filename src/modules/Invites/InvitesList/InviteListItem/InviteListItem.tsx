import { HStack, Text } from "@chakra-ui/react";
import { Invite } from "@prisma/client";
import { ReactElement } from "react";
import { AcceptInvite } from "./AcceptInvite/AcceptInvite";
import { RejectInvite } from "./RejectInvite/RejectInvite";

type Props = {
  invite: Invite;
};

export const InviteListItem = ({ invite }: Props): ReactElement => {
  return (
    <HStack>
      <Text>{invite.email}</Text>
      <AcceptInvite invite={invite} />
      <RejectInvite invite={invite} />
    </HStack>
  );
};
