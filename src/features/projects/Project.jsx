import React, { useState } from "react";
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { SlOptionsVertical } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useGlobalState } from "../../context";
import { CommonModal } from "../../components";

const Project = ({ item }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projectInfo, setProjectInfo] = useState(item);
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const { user } = useGlobalState();

  /**
   * Deletes a project from the Firestore database.
   * This function is called when the user clicks the "Delete" button in the project menu.
   * It first checks if the user is logged in, and if so, it deletes the project from the "projects" collection in the Firestore database.
   * If the user is not logged in, it logs an error message to the console.
   * If there is an error when deleting the project, it logs the error message to the console.
   */
  const deleteProject = async () => {
    try {
      // Check if the user is logged in
      if (!user) {
        console.error("You must be logged in to delete a project");
        return;
      }

      // Delete the project from the Firestore database
      await deleteDoc(doc(db, "users", user?.email, "projects", item?.id));
      console.log("Project deleted successfully");
    } catch (error) {
      // Log any errors that occur during the deletion of the project
      console.error("Error deleting project: ", error);
    }
  };

  /**
   * Updates a project in the Firestore database.
   * This function is called when the user clicks the "Save" button in the rename project modal.
   * It first checks if the user is logged in, and if so, it updates the project in the "projects" collection of the Firestore database.
   * If the user is not logged in, it logs an error message to the console.
   * If there is an error when updating the project, it logs the error message to the console.
   */
  const renameProject = async () => {
    try {
      // Check if the user is logged in
      if (!user) {
        console.error("You must be logged in to update a project");
        return;
      }

      // Get a reference to the project document that needs to be updated
      const projectRef = doc(db, "users", user?.email, "projects", item?.id);

      // Update the project in the Firestore database
      await updateDoc(projectRef, projectInfo);

      // Log a success message to the console if the project was updated successfully
      console.log("Project updated successfully");
    } catch (error) {
      // Log any errors that occur during the updating of the project
      console.error("Error updating project: ", error);
    }
  };

  return (
    <Box>
      <Flex
        direction="row"
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          px: 3,
          py: 1,
          bgColor: "#F4D089",

          borderRadius: "8px",
          cursor: "pointer",
          backgroundOpacity: "40%",
          color: "#535151",
          fontWeight: "400",
          boxShadow: "lg",
        }}
      >
        <Text
          sx={{
            fontFamily: "josefin",
            fontWeight: "500",
            textAlign: "center",
            flexBasis: "95%",
            ml: 4,
          }}
          onClick={() => navigate(`/project/${item?.id}`)}
        >
          {item?.name}
        </Text>

        <Menu>
          <MenuButton
            onClick={(e) => {
              e.stopPropagation();
            }}
            as={IconButton}
            sx={{
              bgColor: "#F4D089",
              flexBasis: "5%",
              "&:hover": {
                bgColor: "#F4D089",
              },
              fontFamily: "josefin",
            }}
          >
            <Icon as={SlOptionsVertical} />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onOpen1}>Edit</MenuItem>
            <MenuItem
              onClick={() => {
                onOpen();
              }}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>

        {/* Delete modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete this project?{" "}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                variant="red"
                onClick={() => {
                  navigate("/");
                  deleteProject();
                  onClose();
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <CommonModal
          isOpen={isOpen1}
          onClose={onClose1}
          name="Save"
          item={item}
          setterFunction={setProjectInfo}
          actionButton={renameProject}
        />
      </Flex>
    </Box>
  );
};

export default Project;
