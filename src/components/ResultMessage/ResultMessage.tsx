import { Heading, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

type Props = {
  message?: string;
  variant: "error" | "empty";
};

export const ResultMessage = ({ message, variant }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "ResultMessage" });

  return (
    <VStack
      bgColor="white"
      h="lg"
      justifyContent="center"
      rounded="md"
      w="full"
    >
      <Heading size="lg">{t(variant)}</Heading>
      {message && <Text>{message}</Text>}
    </VStack>
  );
};
