import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { ChangeEvent, ReactElement, useState } from "react";

export type RoomFormValue = {
  name: string;
  description: string;
};

type Props = {
  isLoading: boolean;
  initialValue?: RoomFormValue;
  onSubmit: (input: RoomFormValue) => void;
};

export const RoomForm = ({
  initialValue,
  onSubmit,
  isLoading,
}: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "RoomForm" });

  const [value, setValue] = useState<RoomFormValue>({
    description: initialValue?.description || "",
    name: initialValue?.name || "",
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
    <Flex flexDirection="column" gap={5}>
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
        {t("submit")}
      </Button>
    </Flex>
  );
};
