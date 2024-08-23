import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

const CommonCategoryModal = ({
  type,
  isOpen,
  onClose,
  categoryName,
  handleChange,
  handleClick,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent
        sx={{
          p: 5,
          gap: 3,
          bgColor: "#272A30",
        }}
      >
        <Input
          variant="filled"
          name="name"
          sx={{
            bgColor: "#2d3748",
            color: "#a0aec0",
            _hover: {
              bgColor: "#2d3748",
              opacity: 0.8,
            },
          }}
          focusBorderColor="#7259C6"
          autoComplete="off"
          placeholder="Name"
          value={categoryName}
          onChange={handleChange}
        />

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
            handleClick();
          }}
        >
          {type}
        </Button>
      </ModalContent>
    </Modal>
  );
};

export default CommonCategoryModal;
