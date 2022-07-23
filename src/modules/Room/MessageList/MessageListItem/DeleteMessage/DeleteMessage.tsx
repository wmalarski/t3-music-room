import { Button, useToast } from "@chakra-ui/react";
import { Message } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

type Props = {
  message: Message;
};

export const DeleteMessage = ({ message }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "DeleteMessage" });

  const toast = useToast();

  const client = trpc.useContext();

  const mutation = trpc.proxy.messages.deleteMessage.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["messages.selectMessages"]);
      client.invalidateQueries(["messages.selectCurrentMessage"]);
    },
    onError: (error) => {
      toast({
        title: t("deleteError"),
        status: "error",
        description: error.message,
        isClosable: true,
      });
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ id: message.id });
  };

  return (
    <Button isLoading={mutation.isLoading} onClick={handleSubmit}>
      {t("remove")}
    </Button>
  );
};
