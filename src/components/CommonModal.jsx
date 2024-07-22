import {
  Box,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";

const CommonModal = ({
  isOpen,
  onClose,
  name,
  item,
  setterFunction,
  actionButton,
}) => {
  const handleChange = (e) => {
    setterFunction({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

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
            name="name"
            autoComplete="off"
            placeholder="Project name"
            value={item?.name}
            onChange={handleChange}
          />
          <Textarea
            name="description"
            placeholder="Item description"
            rows={6}
            resize="none"
            autoComplete="off"
            variant="filled"
            value={item?.description}
            onChange={handleChange}
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

// ui update
// create project function
// edit project function
