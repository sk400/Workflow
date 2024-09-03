import {
  Avatar,
  Button,
  Heading,
  Icon,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { PiSignOut } from "react-icons/pi";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { MdEdit } from "react-icons/md";

const UserButton = ({ sidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [profileInfo, setProfileInfo] = useState({
    name: user?.name || "",
    photo: user?.photo || "",
  });
  const { onOpen, onClose, isOpen } = useDisclosure();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileInfo.name || !profileInfo.photo) {
      toast({
        title: "Error",
        description: "Please enter name and photo url",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      await updateProfile(auth.currentUser, {
        displayName: profileInfo.name,
        photoURL: profileInfo.photo,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          name: profileInfo.name,
          photo: profileInfo.photo,
        })
      );
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.log(error);

      setLoading(false);
      onClose();
    }
  };

  // saumyakantapanda82@gmail.com
  // Saumya@123456

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Avatar
            name={user?.name}
            src={user?.photo}
            cursor={"pointer"}
            sx={{
              display: sidebar ? "block" : { base: "none", md: "block" },
            }}
          />
        </PopoverTrigger>
        <PopoverContent
          sx={{
            bgColor: "#272A30",
            color: "gray.50",
            border: "none",
          }}
        >
          <PopoverBody
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 5,
              position: "relative",
            }}
          >
            <Avatar
              name={user?.name}
              src={user?.photo}
              cursor={"pointer"}
              sx={{
                display: sidebar ? "block" : { base: "none", md: "block" },
              }}
            />
            <Text fontSize="md" fontWeight="medium">
              {user?.name}
            </Text>
            <Text fontSize="sm" fontWeight="light">
              {user?.email}
            </Text>
            <Icon
              as={PiSignOut}
              onClick={() => signOut(auth)}
              sx={{
                position: "absolute",
                top: 3,
                left: 3,
                cursor: "pointer",
              }}
            />
            <Icon
              as={MdEdit}
              onClick={onOpen}
              sx={{
                position: "absolute",
                top: 3,
                right: 3,
                cursor: "pointer",
              }}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent
          sx={{
            p: 5,
            gap: 3,
            color: "#a0aec0",
            bgColor: "#272A30",
          }}
        >
          <Heading size="sm" fontWeight="medium">
            Edit profile
          </Heading>
          <form onSubmit={handleSubmit}>
            <Input
              variant="outline"
              name="name"
              sx={{
                bgColor: "#20212C",
                color: "#a0aec0",
                _hover: {
                  bgColor: "#20212C",
                  opacity: 0.8,
                },
              }}
              isInvalid
              errorBorderColor="#4A4B52"
              focusBorderColor="#7259C6"
              autoComplete="off"
              placeholder="Name"
              mb={4}
              value={profileInfo.name}
              onChange={(e) =>
                setProfileInfo({ ...profileInfo, name: e.target.value })
              }
            />
            <Input
              variant="outline"
              name="photo"
              sx={{
                bgColor: "#20212C",
                color: "#a0aec0",
                _hover: {
                  bgColor: "#20212C",
                  opacity: 0.8,
                },
              }}
              isInvalid
              errorBorderColor="#4A4B52"
              focusBorderColor="#7259C6"
              autoComplete="off"
              placeholder="Photo URL"
              mb={4}
              value={profileInfo.photo}
              onChange={(e) =>
                setProfileInfo({ ...profileInfo, photo: e.target.value })
              }
            />
            <Button
              type="submit"
              variant="solid"
              isLoading={loading}
              sx={{
                bgColor: "#7259C6",
                color: "gray.50",
                _hover: {
                  bgColor: "#7259C6",
                  opacity: 0.8,
                },
              }}
            >
              Update
            </Button>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserButton;
