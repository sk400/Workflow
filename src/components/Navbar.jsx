import {
  Avatar,
  Box,
  Flex,
  Heading,
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
import { useGlobalState } from "../context";
import { useNavigate } from "react-router-dom";
import logo from "../assets/workflow-logo.png";
import { IoMenuOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import Searchbar from "./Searchbar";

const Navbar = ({ onOpen, btnRef }) => {
  const { user } = useGlobalState();
  const navigate = useNavigate();

  return (
    // <Flex
    //   direction={"row"}
    //   justifyContent={"space-between"}
    //   alignItems={"center"}
    //   sx={{
    //     bgColor: "#FFE794",
    //     p: { base: 3, md: 5 },
    //     position: "sticky",
    //     top: 0,
    //     left: 0,
    //     zIndex: 1,
    //     boxShadow: "sm",
    //   }}
    // >
    //   <Box
    //     sx={{
    //       display: { md: "none" },
    //     }}
    //     ref={btnRef}
    //     onClick={onOpen}
    //   >
    //     <img
    //       src={MenuButtonImage}
    //       alt="Menu Button"
    //       style={{
    //         width: "40px",
    //         height: "30px",
    //         cursor: "pointer",
    //       }}
    //     />
    //   </Box>
    //   <HStack onClick={() => navigate("/")} cursor={"pointer"}>
    //     <img
    //       src={list}
    //       alt="List Icon"
    //       style={{
    //         width: "40px",
    //         height: "40px",
    //       }}
    //     />
    //     <Heading
    //       as="h3"
    //       size="lg"
    //       sx={{
    //         fontFamily: "josefin",
    //       }}
    //     >
    //       Planner
    //     </Heading>
    //   </HStack>
    //   <Popover>
    //     <PopoverTrigger>
    //       <Avatar name={user?.name} src={user?.photo} cursor={"pointer"} />
    //     </PopoverTrigger>
    //     <PopoverContent
    //       sx={{
    //         width: "150px",
    //       }}
    //     >
    //       <PopoverArrow />

    //       <PopoverBody>
    //         <Button
    //           leftIcon={<PiSignOut />}
    //           variant="solid"
    //           onClick={() => signOut(auth)}
    //           sx={{
    //             bgColor: "white",
    //             _hover: {
    //               bgColor: "white",
    //             },
    //           }}
    //         >
    //           Sign out
    //         </Button>
    //       </PopoverBody>
    //     </PopoverContent>
    //   </Popover>
    // </Flex>

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
        }}
      />

      {/* Search bar (all screens) */}

      <Searchbar />

      <HStack alignItems="center" spacing={5}>
        {/* Create project */}
        <IconButton
          sx={{
            bgColor: "#17181F",
            color: "gray.50",
            display: { base: "none", md: "block" },
            _hover: {
              bgColor: "#17181F",
            },
          }}
        >
          <Icon as={IoMdAddCircleOutline} w={[7, 9]} h={[7, 9]} />
        </IconButton>
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
