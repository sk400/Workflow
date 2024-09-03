import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Flex,
  ListItem,
  ListIcon,
  Icon,
  List,
  Text,
  Image,
  Spacer,
  DrawerCloseButton,
  DrawerFooter,
  Popover,
  Avatar,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
} from "@chakra-ui/react";

import CreateProject from "../features/projects/CreateProject";

import { MdLabel, MdDelete } from "react-icons/md";
import { FaTasks } from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";
import { GoProjectRoadmap } from "react-icons/go";
import logo from "../assets/workflow-logo.png";
import { PiSignOut } from "react-icons/pi";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import UserButton from "./UserButton";

const sidebarItemsData = [
  {
    title: "Projects",
    icon: FaTasks,
    path: "/",
  },
  {
    title: "Labels",
    icon: MdLabel,
    path: "/labels",
  },
  {
    title: "Bin",
    icon: MdDelete,
    path: "/bin",
  },
];

const Sidebar = ({ isOpen, btnRef, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const getProjects = async () => {
    try {
      const userProjectsRef = collection(db, "users", user?.email, "projects");
      const querySnapshot = await getDocs(
        query(userProjectsRef, orderBy("createdAt", "desc"))
      );
      const projectsData = querySnapshot?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return projectsData;
    } catch (error) {
      console.error("Error fetching user projects: ", error);
    }
  };

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    select: (data) => {
      return data?.filter((project) => project?.isDeleted === false);
    },
  });

  return (
    <Box>
      {/* Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          sx={{
            bgColor: "#17181F",
          }}
        >
          <DrawerCloseButton color="gray.50" />
          <DrawerHeader></DrawerHeader>

          <DrawerBody
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <List spacing={2}>
              {sidebarItemsData.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    cursor: "pointer",
                    bgColor: pathname === item.path ? "#272A30" : "#17181F",
                    color: pathname === item.path ? "gray.50" : "#828388",
                    borderRadius: "lg",
                    p: 2,
                    fontSize: "18px",
                    fontWeight: 400,
                    _hover: {
                      bg: pathname === item.path ? "#272A30" : "#17181F",
                    },
                  }}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                >
                  <ListIcon
                    sx={{
                      width: "30px",
                      height: "30px",
                      mb: "-2px",
                    }}
                  >
                    <Icon
                      as={item.icon}
                      sx={{
                        color: pathname === item.path ? "gray.50" : "#828388",
                      }}
                    />
                  </ListIcon>

                  {item.title}
                </ListItem>
              ))}
            </List>

            <Flex direction="column" width="100%" gap={3}>
              {/* Create project */}
              <Flex
                sx={{
                  color: "#828388",
                  letterSpacing: "1px",
                  px: 1,
                }}
                alignItems="center"
              >
                <Text>PROJECTS</Text>
                <Spacer />
                <CreateProject sidebar />
              </Flex>
              {/* Project list */}
              <Flex
                sx={{
                  width: "100%",
                  bgColor: "#20212C",
                  p: 1.5,
                  borderRadius: "18px",
                }}
              >
                <List
                  sx={{
                    width: "100%",
                  }}
                >
                  {projects?.map((item) => (
                    <ListItem
                      key={item?.id}
                      sx={{
                        cursor: "pointer",
                        bgColor: "#20212C",
                        color:
                          pathname.includes(item?.id) === true
                            ? "gray.50"
                            : "#828388",
                        borderRadius: "lg",
                        p: 2,
                        width: "100%",
                        fontSize: "18px",
                        fontWeight: 400,
                      }}
                      onClick={() => {
                        navigate(`/projects/${item?.id}`);
                        onClose();
                      }}
                    >
                      <ListIcon
                        sx={{
                          width: "25px",
                          height: "25px",
                        }}
                      >
                        <Icon
                          as={GoProjectRoadmap}
                          sx={{
                            color:
                              pathname.includes(item?.id) === true
                                ? "gray.50"
                                : "#828388",
                          }}
                        />
                      </ListIcon>

                      {item.name}
                    </ListItem>
                  ))}
                </List>
              </Flex>
            </Flex>
          </DrawerBody>
          <DrawerFooter>
            {/* <Popover>
              <PopoverTrigger>
                <Avatar
                  name={user?.name}
                  src={user?.photo}
                  cursor={"pointer"}
                  boxSize={"30px"}
                />
              </PopoverTrigger>
              <PopoverContent
                sx={{
                  width: "150px",
                  bgColor: "#272A30",
                  color: "gray.50",
                  border: "none",
                }}
              >
                <PopoverBody>
                  <Button
                    leftIcon={<PiSignOut />}
                    variant="solid"
                    onClick={() => signOut(auth)}
                    sx={{
                      bgColor: "#272A30",
                      color: "gray.50",
                      _hover: {
                        bgColor: "#272A30",
                        opacity: "0.8",
                      },
                    }}
                  >
                    Sign out
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover> */}
            <UserButton sidebar />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Box
        sx={{
          width: "250px",
          p: 3,
          display: {
            base: "none",
            md: "flex",
          },
          flexDirection: "column",
          gap: 7,
          bgColor: "#17181F",
          height: "100vh",
          borderRight: "solid 4px",
          borderRightColor: "#212329",
        }}
      >
        <Image
          src={logo}
          alt="Workflow Logo"
          objectFit={"cover"}
          sx={{
            width: { base: "70px", sm: "90", md: "100px" },
            height: { base: "70px", sm: "90", md: "100px" },
            mt: "-20px",
            ml: "-20px",
          }}
        />
        {/* Page routes */}
        <List spacing={1}>
          {sidebarItemsData.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                cursor: "pointer",
                bgColor: pathname === item.path ? "#272A30" : "#17181F",
                color: pathname === item.path ? "gray.50" : "#828388",
                borderRadius: "lg",
                p: 2,
                fontSize: "18px",
                fontWeight: 400,
                _hover: {
                  bg: pathname === item.path ? "#272A30" : "#17181F",
                },
                // borderRight: pathname === item.path && "3px solid",
                // borderRightColor: pathname === item.path && "#7259C6",
              }}
              onClick={() => {
                navigate(item.path);
              }}
            >
              <ListIcon
                sx={{
                  width: "30px",
                  height: "30px",
                  mb: "-2px",
                }}
              >
                <Icon
                  as={item.icon}
                  sx={{
                    color: pathname === item.path ? "gray.50" : "#828388",
                  }}
                />
              </ListIcon>

              {item.title}
            </ListItem>
          ))}
        </List>

        {/* Projects container */}
        <Flex direction="column" width="100%" gap={3}>
          {/* Create project */}
          <Flex
            sx={{
              color: "#828388",
              letterSpacing: "1px",
              px: 1,
            }}
            alignItems="center"
          >
            <Text>PROJECTS</Text>
            <Spacer />
            <CreateProject sidebar />
          </Flex>
          {/* Project list */}
          <Flex
            sx={{
              width: "100%",
              bgColor: "#20212C",
              p: 1.5,
              borderRadius: "18px",
            }}
          >
            <List
              sx={{
                width: "100%",
              }}
            >
              {projects?.map((item) => (
                <ListItem
                  key={item?.id}
                  sx={{
                    cursor: "pointer",
                    bgColor: "#20212C",
                    color:
                      pathname.includes(item?.id) === true
                        ? "gray.50"
                        : "#828388",
                    borderRadius: "lg",
                    p: 2,
                    width: "100%",
                    fontSize: "18px",
                    fontWeight: 400,
                  }}
                  onClick={() => {
                    navigate(`/projects/${item?.id}`);
                  }}
                >
                  <ListIcon
                    sx={{
                      width: "25px",
                      height: "25px",
                    }}
                  >
                    <Icon
                      as={GoProjectRoadmap}
                      sx={{
                        color:
                          pathname.includes(item?.id) === true
                            ? "gray.50"
                            : "#828388",
                      }}
                    />
                  </ListIcon>

                  {item.name}
                </ListItem>
              ))}
            </List>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Sidebar;
