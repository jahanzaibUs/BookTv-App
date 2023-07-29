import React from "react";
import { VStack } from "native-base";

interface ListProps {
  children: JSX.Element[] | JSX.Element;
}

const List = ({ children, ...props }: ListProps) => {
  return (
    <VStack
      _light={{ bg: "white" }}
      _dark={{ bg: "coolGray.700" }}
      borderRadius={12}
      {...props}
    >
      {children}
    </VStack>
  );
};

export default List;
