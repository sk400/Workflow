import { Box, Icon, IconButton, Image, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { useGlobalState } from "../../context";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { CommonModal } from "../../components";
import addProject from "../../assets/add-project.png";
import { IoMdAddCircleOutline } from "react-icons/io";

const CreateProject = ({ sidebar }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projectInfo, setProjectInfo] = useState({ name: "", description: "" });
  const { user } = useGlobalState();

  /**
   * Asynchronously creates a new project in the Firebase Firestore database.
   * The project is added to the user's collection of projects.
   * The project is created with the name and description provided by the user.
   * If the project name or description is empty, an alert is displayed and the function returns early.
   * If the project is successfully created, a message is logged to the console.
   * If an error occurs during the creation of the project, the error is logged to the console.
   *
   * @return {Promise<void>} - A Promise that resolves when the project is created.
   */
  const createProjectOnFirestore = async () => {
    // Check if the project name or description is empty
    if (!projectInfo?.name?.length || !projectInfo?.description?.length) {
      // Display an alert and return early if the project name or description is empty
      alert("Project name or description cannot be empty");
      return;
    }
    try {
      // Add the project to the user's collection of projects in the Firestore database
      await addDoc(collection(db, "users", user?.email, "projects"), {
        // Spread the project information into the Firestore document
        ...projectInfo,
        isDeleted: false,
        // Add the current timestamp to the createdAt field of the document
        createdAt: serverTimestamp(),
      });
      // Log a success message to the console
      console.log("Project created successfully");
      setProjectInfo({ name: "", description: "" });
    } catch (error) {
      // Log any errors that occur during the creation of the project to the console
      console.log(error);
      setProjectInfo({ name: "", description: "" });
    }
  };

  return (
    <>
      {sidebar ? (
        <Image
          src={addProject}
          objectFit={"cover"}
          sx={{
            width: "24px",
            height: "24px",
            cursor: "pointer",
          }}
          onClick={onOpen}
        />
      ) : (
        <IconButton
          sx={{
            bgColor: "#17181F",
            color: "gray.50",
            display: { base: "none", md: "block" },
            _hover: {
              bgColor: "#17181F",
            },
          }}
          onClick={onOpen}
        >
          <Icon as={IoMdAddCircleOutline} w={[7, 9]} h={[7, 9]} />
        </IconButton>
      )}

      <CommonModal
        isOpen={isOpen}
        onClose={onClose}
        name="Create"
        item={projectInfo}
        setterFunction={setProjectInfo}
        actionFunction={createProjectOnFirestore}
      />
    </>
  );
};

export default CreateProject;
