import { Flex, Text } from "@chakra-ui/react";
import React from "react";

const CreateTodo = () => {
  return (
    <Flex
      direction="row"
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        p: 3,
        bgColor: "#F8CA94",
        color: "#353535",
        borderRadius: "8px",
        cursor: "pointer",
        fontFamily: "josefin",
        fontWeight: "600",
        width: "95%",
        boxShadow: "lg",
      }}
    >
      <Text>New Item</Text>
    </Flex>
  );
};

export default CreateTodo;
