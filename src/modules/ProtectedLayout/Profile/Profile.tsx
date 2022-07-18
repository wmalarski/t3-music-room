import {
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
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import { ProfileForm, ProfileFormValue } from "./ProfileForm/ProfileForm";

export const Profile = (): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Profile" });

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const client = trpc.useContext();

  const query = trpc.proxy.user.selectUser.useQuery();

  const mutation = trpc.proxy.user.updateUser.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["user.selectUser"]);
      onClose();
      toast({
        title: t("updateSuccess"),
        status: "success",
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: t("updateError"),
        status: "error",
        description: error.message,
        isClosable: true,
      });
    },
  });

  const handleClose = () => {
    if (mutation.isLoading) {
      return;
    }
    onClose();
  };

  const handleSubmit = (value: ProfileFormValue) => {
    mutation.mutate(value);
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
            {query.status === "success" && (
              <ProfileForm
                isLoading={mutation.isLoading}
                onSubmit={handleSubmit}
                user={query.data}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
