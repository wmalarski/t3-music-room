import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { InferMutationInput } from "@server/types";
import { useTranslation } from "next-i18next";
import { ChangeEvent, ReactElement, useState } from "react";

export type RoomFormValue =
  | InferMutationInput<"rooms.createRoom">
  | InferMutationInput<"rooms.updateRoom">;

type Props = {
  id?: string;
  isLoading: boolean;
  onSubmit: (input: RoomFormValue) => void;
};

export const RoomForm = ({
  id,
  onSubmit: onSubmit,
  isLoading,
}: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "RoomForm" });

  const [value, setValue] = useState<RoomFormValue>({
    description: "",
    name: "",
    id,
  });

  const handleClick = () => {
    onSubmit(value);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((current) => ({ ...current, name: event.target.value }));
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((current) => ({ ...current, description: event.target.value }));
  };

  return (
    <Flex flexDirection="column">
      <FormControl>
        <FormLabel htmlFor="name">{t("name")}</FormLabel>
        <Input id="name" onChange={handleNameChange} value={value.name} />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="description">{t("description")}</FormLabel>
        <Input
          id="description"
          onChange={handleDescriptionChange}
          value={value.description}
        />
      </FormControl>
      <Button isLoading={isLoading} onClick={handleClick}>
        {t("button")}
      </Button>
    </Flex>
  );
};
