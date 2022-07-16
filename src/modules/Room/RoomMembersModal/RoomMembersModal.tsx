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
import { MembersList } from "./MembersList/MembersList";

type Props = {
  room: Room;
};

export const RoomMembersModal = ({ room }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "RoomMembersModal" });

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>{t("button")}</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("header")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <MembersList room={room} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
