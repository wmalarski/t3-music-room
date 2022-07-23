import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RoomForm, RoomFormValue } from "@modules/RoomForm/RoomForm";
import { paths } from "@utils/paths";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ReactElement } from "react";

export const CreateRoomModal = (): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "CreateRoomModal" });

  const toast = useToast();

  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const client = trpc.useContext();

  const mutation = trpc.proxy.rooms.createRoom.useMutation({
    onSuccess: (data) => {
      client.invalidateQueries(["members.selectMyMembers"]);
      router.push(paths.room(data.room.id));
    },
    onError: (error) => {
      toast({
        title: t("error"),
        status: "error",
        description: error.message,
        isClosable: true,
      });
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
    <Box>
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
    </Box>
  );
};
