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
import { paths } from "@utils/paths";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { RoomDeleteForm } from "./RoomDeleteForm/RoomDeleteForm";

type Props = {
  room: Room;
};

export const RoomSettingsModal = ({ room }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "RoomSettingsModal" });

  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const client = trpc.useContext();

  const updateMutation = trpc.useMutation(["rooms.updateRoom"], {
    onSuccess: () => {
      client.invalidateQueries(["rooms.selectMyMembers"]);
      client.invalidateQueries(["rooms.selectMemberByRoomId", { id: room.id }]);
      onClose();
    },
  });

  const deleteMutation = trpc.useMutation(["rooms.deleteRoom"], {
    onSuccess: () => {
      client.invalidateQueries(["rooms.selectMyMembers"]);
      router.replace(paths.index());
      onClose();
    },
  });

  const handleUpdateSubmit = (input: RoomFormValue) => {
    updateMutation.mutate({ ...input, id: room.id });
  };

  const handleDeleteSubmit = () => {
    deleteMutation.mutate({ id: room.id });
  };

  const handleClose = () => {
    if (updateMutation.isLoading || deleteMutation.isLoading) {
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
          <ModalBody display="flex" flexDirection="column" gap={5} pb={5}>
            <RoomForm
              initialValue={room}
              isLoading={updateMutation.isLoading}
              onSubmit={handleUpdateSubmit}
            />
            <RoomDeleteForm
              isLoading={deleteMutation.isLoading}
              onSubmit={handleDeleteSubmit}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
