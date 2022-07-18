import { Button, HStack, Text } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { ReactElement } from "react";

type Props = {
  current: number;
  maxPage: number;
  onChange: (value: number) => void;
};

export const Pagination = ({
  current,
  maxPage,
  onChange,
}: Props): ReactElement => {
  const { t } = useTranslation("common", { keyPrefix: "Pagination" });

  const handlePrevClick = () => {
    onChange(current - 1);
  };

  const handleNextClick = () => {
    onChange(current + 1);
  };

  return (
    <HStack>
      <Button disabled={current < 1} onClick={handlePrevClick}>{`<`}</Button>
      <Text as="span">{t("of", { current: current + 1, max: maxPage })}</Text>
      <Button
        disabled={maxPage >= current + 1}
        onClick={handleNextClick}
      >{`>`}</Button>
    </HStack>
  );
};
