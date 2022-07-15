import { Button, Flex } from "@chakra-ui/react";
import { InferMutationInput } from "@server/types";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

type Props = {
  id?: string;
  onChange: (
    input:
      | InferMutationInput<"rooms.createRoom">
      | InferMutationInput<"rooms.updateRoom">
  ) => void;
};

export const RoomForm = ({ id, onChange: onSubmit }: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "RoomForm" });

  const handleClick = () => {
    onSubmit({
      description: "description",
      name: "name",
      id,
    });
  };

  return (
    <Flex>
      <Button onClick={handleClick}>{t("button")}</Button>
    </Flex>
  );
};
