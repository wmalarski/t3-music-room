import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { RoomForm } from "@modules/RoomForm/RoomForm";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

export const CreateRoomModal = (): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "CreateRoomModal" });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const mutation = trpc.useMutation(["rooms.createRoom"]);

  const [input, setInput] = useState({});

  // const handleChange = (input: InferMutationInput<"rooms.createRoom">) => {
  //   mutation.mutate(input);
  // };

  return (
    <>
      <Button onClick={onOpen}>{t("button")}</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("header")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RoomForm onChange={setInput} />
          </ModalBody>
          <ModalFooter>
            <Button isLoading={mutation.isLoading} variant="ghost">
              {t("submit")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
