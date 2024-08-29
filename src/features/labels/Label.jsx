import {
  Tag,
  TagLabel,
  TagRightIcon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Flex,
  Button,
  Text,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { IoMdMore } from "react-icons/io";
import { db } from "../../firebase";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CommonLabelModal from "./CommonLabelModal";
import { DeleteModal } from "../../components";

const Label = ({ label }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [newLabelData, setNewLabelData] = useState({ ...label });
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();

  const editLabel = async () => {
    try {
      const labelsRef = doc(db, "users", user?.email, "labels", label?.id);

      await updateDoc(labelsRef, newLabelData);
      console.log("Label updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteLabel = async (labelId) => {
    try {
      const labelsRef = doc(db, "users", user?.email, "labels", label?.id);
      await deleteDoc(labelsRef);
      console.log("Label deleted successfully");
    } catch (error) {
      console.error("Error deleting label:", error);
    }
  };

  const editMutation = useMutation({
    mutationFn: editLabel,
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["labels"] });

      const previousLabels = queryClient.getQueryData(["labels"]);
      queryClient.setQueryData(["labels"], (oldLabels) =>
        oldLabels.map((item) =>
          item.id === label?.id ? { ...item, ...newLabelData } : item
        )
      );

      onClose();

      return { previousLabels };
    },
    // If the mutation fails, revert the optimistic update
    onError: (context) => {
      queryClient.setQueryData(["labels"], context.previousLabels);
    },
    // If the mutation succeeds, invalidate the cache to fetch the latest data
    onSettled: () => {
      queryClient.invalidateQueries(["labels"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLabel,
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["labels"] });

      const previousLabels = queryClient.getQueryData(["labels"]);

      queryClient.setQueryData(["labels"], (oldLabels) =>
        oldLabels.filter((item) => item.id !== label?.id)
      );

      return { previousLabels };
    },
    onError: (context) => {
      queryClient.setQueryData(["labels"], context.previousLabels);
    },
    // If the mutation succeeds, invalidate the cache to fetch the latest data
    onSettled: () => {
      queryClient.invalidateQueries(["labels"]);
    },
  });

  return (
    <Tag
      size="lg"
      borderRadius="full"
      variant="solid"
      bgColor={label?.background}
      color="gray.50"
    >
      <TagLabel>{label.name}</TagLabel>

      <Menu>
        <MenuButton
          sx={{
            bgColor: "none",
            color: "gray.50",
            borderRadius: "lg",
            _hover: {
              opacity: 0.8,
            },
            mb: "-4px",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <TagRightIcon as={IoMdMore} />
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

      <CommonLabelModal
        type="Save"
        isOpen={isOpen}
        onClose={onClose}
        setLabelData={setNewLabelData}
        labelData={newLabelData}
        handleClick={editMutation.mutate}
      />
      <DeleteModal
        handleClick={deleteMutation.mutate}
        isOpen1={isOpen1}
        onClose1={onClose1}
        text={`Are you sure you want to delete the label "${label?.name}"?`}
      />
    </Tag>
  );
};

export default Label;
