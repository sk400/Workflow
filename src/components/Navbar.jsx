import {
  Avatar,
  Flex,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  PopoverArrow,
  Image,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { PiSignOut } from "react-icons/pi";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import { useNavigate } from "react-router-dom";
import logo from "../assets/workflow-logo.png";
import { IoMenuOutline } from "react-icons/io5";

import Searchbar from "./Searchbar";
import CreateProject from "../features/projects/CreateProject";

const Navbar = ({ onOpen, btnRef }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <Flex
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        bgColor: "#17181F",
        p: { base: 3, md: 5 },
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 1,
        boxShadow: "sm",
      }}
    >
      {/* logo (small screen)  */}
      <Image
        src={logo}
        alt="Workflow Logo"
        objectFit={"cover"}
        sx={{
          width: { base: "70px", sm: "90", md: "100px" },
          height: { base: "70px", sm: "90", md: "100px" },
          mt: "-7px",
          display: { base: "block", md: "none" },
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      />

      {/* Search bar (all screens) */}

      <Searchbar />

      <HStack alignItems="center" spacing={5}>
        {/* Create project */}
        <CreateProject />
        {/* menu button (small screen) */}
        <IconButton
          sx={{
            bgColor: "#17181F",
            display: { md: "none" },
            _hover: {
              bgColor: "#17181F",
            },
            color: "gray.50",
            p: 0,
            m: 0,
          }}
          ref={btnRef}
          onClick={onOpen}
        >
          <Icon as={IoMenuOutline} w={8} h={8} />
        </IconButton>
        {/* User button */}
        <Popover>
          <PopoverTrigger>
            <Avatar
              name={user?.name}
              src={user?.photo}
              cursor={"pointer"}
              sx={{
                display: { base: "none", md: "block" },
              }}
            />
          </PopoverTrigger>
          <PopoverContent
            sx={{
              width: "150px",
            }}
          >
            <PopoverArrow />

            <PopoverBody>
              <Button
                leftIcon={<PiSignOut />}
                variant="solid"
                onClick={() => signOut(auth)}
                sx={{
                  bgColor: "white",
                  _hover: {
                    bgColor: "white",
                  },
                }}
              >
                Sign out
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
    </Flex>
  );
};

export default Navbar;
