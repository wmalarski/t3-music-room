import { VStack } from "@chakra-ui/react";
import { ReactElement } from "react";
import { CreateRoomModal } from "./CreateRoomModal/CreateRoomModal";
import { RoomsList } from "./RoomsList/RoomsList";

export const Rooms = (): ReactElement => {
  return (
    <VStack>
      <RoomsList />
      <CreateRoomModal />
    </VStack>
  );
};
