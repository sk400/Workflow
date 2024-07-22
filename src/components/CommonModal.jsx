import {
  Box,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";

const CommonModal = ({
  isOpen,
  onClose,
  name,
  item,
  setterFunction,
  actionButton,
}) => {
  /**
   * Handles the change event of the input fields in the modal.
   * Updates the state of the item using the setterFunction.
   *
   * @param {Object} e - The event object.
   * @return {void}
   */
  const handleChange = (e) => {
    // Create a new object with the current item and update the value of the field
    // specified by the event target's name with the event target's value.
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
