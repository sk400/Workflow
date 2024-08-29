import {
  Box,
  Center,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Modal,
  Button,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";
import addProjectIcon from "../../assets/add-project.png";
import moreIcon from "../../assets/more-icon.png";

import { useParams } from "react-router-dom";
import { useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import CommonCategoryModal from "./CommonCategoryModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateTask from "../tasks/CreateTask";
import { DeleteModal } from "../../components";

const Category = ({ category }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { projectId } = useParams();
  const [categoryName, setCategoryName] = useState(category?.name);
  const [show, setShow] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();

  const handleChange = (e) => {
    if (e?.target?.value?.length <= 20) setCategoryName(e?.target?.value);
  };

  const handleUpdate = async () => {
    if (!categoryName) {
      alert("Please enter a category name");
      return;
    }

    try {
      const categoryDocRef = doc(
        db,
        "users",
        user?.email,
        "projects",
        projectId,
        "categories",
        category?.id
      );
      onClose();
      await updateDoc(categoryDocRef, {
        name: categoryName,
      });
      console.log("Category updated successfully");

      setCategoryName("");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const categoryDocRef = doc(
        db,
        "users",
        user?.email,
        "projects",
        projectId,
        "categories",
        category?.id
      );
      onClose1();
      await deleteDoc(categoryDocRef);
      console.log("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const editMutation = useMutation({
    mutationFn: handleUpdate,
    onMutate: () => {
      queryClient.cancelQueries(["categories", projectId]);

      const previousCategories = queryClient.getQueryData([
        "categories",
        projectId,
      ]);

      queryClient.setQueryData(["categories", projectId], (oldCategories) => {
        const updatedCategories = oldCategories.map((oldCategory) => {
          if (oldCategory?.id === category?.id) {
            return { ...oldCategory, name: categoryName };
          }
          return oldCategory;
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

  const deleteMutation = useMutation({
    mutationFn: handleDelete,
    onMutate: () => {
      queryClient.cancelQueries(["categories", projectId]);

      const previousCategories = queryClient.getQueryData([
        "categories",
        projectId,
      ]);

      queryClient.setQueryData(["categories", projectId], (oldCategories) => {
        const updatedCategories = oldCategories.filter(
          (oldCategory) => oldCategory?.id !== category?.id
        );

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

  return (
    <>
      <Box>
        {/* Category content */}
        <Flex
          alignItems="center"
          // justifyContent="space-between"
          sx={{
            color: "gray.50",
            pl: 3,
            bgColor: "#20212C",
            borderRadius: "10px",
            maxWidth: "300px",
            height: "55px",
          }}
        >
          <Text
            sx={{
              textTransform: "uppercase",
            }}
            fontSize="sm"
            letterSpacing="1px"
          >
            {category?.name}
          </Text>
          <Spacer />

          <HStack gap={3} justifySelf="flex-end" height="100%">
            <Center
              sx={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                bgColor: "#7259C6",
              }}
            >
              <Text fontSize="12px" fontWeight="semibold">
                {category?.tasks?.length}
              </Text>
            </Center>
            <Image
              src={addProjectIcon}
              objectFit={"cover"}
              sx={{
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
              onClick={() => setShow((prev) => !prev)}
            />

            <Menu>
              <MenuButton
                sx={{
                  bgColor: "#20212C",
                  color: "#D3D3D6",

                  _hover: {
                    bgColor: "#272A30",
                  },
                  borderRadius: "lg",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Image
                  src={moreIcon}
                  sx={{
                    width: "25px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                />
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
                    onOpen1();
                  }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
            <Box
              sx={{
                height: "80%",
                pl: 1,
                py: 1,
                borderRadius: "md",
                bgColor: "#7259C6",
                justifySelf: "end",
              }}
            ></Box>
          </HStack>
        </Flex>
        {/* Create task component */}
        {show && <CreateTask setShow={setShow} categoryId={category?.id} />}
      </Box>
      <CommonCategoryModal
        type="Save"
        isOpen={isOpen}
        onClose={onClose}
        handleClick={editMutation.mutate}
        categoryName={categoryName}
        handleChange={handleChange}
      />

      <DeleteModal
        handleClick={deleteMutation.mutate}
        isOpen1={isOpen1}
        onClose1={onClose1}
        text={`Are you sure you want to delete the category "${category?.name}"? If so then move all the notes to any other category.`}
      />
    </>
  );
};

export default Category;
