import { Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { Message } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";
import { EndMessage } from "./EndMessage/EndMessage";

type Props = {
  message: Message;
};

export const MessagePlayer = ({ message }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "MessagePlayer" });

  return (
    <VStack>
      <Heading as="h3" size="md">
        {t("title")}
      </Heading>
      <HStack>
        <Text fontSize="lg">{message.data}</Text>
        <EndMessage message={message} />
      </HStack>
    </VStack>
  );
};
