import {
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import { useParams } from "react-router-dom";

import { Loading } from "../components";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Category from "../features/projects/Category";
import Tasks from "../features/tasks/Tasks";
import CreateCategory from "../features/projects/CreateCategory";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories, getLabels } from "../lib/functions";
import { MdOutlineCheck } from "react-icons/md";
import { DragDropContext } from "react-beautiful-dnd";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useGlobalState } from "../context";
import { useEffect, useState } from "react";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("user"));
  const [completed, setCompleted] = useState(false);
  const {
    setFilteredCategories,
    filteredCategories,
    selectedLabel,
    setSelectedLabel,
    searchTerm,
  } = useGlobalState();

  const {
    data: categories,
    isPending,
    error,
  } = useQuery({
    queryKey: ["categories", projectId],
    queryFn: () => getCategories(projectId),
  });

  const { data: labels } = useQuery({
    queryKey: ["labels"],
    queryFn: getLabels,
  });

  const changePosition = async ({ tasks, categoryId }) => {
    try {
      const categoryRef = doc(
        db,
        "users",
        user?.email,
        "projects",
        projectId,
        "categories",
        categoryId
      );

      await updateDoc(categoryRef, {
        tasks,
      });
      console.log("Position changed successfully");
      queryClient.invalidateQueries(["categories", projectId]);
    } catch (error) {
      console.log(error);
    }
  };

  const moveTask = async ({
    sourceTasks,
    destinationTasks,
    sourceCategory,
    destinationCategory,
  }) => {
    try {
      const sourceCategoryRef = doc(
        db,
        "users",
        user?.email,
        "projects",
        projectId,
        "categories",
        sourceCategory
      );

      const destinationCategoryRef = doc(
        db,
        "users",
        user?.email,
        "projects",
        projectId,
        "categories",
        destinationCategory
      );

      await updateDoc(sourceCategoryRef, {
        tasks: sourceTasks,
      });

      await updateDoc(destinationCategoryRef, {
        tasks: destinationTasks,
      });
      console.log("Task moved successfully");
      queryClient.invalidateQueries(["categories", projectId]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // If there is no destination
    if (!destination) return;

    // If the source and destination are the same
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const startColumn = source.droppableId;
    const finishColumn = destination.droppableId;

    // If the start and end column are the same, update the task order in the column and return

    if (startColumn === finishColumn) {
      queryClient.setQueryData(["categories", projectId], (oldCategories) => {
        const startColumn = source.droppableId;

        const categoryIndex = oldCategories?.findIndex(
          (item) => item?.id === startColumn
        );

        if (categoryIndex === -1) {
          return;
        }

        const updatedTasks = [...oldCategories[categoryIndex].tasks];
        const [removed] = updatedTasks.splice(source.index, 1);

        updatedTasks.splice(destination.index, 0, removed);

        const updatedCategories = oldCategories.map((category) => {
          if (category.id === startColumn) {
            return { ...category, tasks: updatedTasks };
          }
          return category;
        });

        changePosition({ tasks: updatedTasks, categoryId: startColumn });

        return updatedCategories;
      });
    } else {
      queryClient.setQueryData(["categories", projectId], (oldCategories) => {
        // find the source category
        const sourceCategory = oldCategories.find(
          (category) => category.id === source.droppableId
        );
        // Find the destination category
        const destinationCategory = oldCategories.find(
          (category) => category.id === destination.droppableId
        );
        // Remove the task from source index in the source category
        const sourceTasks = sourceCategory.tasks.filter(
          (task, index) => index !== source.index
        );

        // Update the categoryId of the task

        const removedTask = {
          ...sourceCategory.tasks[source.index],
          categoryId: destinationCategory.id,
        };

        // Add the task to the destination index in the destination category
        const destinationTasks = destinationCategory.tasks;
        destinationTasks.splice(destination.index, 0, removedTask);

        moveTask({
          sourceTasks,
          destinationTasks,
          sourceCategory: sourceCategory.id,
          destinationCategory: destinationCategory.id,
        });

        return oldCategories.map((category) => {
          if (category.id === sourceCategory.id) {
            return { ...category, tasks: sourceTasks };
          } else if (category.id === destinationCategory.id) {
            return { ...category, tasks: destinationTasks };
          }
          return category;
        });
      });
    }
  };

  if (error) {
    alert("Something went wrong. Please refresh the page.");
  }

  useEffect(() => {
    if (!searchTerm?.length) {
      setFilteredCategories(null);
      return;
    }
    if (!categories?.length) return;

    const timeoutId = setTimeout(() => {
      setFilteredCategories(() => {
        return categories?.map((category) => {
          return {
            ...category,
            tasks: category?.tasks?.filter(
              (task) =>
                task?.title?.includes(searchTerm) ||
                task?.description?.includes(searchTerm)
            ),
          };
        });
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categories]);

  if (isPending) return <Loading />;

  if (!categories?.length) {
    return (
      <Flex alignItems="center" width="100%">
        <Text color="gray.50">No categories found.</Text>
        <Spacer />
        <CreateCategory />
      </Flex>
    );
  }

  const filter = ({ completed, selectedLabel }) =>
    setFilteredCategories(() => {
      return categories?.map((category) => {
        return {
          ...category,
          tasks: category?.tasks?.filter((task) => {
            const returnValue = selectedLabel
              ? task?.label?.id === selectedLabel?.id &&
                task?.isCompleted === completed
              : task?.isCompleted === completed;

            return returnValue;
          }),
        };
      });
    });

  const renderAllTasks = () => {
    setFilteredCategories(null);
    setSelectedLabel(null);
    setCompleted(false);
  };

  const pageData = filteredCategories || categories;

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
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
                onClick={renderAllTasks}
              >
                All tasks
              </Button>

              {/* Completion */}

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
                  {completed ? "Completed" : "Uncompleted"}
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
                    }}
                    onClick={() => {
                      setCompleted(true);
                      // renderCompletedTasks();
                      filter({ completed: true, selectedLabel });
                    }}
                  >
                    Completed
                  </MenuItem>
                  <MenuItem
                    sx={{
                      bgColor: "#272A30",
                      color: "gray.50",
                    }}
                    onClick={() => {
                      setCompleted(false);
                      filter({ completed: false, selectedLabel });
                    }}
                  >
                    Uncompleted
                  </MenuItem>
                </MenuList>
              </Menu>
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
                    }}
                  >
                    <Wrap>
                      {labels?.map((label) => (
                        <WrapItem key={label?.id}>
                          <Tag
                            sx={{
                              bgColor: label?.background,
                              color: "gray.100",
                              cursor: "pointer",
                              borderRadius: "full",
                            }}
                            size={["sm", "md"]}
                            onClick={() => {
                              setSelectedLabel(label);
                              filter({ selectedLabel: label, completed });
                            }}
                          >
                            <TagLabel> {label.name}</TagLabel>
                            {selectedLabel?.id === label?.id && (
                              <TagRightIcon
                                as={MdOutlineCheck}
                                color="gray.100"
                              />
                            )}
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </MenuItem>
                </MenuList>
              </Menu>
              <CreateCategory />
            </HStack>
          </Flex>

          <Wrap spacing={["10px", "40px"]}>
            {pageData?.map((category) => {
              const filteredTasks = category?.tasks?.filter(
                (task) => task?.isDeleted === false
              );

              return (
                <WrapItem key={category?.id}>
                  <Box>
                    <Category
                      category={category}
                      taskNo={filteredTasks?.length}
                    />
                    <Tasks tasks={filteredTasks} categoryId={category?.id} />
                  </Box>
                </WrapItem>
              );
            })}
          </Wrap>

          {/* Category columns */}
        </Flex>
      </DragDropContext>
    </>
  );
};

export default ProjectDetails;
