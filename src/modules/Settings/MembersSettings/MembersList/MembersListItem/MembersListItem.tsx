import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";
import { Member, User } from "@prisma/client";
import { ReactElement } from "react";
import { DeleteMemberButton } from "./DeleteMemberButton/DeleteMemberButton";

type Props = {
  userMember: Member;
  member: Member & { user: User };
};

export const MembersListItem = ({
  userMember,
  member,
}: Props): ReactElement => {
  return (
    <HStack>
      <Avatar
        name={member.user.name ?? undefined}
        src={member.user.image ?? undefined}
      />
      <VStack>
        <Text>{member.user.name}</Text>
        <Text>{member.user.email}</Text>
      </VStack>
      <DeleteMemberButton member={member} userMember={userMember} />
    </HStack>
  );
};
