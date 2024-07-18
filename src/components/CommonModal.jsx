import {
  Box,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

const CommonModal = ({
  isOpen,
  onClose,
  name,
  setterFunction,
  actionButton,
}) => {
  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent
          sx={{
            p: 5,
            gap: 3,
          }}
        >
          <Input
            variant="filled"
            placeholder="Project name"
            onChange={(e) => setterFunction(e.target.value)}
          />
          <Button
            colorScheme="orange"
            onClick={() => {
              onClose();
              actionButton();
            }}
          >
            {name}{" "}
          </Button>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CommonModal;
