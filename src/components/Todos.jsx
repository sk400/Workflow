import { Flex, Heading } from "@chakra-ui/react";
import React from "react";
import Todo from "./Todo";

const Todos = ({ priority }) => {
  return (
    <Flex
      direction="column"
      align="center"
      width="95%"
      bgColor="#FAA136"
      borderRadius={8}
      p={5}
      gap={3}
      boxShadow={"lg"}
    >
      <Heading as="h4" size="md" mb="5">
        {priority} Priority Tasks
      </Heading>
      <Flex
        sx={{
          flexDirection: "column",
          gap: 3,
          p: 3,
          width: "100%",
          // alignItems: "center",
          bgColor: "#FEFFDF",
          borderRadius: "8px",
          maxHeight: "250px",
          overflowY: "auto",
        }}
      >
        <Todo />
        <Todo />
        <Todo />
      </Flex>
    </Flex>
  );
};

export default Todos;
