import { Flex } from "@chakra-ui/react";
import React from "react";
import Task from "./Task";

const Tasks = ({ tasks, categoryId }) => {
  return (
    <Flex direction="column" width="300px">
      {/* Task */}
      {tasks?.map((task) => (
        <Task task={task} key={task?.createdAt} categoryId={categoryId} />
      ))}
    </Flex>
  );
};

export default Tasks;
