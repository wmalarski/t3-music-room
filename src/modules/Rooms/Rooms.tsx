import { Heading, HStack, VStack } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import { CreateRoomModal } from "./CreateRoomModal/CreateRoomModal";
import { RoomsList } from "./RoomsList/RoomsList";

export const Rooms = (): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Rooms" });

  return (
    <VStack>
      <HStack
        alignItems="center"
        gap={2}
        justifyContent="flex-start"
        p={2}
        w="full"
      >
        <Heading size="lg">{t("title")}</Heading>
        <CreateRoomModal />
      </HStack>
      <RoomsList />
    </VStack>
  );
};
