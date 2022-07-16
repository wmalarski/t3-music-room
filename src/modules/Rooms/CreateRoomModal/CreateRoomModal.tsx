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
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

export const CreateRoomModal = (): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "CreateRoomModal" });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const client = trpc.useContext();

  const mutation = trpc.useMutation(["rooms.createRoom"], {
    onSuccess: () => {
      client.invalidateQueries(["members.selectMyMembers"]);
      onClose();
    },
  });

  const handleSubmit = (input: RoomFormValue) => {
    mutation.mutate(input);
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
          <ModalBody pb={5}>
            <RoomForm isLoading={mutation.isLoading} onSubmit={handleSubmit} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
