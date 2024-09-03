import {
  Flex,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";
import Project from "../features/projects/Project";
import { BinTask, Loading } from "../components";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getCategories, getProjects } from "../lib/functions";
import { collection, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Task from "../features/tasks/Task";

const Bin = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const { data: projects, isPending } = useQuery({
    queryKey: ["bin", "projects"],
    queryFn: getProjects,
    select: (data) => {
      return data?.filter((project) => project?.isDeleted === true);
    },
  });

  const { data: projectIds } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    select: (data) => {
      return data?.map((project) => project?.id);
    },
  });

  const categoriesQueries = useQueries({
    queries: projectIds
      ? projectIds.map((projectId) => {
          return {
            queryKey: ["categories", projectId],
            queryFn: () => getCategories(projectId),
          };
        })
      : [],
  });

  const data = categoriesQueries?.map((query) => {
    return {
      ...query.data,
    };
  });

  const nonEmptyQueries = data
    ?.filter((category) => Object.keys(category).length !== 0)
    ?.map((item) => item);

  let tasks = [];
  nonEmptyQueries?.forEach((item, index) => {
    const values = Object.values(item);

    values?.forEach((item) => {
      tasks.push(...item?.tasks);
    });
  });

  const deletedTasks = tasks?.filter((task) => task?.isDeleted === true);

  if (isPending) return <Loading />;

  return (
    <>
      <Tabs variant="solid-rounded">
        <TabList>
          <Tab _selected={{ color: "gray.100", bg: "#7259C6" }}>Projects</Tab>
          <Tab _selected={{ color: "gray.100", bg: "#7259C6" }}>Tasks</Tab>
        </TabList>
        <TabPanels>
          <TabPanel pt={10}>
            {projects?.length > 0 ? (
              <Flex
                direction="column"
                align="center"
                width="100%"
                mx="auto"
                gap={5}
                mt={5}
                // mb={20}
              >
                <SimpleGrid
                  templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                  spacing={4}
                  width="100%"
                >
                  {projects?.map((project) => (
                    <Project item={project} key={project?.id} />
                  ))}
                </SimpleGrid>
              </Flex>
            ) : (
              <Text color="gray.50">No projects found</Text>
            )}
          </TabPanel>
          <TabPanel pt={10}>
            {deletedTasks?.length > 0 ? (
              <Wrap spacing={["10px", "40px"]}>
                {deletedTasks?.map((task) => {
                  return (
                    <WrapItem key={task?.id}>
                      <BinTask task={task} />
                    </WrapItem>
                  );
                })}
              </Wrap>
            ) : (
              <Text color="gray.50">No tasks found</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Bin;
