import { Flex } from "@chakra-ui/react";
import React from "react";
import Task from "./Task";

const Tasks = () => {
  return (
    <Flex direction="column" width="300px">
      {/* Task */}
      <Task />
    </Flex>
  );
};

export default Tasks;
