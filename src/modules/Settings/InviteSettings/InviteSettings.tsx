import { Heading, VStack } from "@chakra-ui/react";
import { Room } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import { CreateInvite } from "./CreateInvite/CreateInvite";
import { InviteList } from "./InviteList/InviteList";

type Props = {
  room: Room;
};

export const InviteSettings = ({ room }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "InviteSettings" });

  return (
    <VStack>
      <Heading as="h3">{t("heading")}</Heading>
      <CreateInvite room={room} />
      <InviteList room={room} />
    </VStack>
  );
};
