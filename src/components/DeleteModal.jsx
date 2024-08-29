import {
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

const DeleteModal = ({ isOpen1, onClose1, text, handleClick }) => {
  return (
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
          {text}
        </Text>
        <Flex direction="row" alignItems="center" justifyContent="end" gap={3}>
          <Button
            sx={{
              bgColor: "#272A30",
              color: "gray.50",
              _hover: {
                bgColor: "#272A30",
                opacity: 0.8,
              },
            }}
            onClick={handleClick}
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
  );
};

export default DeleteModal;
