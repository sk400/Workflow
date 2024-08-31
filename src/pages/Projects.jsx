import { Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";

import Project from "../features/projects/Project";

import { useQueries, useQuery } from "@tanstack/react-query";
import { Loading } from "../components";
import {
  fetchLabel,
  getCategories,
  getLabels,
  getProjects,
} from "../lib/functions";
import { doc } from "firebase/firestore";
import { db } from "../firebase";

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

  // Prefetching labels

  useQuery({
    queryKey: ["labels"],
    queryFn: getLabels,
  });

  // Prefetching categories

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

  // Prefetching bin projects

  useQuery({
    queryKey: ["bin", "projects"],
    queryFn: getProjects,
  });

  const { data: labelIds } = useQuery({
    queryKey: ["labels"],
    queryFn: getLabels,
    select: (data) => {
      return data?.map((label) => label?.id);
    },
  });

  // Prefetching label detail for populating label in tasks

  useQueries({
    queries: labelIds
      ? labelIds?.map((labelId) => {
          return {
            queryKey: ["labels", labelId],
            queryFn: () =>
              fetchLabel(doc(db, "users", user?.email, "labels", labelId)),
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
                display: { md: "none" },
              }}
            >
              Hi {user?.name} 👋
            </Heading>
          )}
          <SimpleGrid
            templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            spacing={4}
            width="100%"
            sx={{ mt: { md: 5 } }}
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
