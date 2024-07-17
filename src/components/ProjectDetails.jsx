import { Flex } from "@chakra-ui/react";
import React from "react";
import Todos from "./Todos";

const ProjectDetails = () => {
  return (
    <Flex
      direction="column"
      align="center"
      width="100%"
      gap={5}
      //   my={10}
      // mb={20}
    >
      {/* High Priority items */}
      <Todos priority="High" />
      {/* Medium Priority items */}
      <Todos priority="Medium" />
      {/* Low Priority items */}
      <Todos priority="Low" />
    </Flex>
  );
};

export default ProjectDetails;
