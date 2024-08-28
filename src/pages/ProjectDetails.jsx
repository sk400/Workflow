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
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import { useParams } from "react-router-dom";

import { useGetRealtimeData } from "../lib/customHooks";

import { Loading } from "../components";
import { ChevronDownIcon } from "@chakra-ui/icons";

import Category from "../features/projects/Category";
import Tasks from "../features/tasks/Tasks";
import CreateCategory from "../features/projects/CreateCategory";
import CreateTask from "../features/tasks/CreateTask";
import { Suspense, useState } from "react";

const ProjectDetails = () => {
  const { projectId } = useParams();
  // const { projects } = useGlobalState();

  const user = JSON.parse(localStorage.getItem("user"));

  const [data, loading] = useGetRealtimeData(user, projectId);
  const [show, setShow] = useState(false);

  // if (loading) return <Loading />;

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
                Labels
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
                  Label 1
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
                  Label 2
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
                  Label 3
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
                  Label 4
                </MenuItem>
              </MenuList>
            </Menu>
            <CreateCategory />
          </HStack>
        </Flex>

        {loading ? (
          <Loading />
        ) : (
          <Wrap spacing={["10px", "40px"]}>
            {data?.map((category) => (
              <WrapItem key={category?.id}>
                <Box>
                  <Category category={category} setShow={setShow} show={show} />
                  {show && (
                    <CreateTask setShow={setShow} categoryId={category?.id} />
                  )}
                  <Tasks tasks={category?.tasks} categoryId={category?.id} />
                </Box>
              </WrapItem>
            ))}
          </Wrap>
        )}

        {/* Category columns */}
      </Flex>
    </>
  );
};

export default ProjectDetails;
