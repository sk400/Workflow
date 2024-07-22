import {
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Button,
} from "@chakra-ui/react";
import React from "react";
import CreateProject from "./CreateProject";
import { useGlobalState } from "../context";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { projects } = useGlobalState();

  const navigate = useNavigate();

  const heading = projects.length ? "Your projects" : "No projects found";

  return (
    <Flex
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
    </Flex>
  );
};

export default Home;
