import {
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";

import { useGlobalState } from "../context";
import { useParams } from "react-router-dom";

import { useGetRealtimeData } from "../lib/customHooks";

import { Loading } from "../components";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { IoMdAdd } from "react-icons/io";
import Category from "../features/projects/Category";
import Tasks from "../features/tasks/Tasks";
import CreateCategory from "../features/projects/CreateCategory";

const ProjectDetails = () => {
  const { projectId } = useParams();
  // const { projects } = useGlobalState();

  const user = JSON.parse(localStorage.getItem("user"));

  const [data, loading] = useGetRealtimeData(user, projectId);

  if (loading) return <Loading />;

  // update category name
  // delete category

  return (
    <>
      <Flex direction="column" width="100%" gap={5} pb={10} overflow="none">
        {/* Filters */}

        <Flex
          alignItems="center"
          width="100%"
          overflowX="auto"
          sx={{
            gap: 5,
            px: 2,
            py: 3,
          }}
        >
          <HStack gap={5}>
            <Button
              variant="outline"
              borderRadius="18px"
              size="xs"
              color="gray.50"
              outlineColor={"#272A30"}
              border="none"
              sx={{
                _hover: {
                  bgColor: "#17181F",
                  opacity: 0.8,
                },
              }}
            >
              All tasks
            </Button>
            <Button
              variant="outline"
              borderRadius="18px"
              size="xs"
              color="gray.50"
              outlineColor={"#272A30"}
              border="none"
              sx={{
                _hover: {
                  bgColor: "#17181F",
                  opacity: 0.8,
                },
              }}
            >
              Completed
            </Button>
          </HStack>
          <Spacer
            sx={{
              display: { base: "none", sm: "block" },
            }}
          />
          <HStack gap={5}>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="outline"
                borderRadius="18px"
                size="xs"
                color="gray.50"
                outlineColor={"#272A30"}
                border="none"
                sx={{
                  bgColor: "#17181F",
                  _hover: {
                    bgColor: "#17181F",
                    opacity: 0.8,
                  },
                }}
              >
                Sort by
              </MenuButton>
              <MenuList
                sx={{
                  bgColor: "#272A30",
                  border: "none",
                }}
              >
                <MenuItem
                  sx={{
                    bgColor: "#272A30",
                    color: "gray.50",
                    _hover: {
                      bgColor: "#7259C6",
                    },
                  }}
                >
                  Newest first
                </MenuItem>
                <MenuItem
                  sx={{
                    bgColor: "#272A30",
                    color: "gray.50",
                    _hover: {
                      bgColor: "#7259C6",
                    },
                  }}
                >
                  Older first
                </MenuItem>
                <MenuItem
                  sx={{
                    bgColor: "#272A30",
                    color: "gray.50",
                    _hover: {
                      bgColor: "#7259C6",
                    },
                  }}
                >
                  Task name
                </MenuItem>
                <MenuItem
                  sx={{
                    bgColor: "#272A30",
                    color: "gray.50",
                    _hover: {
                      bgColor: "#7259C6",
                    },
                  }}
                >
                  Priority
                </MenuItem>
              </MenuList>
            </Menu>
            <CreateCategory />
          </HStack>
        </Flex>

        {/* Category columns */}
        <SimpleGrid minChildWidth={"300px"} spacing={["10px", "40px"]}>
          {data?.map((category) => (
            <Box key={category?.id}>
              <Category category={category} />
              <Tasks tasks={category?.tasks} />
            </Box>
          ))}

          {/* <Category name="Responsive design" noOfItems={23} />
          <Category name="Responsive design" noOfItems={23} />
          <Category name="Responsive design" noOfItems={23} /> */}
        </SimpleGrid>
      </Flex>
    </>
  );
};

export default ProjectDetails;
