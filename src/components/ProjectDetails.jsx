import { Center, Flex, Heading } from "@chakra-ui/react";

import CreateTodo from "./CreateTodo";

import { useGlobalState } from "../context";
import { useParams } from "react-router-dom";

import { useGetRealtimeTasks } from "../lib/customHooks";
import Todos from "./Todos";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { projects } = useGlobalState();

  const user = JSON.parse(localStorage.getItem("user"));

  const [data, loading] = useGetRealtimeTasks(user, projectId);

  const currentProject = projects?.find((project) => project?.id === projectId);

  if (loading) return "Loading....";

  const highPriorityTasks = data?.filter((task) => task?.priority === "high");
  const mediumPriorityTasks = data?.filter(
    (task) => task?.priority === "medium"
  );
  const lowPriorityTasks = data?.filter((task) => task?.priority === "low");

  return (
    <Flex direction="column" align="center" width="100%" gap={5} pb={10}>
      <Center>
        <Heading
          sx={{
            fontWeight: "semibold",
            fontSize: "32px",
            textAlign: "center",
            fontFamily: "open",
            my: 5,
          }}
        >
          {currentProject?.name}
        </Heading>
      </Center>
      <Flex
        direction="column"
        align="center"
        width="100%"
        gap={5}
        my={10}
        // mb={20}
      >
        {/* Create new item */}
        <CreateTodo />

        {/* Routes */}
      </Flex>
      {/* High Priority items */}

      {highPriorityTasks?.length !== 0 && (
        <Todos priority="High" todos={highPriorityTasks} />
      )}

      {/* Medium Priority items */}

      {mediumPriorityTasks?.length !== 0 && (
        <Todos priority="Medium" todos={mediumPriorityTasks} />
      )}

      {/* Low Priority items */}

      {lowPriorityTasks?.length !== 0 && (
        <Todos priority="Low" todos={lowPriorityTasks} />
      )}
    </Flex>
  );
};

export default ProjectDetails;
