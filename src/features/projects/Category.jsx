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
  Input,
  Modal,
  Button,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  ModalFooter,
} from "@chakra-ui/react";
import addProjectIcon from "../../assets/add-project.png";
import moreIcon from "../../assets/more-icon.png";
import { useGlobalState } from "../../context";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import CommonCategoryModal from "./CommonCategoryModal";

const Category = ({ category }) => {
  const { user } = useGlobalState();
  const { projectId } = useParams();
  const [categoryName, setCategoryName] = useState(category?.name);
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        sx={{
          color: "gray.50",
          pl: 3,
          bgColor: "#20212C",
          borderRadius: "10px",
          maxWidth: "300px",
          height: "55px",
        }}
      >
        <HStack
          sx={{
            gap: 3,
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
        </HStack>
        <HStack gap={3}>
          <Image
            src={addProjectIcon}
            objectFit={"cover"}
            sx={{
              width: "20px",
              height: "20px",
              cursor: "pointer",
            }}
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
        </HStack>
        <Box
          sx={{
            height: "80%",
            pl: 1,
            py: 1,
            borderRadius: "md",
            bgColor: "#7259C6",
          }}
        ></Box>
      </Flex>

      <CommonCategoryModal
        type="Save"
        isOpen={isOpen}
        onClose={onClose}
        handleClick={handleUpdate}
        categoryName={categoryName}
        handleChange={handleChange}
      />
      {/* Delete confirmation modal */}
      <Modal isOpen={isOpen1} onClose={onClose1} size="xs">
        <ModalOverlay />
        <ModalContent
          sx={{
            p: 5,
            gap: 3,
            bgColor: "#272A30",
          }}
        >
          <Text
            sx={{
              color: "#D3D3D6",
              mb: 5,
            }}
            fontSize="md"
          >
            Are you sure you want to delete <strong>{category?.name}</strong>?
            If so then move all the notes to any other category.
          </Text>
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="end"
            gap={3}
          >
            <Button
              sx={{
                bgColor: "#272A30",
                color: "gray.50",
                _hover: {
                  bgColor: "#272A30",
                  opacity: 0.8,
                },
              }}
              onClick={() => {
                handleDelete();
              }}
            >
              Delete
            </Button>
            <Button
              sx={{
                bgColor: "#7259C6",
                color: "gray.50",
                _hover: {
                  bgColor: "#7259C6",
                  opacity: 0.8,
                },
              }}
              onClick={() => {
                onClose1();
              }}
            >
              Back
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Category;
