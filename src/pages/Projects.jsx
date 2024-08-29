import { Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";

import Project from "../features/projects/Project";

import { useQueries, useQuery } from "@tanstack/react-query";
import { Loading } from "../components";
import { getCategories, getProjects } from "../lib/functions";

const Projects = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const { data: projects, isPending } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    select: (data) => {
      return data?.filter((project) => project?.isDeleted === false);
    },
  });

  const { data: projectIds } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    select: (data) => {
      return data?.map((project) => project?.id);
    },
  });

  useQueries({
    queries: projectIds
      ? projectIds?.map((projectId) => {
          return {
            queryKey: ["categories", projectId],
            queryFn: () => getCategories(projectId),
          };
        })
      : [],
  });

  if (isPending) return <Loading />;

  return (
    <>
      {projects?.length ? (
        <Flex
          direction="column"
          align="center"
          gap={5}
          sx={{
            px: { md: 5 },
          }}
        >
          {user && (
            <Heading
              sx={{
                fontWeight: "thin",
                fontSize: "32px",
                textAlign: "center",
                fontFamily: "open",
                alignSelf: "start",
                color: "gray.50",
                mt: 7,
                mb: 10,
              }}
            >
              Hi {user?.name} 👋
            </Heading>
          )}
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
    </>
  );
};

export default Projects;
