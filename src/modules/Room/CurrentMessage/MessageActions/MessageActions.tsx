import { HStack, useRadioGroup, useToast } from "@chakra-ui/react";
import { ToggleButton } from "@components/ToggleButton/ToggleButton";
import { Action, Message } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

type Props = {
  message: Message & { actions: Action[] };
};

export const MessageActions = ({ message }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "MessageActions" });

  const toast = useToast();

  const client = trpc.useContext();

  const mutation = trpc.proxy.messages.reactToMessage.useMutation({
    onSuccess: () => {
      client.invalidateQueries(["messages.selectCurrentMessage"]);
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

  const handleChange = (next: "like" | "dislike") => {
    mutation.mutate({
      id: message.id,
      reaction: next,
    });
  };

  const action = message.actions[0];

  const value = action?.likeAt
    ? "like"
    : action?.dislikeAt
    ? "dislike"
    : undefined;

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "reaction",
    value,
    onChange: handleChange,
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      <ToggleButton
        isDisabled={mutation.isLoading}
        {...getRadioProps({ value: "like" })}
      >
        {t("like")}
      </ToggleButton>
      <ToggleButton
        isDisabled={mutation.isLoading}
        {...getRadioProps({ value: "dislike" })}
      >
        {t("dislike")}
      </ToggleButton>
    </HStack>
  );
};
