import { Flex } from "@chakra-ui/react";
import React from "react";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";

const Tasks = ({ tasks, categoryId }) => {
  return (
    <Droppable droppableId={categoryId.toString()}>
      {(provided) => (
        <Flex
          ref={provided.innerRef}
          {...provided.droppableProps}
          direction="column"
          width="300px"
          minHeight="100px"
        >
          {tasks?.map((task, index) => (
            <Task
              task={task}
              key={task?.id}
              categoryId={categoryId}
              index={index}
            />
          ))}
          {provided.placeholder}
        </Flex>
      )}
    </Droppable>
  );
};

export default Tasks;
