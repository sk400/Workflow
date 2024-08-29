import { Button, useDisclosure } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { db } from "../../firebase";
import CommonLabelModal from "./CommonLabelModal";

const CreateLabel = () => {
  const [labelData, setLabelData] = useState({
    name: "",
    background: "#17BEBB",
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const createLabelInFirestore = async () => {
    try {
      const labelsRef = collection(db, "users", user?.email, "labels");
      const newDoc = await addDoc(labelsRef, {
        ...labelData,
        createdAt: serverTimestamp(),
      });
      console.log("Label created successfully", newDoc.id);
      setLabelData({ name: "", background: "#17BEBB" });
      return newDoc;
    } catch (error) {
      console.log(error);
    }
  };

  const createMutation = useMutation({
    mutationFn: createLabelInFirestore,
    onMutate: () => {
      queryClient.cancelQueries("labels");

      const previousLabels = queryClient.getQueryData("labels");
      queryClient.setQueryData(["labels"], (oldLabels) => [
        ...oldLabels,
        { ...labelData, id: Date.now },
      ]);
      onClose();

      return { previousLabels };
    },
    onError: (context) => {
      queryClient.setQueryData("labels", context.previousLabels);
    },
    onSettled: () => {
      queryClient.invalidateQueries("labels");
    },
  });

  const handleClick = () => {
    if (labelData?.name?.length === 0) {
      alert("Please enter label name");
      return;
    }

    createMutation.mutate();
  };

  return (
    <>
      <Button
        variant="solid"
        borderRadius="18px"
        bgColor="gray.50"
        color="black"
        size="xs"
        sx={{
          px: 3,
          py: 4,
          _hover: {
            opacity: 0.8,
          },
          fontSize: "sm",
        }}
        rightIcon={<IoMdAdd />}
        onClick={onOpen}
      >
        Label
      </Button>

      <CommonLabelModal
        type="Create"
        isOpen={isOpen}
        onClose={onClose}
        setLabelData={setLabelData}
        labelData={labelData}
        handleClick={handleClick}
      />
    </>
  );
};

export default CreateLabel;
