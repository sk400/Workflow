import { Flex, Text } from "@chakra-ui/react";
import React from "react";

const CreateProject = () => {
  return (
    <Flex
      direction="row"
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        p: 3,
        bgColor: "#D1C69E",
        color: "white",
        borderRadius: "8px",
        cursor: "pointer",
        boxShadow: "lg",
      }}
    >
      <Text sx={{ fontFamily: "josefin" }}>New project</Text>
    </Flex>
  );
};

export default CreateProject;
