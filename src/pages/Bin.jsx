import { Flex, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import Project from "../features/projects/Project";
import { Loading } from "../components";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../lib/functions";

const Bin = () => {
  const { data: projects, isPending } = useQuery({
    queryKey: ["bin", "projects"],
    queryFn: getProjects,
    select: (data) => {
      return data?.filter((project) => project?.isDeleted === true);
    },
  });

  if (isPending) return <Loading />;

  return (
    <>
      <Flex
        direction="column"
        align="center"
        width="95%"
        mx="auto"
        gap={5}
        my={10}
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
    </>
  );
};

export default Bin;
