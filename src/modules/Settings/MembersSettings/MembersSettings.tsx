import { Heading, VStack } from "@chakra-ui/react";
import { Member, Room } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import { MembersList } from "../../Settings/MembersSettings/MembersList/MembersList";

type Props = {
  room: Room;
  userMember: Member;
};

export const MembersSettings = ({ room, userMember }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "MembersSettings" });

  return (
    <VStack>
      <Heading as="h3">{t("heading")}</Heading>
      <MembersList room={room} userMember={userMember} />
    </VStack>
  );
};
