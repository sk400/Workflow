import {
  HStack,
  IconButton,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  useDisclosure,
  Heading,
  Tag,
  TagLeftIcon,
  TagLabel,
  ModalFooter,
  Tooltip,
  Button,
  FormControl,
  Textarea,
  Select,
  Input,
  Box,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useGlobalState } from "../context";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  MdDelete,
  MdMoreVert,
  MdDateRange,
  MdOutlinePriorityHigh,
  MdEdit,
  MdDone,
  MdDoneAll,
} from "react-icons/md";

const Todo = ({ todo }) => {
  const { user } = useGlobalState();
  const { projectId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [taskDataToUpdate, setTaskDataToUpdate] = useState(todo);

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  // Delete task

  const deleteTask = async () => {
    try {
      const taskDocRef = doc(
        db,
        "users",
        user?.email,
        "projects",
        projectId,
        "tasks",
        todo?.id
      );
      await deleteDoc(taskDocRef);
      console.log(`Task ${todo?.id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Edit task

  const editTask = async (dataToUpdate) => {
    try {
      const taskDocRef = doc(
        db,
        "users",
        user?.email,
        "projects",
        projectId,
        "tasks",
        todo?.id
      );

      await updateDoc(taskDocRef, dataToUpdate);
      console.log(`Task ${todo?.id} updated successfully`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Mark task as completed

  const handleChange = (e) => {
    setTaskDataToUpdate({
      ...taskDataToUpdate,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Card size={"sm"} variant={"elevated"}>
        <CardHeader
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <HStack>
            <Text
              sx={{
                fontWeight: "semibold",
                fontSize: "20px",
                fontFamily: "josefin",
              }}
            >
              {todo?.name}
            </Text>
            {todo?.done && (
              <MdDoneAll
                size="20px"
                style={{
                  color: "#FAA136",
                }}
              />
            )}
          </HStack>
          <IconButton
            sx={{
              bgColor: "#FFFBEF",
              _hover: {
                bgColor: "#FFFBEF",
              },
            }}
            onClick={onOpen}
          >
            <MdMoreVert
              size="25px"
              style={{
                color: "#FAA136",
              }}
            />
          </IconButton>
        </CardHeader>
        <CardBody
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 3,
          }}
        >
          <Text
            sx={{
              fontFamily: "josefin",
            }}
          >
            {todo?.description}
          </Text>
        </CardBody>
      </Card>

      {/* Task details modal */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody sx={{ px: 5, py: 10, fontFamily: "josefin" }}>
            <VStack spacing={5} alignItems={"flex-start"}>
              {/* Heading: name */}

              <Heading>{todo?.name}</Heading>

              {/* Tag: date and priority */}

              <HStack spacing={3}>
                <Tooltip hasArrow label="Last date" bg="gray.300" color="black">
                  <Tag size={"md"} variant="subtle" colorScheme="orange" pr={4}>
                    <TagLeftIcon boxSize="25px" mt={2.5}>
                      <MdDateRange />
                    </TagLeftIcon>
                    <TagLabel>{todo?.date}</TagLabel>
                  </Tag>
                </Tooltip>

                {/* Tag: priority */}
                <Tooltip hasArrow label="Priority" bg="gray.300" color="black">
                  <Tag size={"md"} variant="subtle" colorScheme="orange" pr={4}>
                    <TagLeftIcon boxSize="25px" mt={2.5}>
                      <MdOutlinePriorityHigh />
                    </TagLeftIcon>
                    <TagLabel textTransform={"capitalize"}>
                      {todo?.priority}
                    </TagLabel>
                  </Tag>
                </Tooltip>
              </HStack>

              {/* Text: description */}

              <Text>{todo?.description}</Text>
            </VStack>
          </ModalBody>

          {/* Action buttons */}

          <ModalFooter>
            <HStack>
              {todo?.done ? (
                <Tooltip hasArrow label="Completed" bg="gray.300" color="black">
                  <IconButton
                    sx={{
                      bgColor: "#FFFBEF",
                      _hover: {
                        bgColor: "#FFFBEF",
                      },
                    }}
                    onClick={() => editTask({ done: false })}
                  >
                    <MdDoneAll size="20px" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip
                  hasArrow
                  label="Mark as done"
                  bg="gray.300"
                  color="black"
                >
                  <IconButton
                    sx={{
                      bgColor: "#FFFBEF",
                      _hover: {
                        bgColor: "#FFFBEF",
                      },
                    }}
                    onClick={() => editTask({ done: true })}
                  >
                    <MdDone size="20px" />
                  </IconButton>
                </Tooltip>
              )}

              {/* Edit task */}

              <Tooltip hasArrow label="Edit" bg="gray.300" color="black">
                <IconButton
                  sx={{
                    bgColor: "#FFFBEF",
                    _hover: {
                      bgColor: "#FFFBEF",
                    },
                  }}
                  onClick={onOpen2}
                >
                  <MdEdit size="20px" />
                </IconButton>
              </Tooltip>

              {/* Delete task */}

              <Tooltip hasArrow label="Delete" bg="gray.300" color="black">
                <IconButton
                  sx={{
                    bgColor: "#FFFBEF",
                    _hover: {
                      bgColor: "#FFFBEF",
                    },
                  }}
                  onClick={onOpen1}
                >
                  <MdDelete size="20px" color="red" />
                </IconButton>
              </Tooltip>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete confirmation modal */}

      <Modal isOpen={isOpen1} onClose={onClose1}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this task? </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose1}>
              Close
            </Button>
            <Button
              variant="red"
              onClick={() => {
                // navigate("/");
                deleteTask();
                onClose1();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit modal */}

      <Modal isOpen={isOpen2} onClose={onClose2}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody sx={{ px: 5, py: 10, fontFamily: "josefin" }}>
            <Box>
              <VStack spacing={5}>
                {/* Task name */}
                <FormControl isRequired>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Item name"
                    autoComplete="off"
                    variant="filled"
                    value={taskDataToUpdate?.name}
                    onChange={handleChange}
                  />
                </FormControl>

                {/* Date and time */}

                <FormControl isRequired>
                  <Input
                    placeholder="Select Date and Time"
                    size="md"
                    type="date"
                    name="date"
                    variant="filled"
                    value={taskDataToUpdate?.date}
                    onChange={handleChange}
                  />
                </FormControl>

                {/* Priority */}

                <FormControl isRequired>
                  <Select
                    variant="filled"
                    placeholder="Priority"
                    value={taskDataToUpdate?.priority}
                    onChange={handleChange}
                    name="priority"
                  >
                    <option value="high">High priority</option>
                    <option value="medium">Medium priority</option>
                    <option value="low">Low priority</option>
                  </Select>
                </FormControl>

                {/* Task description */}

                <FormControl isRequired>
                  <Textarea
                    name="description"
                    placeholder="Item description"
                    rows={6}
                    resize="none"
                    autoComplete="off"
                    variant="filled"
                    value={taskDataToUpdate?.description}
                    onChange={handleChange}
                  />
                </FormControl>

                {/* Add button */}

                <Button
                  colorScheme="orange"
                  bg="orange.400"
                  color="white"
                  _hover={{
                    bg: "orange.500",
                  }}
                  width="full"
                  onClick={() => {
                    onClose2();
                    editTask(taskDataToUpdate);
                  }}
                >
                  Save
                </Button>
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Todo;
