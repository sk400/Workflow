import {
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
  actionFunction,
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

  const handleClick = () => {
    if (!item?.name?.length || !item?.description?.length) {
      alert("Project name or description cannot be empty");
      return;
    }
    onClose();
    actionFunction();
  };

  return (
    <>
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
            placeholder="Project name"
            value={item?.name}
            onChange={handleChange}
          />
          <Textarea
            name="description"
            placeholder="Item description"
            sx={{
              bgColor: "#2d3748",
              color: "#a0aec0",
              _hover: {
                bgColor: "#2d3748",
                opacity: 0.8,
              },
            }}
            focusBorderColor="#7259C6"
            rows={6}
            resize="none"
            autoComplete="off"
            variant="filled"
            value={item?.description}
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
            {name}{" "}
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommonModal;
