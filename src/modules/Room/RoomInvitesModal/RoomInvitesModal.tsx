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
import { Room } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import { CreateInviteForm } from "./CreateInviteForm/CreateInviteForm";

type Props = {
  room: Room;
};

export const RoomInvitesModal = ({ room }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "RoomInvitesModal" });

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>{t("button")}</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("header")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" gap={5} pb={5}>
            <CreateInviteForm room={room} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
