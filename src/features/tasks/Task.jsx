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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdMore } from "react-icons/io";
import { useParams } from "react-router-dom";
import { createReference, db } from "../../firebase";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { IoClose, IoCloudUploadSharp } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Task = ({ task, categoryId }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { projectId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageUrl, setImageUrl] = useState(task?.imageUrl);
  const [taskData, setTaskData] = useState(task);
  const queryClient = useQueryClient();

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
          setImageUrl(url);
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

  const handleEdit = async () => {
    if (
      !taskData?.title?.length ||
      !taskData?.description?.length ||
      !taskData?.deadline?.length
    ) {
      alert("Task name or description cannot be empty");
      return;
    }

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

      const project = await getDoc(categoryRef);

      const projectData = project.data();

      const array = [...projectData?.tasks];

      const updatedArray = array?.map((item) => {
        if (item?.id === task?.id) {
          return {
            ...taskData,
            imageUrl,
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

  // Temporary. It will be changed to "Add to bin"

  const handleDelete = async () => {
    if (!user || !task?.id) {
      return;
    }

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

      const project = await getDoc(categoryRef);

      const projectData = project.data();

      const array = [...projectData?.tasks];

      const filteredArray = array?.filter((item) => item?.id !== task?.id);

      await updateDoc(categoryRef, {
        tasks: filteredArray,
      });

      setTaskData({ title: "", description: "", deadline: "" });
      setImageUrl("");

      console.log("Task deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const editMutation = useMutation({
    mutationFn: handleEdit,
    onMutate: () => {
      queryClient.cancelQueries(["categories", projectId]);

      const previousCategories = queryClient.getQueryData([
        "categories",
        projectId,
      ]);

      queryClient.setQueryData(["categories", projectId], (oldCategories) => {
        const updatedCategories = oldCategories?.map((category) => {
          if (category?.id === categoryId) {
            return {
              ...category,
              tasks: category?.tasks?.map((item) => {
                if (task?.id === item?.id) {
                  return {
                    ...taskData,
                    imageUrl,
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

  const deleteMutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", projectId]);
    },
  });

  return (
    <>
      <Box
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
          <Tag
            sx={{
              borderRadius: "2xl",
              bgColor: "#7259C6",
              color: "gray.50",
            }}
          >
            Testing
          </Tag>
          <Spacer />
          <Text
            sx={{
              fontWeight: "medium",
            }}
          >
            Sep 8
          </Text>
        </Flex>
        <Heading size="sm" fontWeight="medium">
          {task?.title}
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
                deleteMutation.mutate();
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
              }}
            >
              Mark as completed
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

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

          {imageUrl ? (
            <Box sx={{ position: "relative", width: "100%" }}>
              <Image
                src={imageUrl}
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
                onClick={() => setImageUrl(null)}
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
