import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { RoomForm, RoomFormValue } from "@modules/RoomForm/RoomForm";
import { Room } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

type Props = {
  room: Room;
};

export const RoomSettingsModal = ({ room }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "RoomSettingsModal" });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const client = trpc.useContext();

  const mutation = trpc.useMutation(["rooms.updateRoom"], {
    onSuccess: () => {
      client.invalidateQueries(["rooms.selectMyMembers"]);
      client.invalidateQueries(["rooms.selectMemberByRoomId", { id: room.id }]);
      onClose();
    },
  });

  const handleSubmit = (input: RoomFormValue) => {
    mutation.mutate({ ...input, id: room.id });
  };

  const handleClose = () => {
    if (mutation.isLoading) {
      return;
    }
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>{t("button")}</Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("header")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RoomForm
              initialValue={room}
              isLoading={mutation.isLoading}
              onSubmit={handleSubmit}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
