import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";
import { Message, User } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import { DeleteMessage } from "./DeleteMessage/DeleteMessage";

type Props = {
  message: Message & { user: User };
  isCurrent: boolean;
};

export const MessageListItem = ({
  message,
  isCurrent,
}: Props): ReactElement => {
  const { i18n } = useTranslation("common", { keyPrefix: "MessageListItem" });

  return (
    <HStack borderWidth={isCurrent ? 1 : 0}>
      <Avatar
        name={message.user.name ?? undefined}
        src={message.user.image ?? undefined}
      />
      <VStack>
        <Text fontSize="xl">{message.data}</Text>
        <Text>{message.user.name}</Text>
        {message.endedAt && (
          <Text>
            {Intl.DateTimeFormat(i18n.language).format(message.endedAt)}
          </Text>
        )}
      </VStack>
      {!message.endedAt && <DeleteMessage message={message} />}
    </HStack>
  );
};
