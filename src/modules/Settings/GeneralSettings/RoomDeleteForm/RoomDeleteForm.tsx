import { Button } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

type Props = {
  isLoading: boolean;
  onSubmit: () => void;
};

export const RoomDeleteForm = ({
  onSubmit,
  isLoading,
}: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "RoomDeleteForm" });

  return (
    <Button colorScheme="red" isLoading={isLoading} onClick={onSubmit}>
      {t("submit")}
    </Button>
  );
};
