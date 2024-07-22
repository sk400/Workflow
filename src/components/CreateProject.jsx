import { Flex, Text, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { useGlobalState } from "../context";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import CommonModal from "./CommonModal";

const CreateProject = () => {
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
        // Add the current timestamp to the createdAt field of the document
        createdAt: serverTimestamp(),
      });
      // Log a success message to the console
      console.log("Project created successfully");
    } catch (error) {
      // Log any errors that occur during the creation of the project to the console
      console.log(error);
    }
  };

  return (
    <>
      <Flex
        direction="row"
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          p: 3,
          bgColor: "#D1C69E",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "lg",
          width: "100%",
        }}
        onClick={onOpen}
      >
        <Text sx={{ fontFamily: "josefin" }}>New project</Text>
      </Flex>

      <CommonModal
        isOpen={isOpen}
        onClose={onClose}
        name="Create"
        item={projectInfo}
        setterFunction={setProjectInfo}
        actionButton={createProjectOnFirestore}
      />
    </>
  );
};

export default CreateProject;
