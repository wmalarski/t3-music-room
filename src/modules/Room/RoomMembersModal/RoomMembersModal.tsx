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
import { CreateMemberForm } from "./CreateMemberForm/CreateMemberForm";
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
          <ModalBody display="flex" flexDirection="column" gap={5} pb={5}>
            <CreateMemberForm room={room} />
            <MembersList room={room} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
