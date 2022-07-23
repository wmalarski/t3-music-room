import { Box, useRadio, UseRadioProps } from "@chakra-ui/react";
import { ReactElement, ReactNode } from "react";

type Props = UseRadioProps & {
  children: ReactNode;
};

export const ToggleButton = (props: Props): ReactElement => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        borderRadius="md"
        borderWidth="1px"
        boxShadow="md"
        cursor="pointer"
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};
