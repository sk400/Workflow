import {
  Box,
  Flex,
  Heading,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tag,
  Text,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Textarea,
  useDisclosure,
  HStack,
  Wrap,
  WrapItem,
  TagLabel,
  TagRightIcon,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdMore } from "react-icons/io";
import { useParams } from "react-router-dom";
import { createLabelReference, createReference, db } from "../../firebase";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { IoCheckmarkDone, IoClose, IoCloudUploadSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLabel, getLabels } from "../../lib/functions";
import { MdOutlineCheck } from "react-icons/md";
import { Draggable } from "react-beautiful-dnd";
import { useGlobalState } from "../../context";

const Task = ({ task, categoryId, index }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { projectId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [taskData, setTaskData] = useState({ ...task });
  const { filteredCategories, setFilteredCategories } = useGlobalState();

  const queryClient = useQueryClient();

  const { data: label } = useQuery({
    queryKey: ["label", task?.label?.id],
    queryFn: () => fetchLabel(task?.label),
  });

  const { data: labels } = useQuery({
    queryKey: ["labels"],
    queryFn: getLabels,
  });

  const uploadImage = (e) => {
    const file = e.target.files[0];
    const acceptedFormats = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg",
    ];
    if (!acceptedFormats.includes(file.type)) {
      alert("Only image formats are accepted");
      return;
    }

    try {
      const name = file.name.split(".")[0];
      const imageRef = createReference(name);

      uploadBytes(imageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setTaskData((prev) => ({ ...prev, imageUrl: url }));
        });
      });

      console.log("File uploaded successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setTaskData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = async (data) => {
    if (
      !taskData?.title?.length ||
      !taskData?.description?.length ||
      !taskData?.deadline?.length ||
      !taskData?.label?.id ||
      !taskData?.id
    ) {
      alert("Please enter atleast title, description, deadline and label.");
      return;
    }
    onClose();
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

      const category = await getDoc(categoryRef);

      const categoryData = category.data();

      const array = [...categoryData?.tasks];

      const taskInfo = data || taskData;

      const updatedArray = array?.map((item) => {
        if (item?.id === task?.id) {
          return {
            ...taskInfo,
          };
        }
        return item;
      });

      onClose();

      await updateDoc(categoryRef, {
        tasks: updatedArray,
      });

      console.log("Task updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const changeCompletionStatus = async () => {
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

      const docSnap = await getDoc(categoryRef);
      const tasks = docSnap.data()?.tasks;
      const updatedTasks = tasks?.map((item) => {
        if (item?.id === taskData?.id) {
          return {
            ...taskData,
            isCompleted: !item?.isCompleted,
          };
        }
        return item;
      });

      await updateDoc(categoryRef, {
        tasks: updatedTasks,
      });

      console.log("Task completion status updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  // Edit mutation

  const editMutation = useMutation({
    mutationFn: (data) => handleEdit(data),
    onMutate: () => {
      queryClient.cancelQueries(["categories", projectId]);

      const previousCategories = queryClient.getQueryData([
        "categories",
        projectId,
      ]);

      if (filteredCategories?.length) {
        setFilteredCategories((prevCategories) => {
          return prevCategories?.map((category) => {
            if (category.id === categoryId) {
              return {
                ...category,
                tasks: category?.tasks?.map((item) => {
                  if (item?.id === task?.id) {
                    return {
                      ...taskData,
                    };
                  }
                  return item;
                }),
              };
            }

            return category;
          });
        });
      }

      queryClient.setQueryData(["categories", projectId], (oldCategories) => {
        const updatedCategories = oldCategories?.map((category) => {
          if (category?.id === categoryId) {
            return {
              ...category,
              tasks: category?.tasks?.map((item) => {
                if (task?.id === item?.id) {
                  return {
                    ...taskData,
                  };
                }
                return item;
              }),
            };
          }
          return category;
        });

        return updatedCategories;
      });

      return { previousCategories };
    },
    onError: (context) => {
      queryClient.setQueryData(
        ["categories", projectId],
        context?.previousCategories
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["categories", projectId]);
      queryClient.invalidateQueries(["label", task?.label?.id]);
    },
  });

  // Delete mutation

  const deleteMutation = useMutation({
    mutationFn: (data) => handleEdit(data),
    onMutate: () => {
      queryClient.cancelQueries(["categories", projectId]);

      const previousCategories = queryClient.getQueryData([
        "categories",
        projectId,
      ]);

      if (filteredCategories?.length) {
        setFilteredCategories((prevCategories) => {
          return prevCategories?.map((category) => {
            if (category.id === categoryId) {
              return {
                ...category,
                tasks: category?.tasks?.map((item) => {
                  if (item?.id === task?.id) {
                    return {
                      ...taskData,
                      isDeleted: task?.isDeleted === true ? false : true,
                    };
                  }
                  return item;
                }),
              };
            }

            return category;
          });
        });
      }

      queryClient.setQueryData(["categories", projectId], (oldCategories) => {
        const updatedCategories = oldCategories?.map((category) => {
          if (category?.id === categoryId) {
            return {
              ...category,
              tasks: category?.tasks?.map((item) => {
                if (task?.id === item?.id) {
                  return {
                    ...taskData,
                    isDeleted: task?.isDeleted === true ? false : true,
                  };
                }
                return item;
              }),
            };
          }
          return category;
        });

        return updatedCategories;
      });

      return { previousCategories };
    },
    onError: (context) => {
      queryClient.setQueryData(
        ["categories", projectId],
        context?.previousCategories
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["categories", projectId]);
    },
  });

  // Completion mutation

  const completionMutation = useMutation({
    mutationFn: changeCompletionStatus,
    onMutate: () => {
      queryClient.cancelQueries(["categories", projectId]);

      const previousCategories = queryClient.getQueryData([
        "categories",
        projectId,
      ]);

      if (filteredCategories?.length) {
        setFilteredCategories((prevCategories) => {
          return prevCategories?.map((category) => {
            if (category.id === categoryId) {
              return {
                ...category,
                tasks: category?.tasks?.map((item) => {
                  if (item?.id === task?.id) {
                    return {
                      ...taskData,
                      isCompleted: !item?.isCompleted,
                    };
                  }
                  return item;
                }),
              };
            }

            return category;
          });
        });
      }

      queryClient.setQueryData(["categories", projectId], (oldCategories) => {
        const updatedCategories = oldCategories?.map((category) => {
          if (category?.id === categoryId) {
            return {
              ...category,
              tasks: category?.tasks?.map((item) => {
                if (task?.id === item?.id) {
                  return {
                    ...taskData,
                    isCompleted: !item?.isCompleted,
                  };
                }
                return item;
              }),
            };
          }
          return category;
        });

        return updatedCategories;
      });

      onClose();

      return { previousCategories };
    },
    onError: (context) => {
      queryClient.setQueryData(
        ["categories", projectId],
        context?.previousCategories
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["categories", projectId]);
    },
  });

  const date = new Date(task?.deadline);

  const formattedDate = date.toLocaleString("default", {
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <Draggable draggableId={task?.id?.toString()} index={index}>
        {(provided) => (
          <Box
            {...provided.draggableProps}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            sx={{
              bgColor: "#20212C",
              color: "#D3D3D6",
              mt: 5,
              p: 3,
              borderRadius: "15px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              gap: 4,
              width: "300px",
            }}
          >
            <Flex>
              {label ? (
                <Tag
                  sx={{
                    borderRadius: "2xl",
                    bgColor: label?.background,
                    color: "gray.50",
                  }}
                >
                  {label?.name}
                </Tag>
              ) : (
                <Tag
                  sx={{
                    borderRadius: "2xl",
                    bgColor: "#7259C6",
                    color: "gray.50",
                  }}
                >
                  No label
                </Tag>
              )}
              <Spacer />
              <Text
                sx={{
                  fontWeight: "medium",
                }}
              >
                {formattedDate}
              </Text>
            </Flex>
            <Heading size="sm" fontWeight="medium">
              {task?.title}{" "}
              {task?.isCompleted && (
                <Icon as={IoCheckmarkDone} color="#48CFCB" boxSize={5} />
              )}
            </Heading>
            {task?.imageUrl && (
              <Image
                src={task?.imageUrl}
                alt="image"
                objectFit="cover"
                borderRadius="14px"
              />
            )}
            <Text fontSize="xs">{task?.description}</Text>
            <Menu>
              <MenuButton
                sx={{
                  bgColor: "#20212C",
                  color: "#D3D3D6",
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  _hover: {
                    bgColor: "#272A30",
                  },
                  borderRadius: "lg",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Icon as={IoMdMore} />
              </MenuButton>
              <MenuList
                sx={{
                  bgColor: "#272A30",
                  border: "none",
                }}
              >
                <MenuItem
                  sx={{
                    color: "gray.50",
                    bgColor: "#272A30",
                    _hover: {
                      bgColor: "#7259C6",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen();
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  sx={{
                    color: "gray.50",
                    bgColor: "#272A30",
                    _hover: {
                      bgColor: "#7259C6",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate({
                      ...taskData,
                      isDeleted: task?.isDeleted === true ? false : true,
                    });
                  }}
                >
                  Add to bin
                </MenuItem>
                <MenuItem
                  sx={{
                    color: "gray.50",
                    bgColor: "#272A30",
                    _hover: {
                      bgColor: "#7259C6",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    completionMutation.mutate();
                  }}
                >
                  Mark as {task?.isCompleted ? "Uncompleted" : "Completed"}
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        )}
      </Draggable>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent
          sx={{
            p: 5,
            gap: 3,
            color: "#a0aec0",
            bgColor: "#272A30",
          }}
        >
          <Heading size="sm" fontWeight="medium">
            Edit task
          </Heading>
          <Input
            variant="outline"
            name="title"
            sx={{
              bgColor: "#20212C",
              color: "#a0aec0",
              _hover: {
                bgColor: "#20212C",
                opacity: 0.8,
              },
            }}
            isInvalid
            errorBorderColor="#4A4B52"
            focusBorderColor="#3772FF"
            autoComplete="off"
            placeholder="Title"
            value={taskData?.title}
            onChange={handleChange}
          />
          <Input
            variant="outline"
            type="date"
            name="deadline"
            sx={{
              bgColor: "#20212C",
              color: "#a0aec0",
              _hover: {
                bgColor: "#20212C",
                opacity: 0.8,
              },
            }}
            isInvalid
            errorBorderColor="#4A4B52"
            focusBorderColor="#3772FF"
            autoComplete="off"
            placeholder="Deadline"
            value={taskData?.deadline}
            onChange={handleChange}
          />
          <Textarea
            name="description"
            placeholder="About the task"
            sx={{
              bgColor: "#20212C",
              color: "#a0aec0",
              _hover: {
                bgColor: "#20212C",
                opacity: 0.8,
              },
            }}
            isInvalid
            errorBorderColor="#4A4B52"
            focusBorderColor="#3772FF"
            rows={6}
            resize="none"
            autoComplete="off"
            variant="outline"
            value={taskData?.description}
            onChange={handleChange}
          />

          {/* Image upload button */}

          {taskData?.imageUrl ? (
            <Box sx={{ position: "relative", width: "100%" }}>
              <Image
                src={taskData?.imageUrl}
                alt="image"
                objectFit="cover"
                borderRadius="14px"
              />
              <Icon
                as={IoClose}
                color="#a0aec0"
                w={6}
                h={6}
                sx={{
                  position: "absolute",
                  top: 3,
                  right: 3,
                  cursor: "pointer",
                }}
                onClick={() =>
                  setTaskData((prev) => ({ ...prev, imageUrl: "" }))
                }
              />
            </Box>
          ) : (
            <>
              <label>
                <Flex
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    bgColor: "#20212C",
                    p: 3,
                    borderRadius: "8px",
                    color: "#a0aec0",
                    cursor: "pointer",
                    _hover: {
                      bgColor: "#20212C",
                      opacity: 0.8,
                    },
                  }}
                >
                  <HStack>
                    <Icon as={IoCloudUploadSharp} color="#a0aec0" w={6} h={6} />
                    <Text>Upload</Text>
                  </HStack>
                </Flex>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  style={{
                    width: "0px",
                    height: "0px",
                  }}
                />
              </label>
            </>
          )}

          <Wrap>
            {labels?.map((item) => (
              <WrapItem key={item?.id}>
                <Tag
                  sx={{
                    bgColor: item?.background,
                    color: "gray.100",
                    cursor: "pointer",
                  }}
                  size="sm"
                  onClick={() =>
                    setTaskData((prev) => ({
                      ...prev,
                      label: createLabelReference({ id: item?.id, user }),
                    }))
                  }
                >
                  <TagLabel> {item.name}</TagLabel>
                  {taskData?.label?.id === item?.id && (
                    <TagRightIcon as={MdOutlineCheck} color="gray.100" />
                  )}
                </Tag>
              </WrapItem>
            ))}
          </Wrap>

          <Button
            sx={{
              bgColor: "#3772FF",
              color: "gray.50",
              _hover: {
                bgColor: "#3772FF",
                opacity: 0.8,
              },
            }}
            onClick={() => {
              editMutation.mutate();
            }}
          >
            Done
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Task;
