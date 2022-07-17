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
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import { ProfileForm, ProfileFormValue } from "./ProfileForm/ProfileForm";

export const Profile = (): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Profile" });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const client = trpc.useContext();

  const userQuery = trpc.proxy.user.selectUser.useQuery();

  const mutation = trpc.proxy.user.updateUser.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["user.selectUser"]);
      onClose();
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
            {userQuery.status === "success" && (
              <ProfileForm
                isLoading={mutation.isLoading}
                onSubmit={handleSubmit}
                user={userQuery.data}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
