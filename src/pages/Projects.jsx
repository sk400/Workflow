import {
  Flex,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Icon,
  MenuItem,
  MenuList,
  MenuButton,
  Menu,
} from "@chakra-ui/react";
import React from "react";
import CreateProject from "../features/projects/CreateProject";
import { useGlobalState } from "../context";
import { useNavigate } from "react-router-dom";
import { MdMore } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import Project from "../features/projects/Project";

const Projects = () => {
  const { projects, user } = useGlobalState();

  // const heading = projects.length ? "Your projects" : "No projects found";

  const filteredProjects = projects?.filter(
    (project) => project?.isDeleted === false
  );

  return (
    <>
      {/* <Flex
      direction="column"
      align="center"
      width="95%"
      mx="auto"
      gap={5}
      my={10}
      // mb={20}
    >
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
          {heading}
        </Heading>
      </Center>
      <CreateProject />
      <SimpleGrid
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        spacing={4}
        width="100%"
      >
        {projects?.map((project) => (
          <Card
            key={project?.id}
            shadow="md"
            sx={{
              bgColor: "#FFFBEF",
              color: "#535151",
            }}
          >
            <CardHeader>
              <Heading
                size="md"
                sx={{
                  fontFamily: "josefin",
                }}
              >
                {" "}
                {project?.name}
              </Heading>
            </CardHeader>
            <CardBody>
              <Text
                sx={{
                  fontFamily: "josefin",
                }}
              >
                {project?.description}
              </Text>
            </CardBody>
            <CardFooter>
              <Button
                onClick={() => navigate(`/project/${project?.id}`)}
                sx={{
                  bgColor: "#FFE1BD",
                  fontFamily: "josefin",
                }}
              >
                View here
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Flex> */}

      <Flex
        direction="column"
        align="center"
        width="95%"
        mx="auto"
        gap={5}

        // mb={20}
      >
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
        <SimpleGrid
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          spacing={4}
          width="100%"
        >
          {filteredProjects?.map((project) => (
            <Project item={project} key={project?.id} />
          ))}
        </SimpleGrid>
      </Flex>
    </>
  );
};

export default Projects;
