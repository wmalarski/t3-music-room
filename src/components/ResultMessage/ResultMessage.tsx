import { Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

type Props = {
  message?: string;
  variant: "error" | "empty";
};

export const ResultMessage = ({ message, variant }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "ResultMessage" });

  return (
    <VStack>
      <Text>{t(variant)}</Text>
      {message && <Text>{message}</Text>}
    </VStack>
  );
};
