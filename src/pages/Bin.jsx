import { Flex, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import Project from "../features/projects/Project";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { Loading } from "../components";
import { useQuery } from "@tanstack/react-query";

const Bin = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const getProjects = async () => {
    try {
      const userProjectsRef = collection(db, "users", user?.email, "projects");
      const querySnapshot = await getDocs(
        query(userProjectsRef, orderBy("createdAt", "desc"))
      );
      const projectsData = querySnapshot?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      return projectsData;
    } catch (error) {
      console.error("Error fetching user projects: ", error);
    }
  };

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
