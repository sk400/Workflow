import { Flex, Text, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { useGlobalState } from "../context";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import CommonModal from "./CommonModal";

const CreateProject = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projectName, setProjectName] = useState("");
  const { user } = useGlobalState();

  const createProjectOnFirestore = async () => {
    if (!projectName?.length) {
      alert("Project name cannot be empty");
      return;
    }
    try {
      await addDoc(collection(db, "users", user?.email, "projects"), {
        name: projectName,
        createdAt: serverTimestamp(),
      });
      console.log("Project created successfully");
    } catch (error) {
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
        }}
        onClick={onOpen}
      >
        <Text sx={{ fontFamily: "josefin" }}>New project</Text>
      </Flex>

      <CommonModal
        isOpen={isOpen}
        onClose={onClose}
        name="Create"
        setterFunction={setProjectName}
        actionButton={createProjectOnFirestore}
      />
    </>
  );
};

export default CreateProject;
