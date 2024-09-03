import React, { useState } from "react";
import {
  Icon,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Card,
  CardHeader,
  Heading,
  CardBody,
} from "@chakra-ui/react";

import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { CommonModal } from "../../components";
import { IoMdMore } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Project = ({ item }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projectInfo, setProjectInfo] = useState(item);
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  /**
   * Updates a project in the Firestore database.
   * This function is called when the user clicks the "Save" button in the rename project modal.
   * It first checks if the user is logged in, and if so, it updates the project in the "projects" collection of the Firestore database.
   * If the user is not logged in, it logs an error message to the console.
   * If there is an error when updating the project, it logs the error message to the console.
   */
  const updateProject = async (data) => {
    try {
      // Check if the user is logged in
      if (!user) {
        console.error("You must be logged in to update a project");
        return;
      }

      // Get a reference to the project document that needs to be updated
      const projectRef = doc(db, "users", user?.email, "projects", item?.id);

      // Update the project in the Firestore database
      await updateDoc(projectRef, data || projectInfo);

      // Log a success message to the console if the project was updated successfully
      console.log("Project updated successfully");
    } catch (error) {
      // Log any errors that occur during the updating of the project
      console.error("Error updating project: ", error);
    }
  };

  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: (data) => updateProject(data),
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["projects"] });

      const previousProjects = queryClient.getQueryData(["projects"]);

      queryClient.setQueryData(["projects"], (old) => {
        const updatedOld = old?.map((project) => {
          if (project?.id === item?.id) {
            return { ...projectInfo };
          }
          return project;
        });

        return updatedOld;
      });

      return { previousProjects };
    },
    onError: (context) => {
      queryClient.setQueryData(["projects"], context.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["bin", "projects"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (data) => updateProject(data),
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["projects"] });
      queryClient.cancelQueries({ queryKey: ["bin", "projects"] });

      const previousProjects = queryClient.getQueryData(["projects"]);
      const previousBinProjects = queryClient.getQueryData(["bin", "projects"]);

      const inHome = pathname === "/";
      queryClient.setQueryData(
        inHome ? ["projects"] : ["bin", "projects"],
        (old) => old?.filter((project) => project?.id !== item?.id)
      );

      return { previousProjects, previousBinProjects };
    },
    onError: (context) => {
      queryClient.setQueryData(["projects"], context.previousProjects);
      queryClient.setQueryData(
        ["bin", "projects"],
        context.previousBinProjects
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["bin", "projects"] });
    },
  });

  // remove edit option in bin page

  return (
    <>
      <Card
        key={item?.id}
        shadow="md"
        sx={{
          bgColor: "#272A30",
          color: "gray.50",
          height: "100%",
          borderRight: "3px solid",
          borderRightColor: "#7259C6",
          cursor: "pointer",
        }}
        onClick={() => navigate(`/projects/${item?.id}`)}
      >
        <CardHeader>
          <Heading
            size="sm"
            sx={{
              fontFamily: "josefin",
            }}
          >
            {item?.name}
          </Heading>
        </CardHeader>
        <CardBody>
          <Text
            sx={{
              fontFamily: "josefin",
            }}
          >
            {item?.description}
          </Text>
          <Menu>
            <MenuButton
              sx={{
                bgColor: "#272A30",
                color: "gray.50",
                position: "absolute",
                bottom: 1,
                right: 1,
                _hover: {
                  bgColor: "#272A30",
                },
                borderRadius: "lg",
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Icon as={IoMdMore} />
            </MenuButton>
            <MenuList
              sx={{
                bgColor: "#272A30",
                border: "none",
              }}
            >
              {pathname === "/" && (
                <MenuItem
                  sx={{
                    color: "gray.50",
                    bgColor: "#272A30",
                    _hover: {
                      bgColor: "#7259C6",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen();
                  }}
                >
                  Edit
                </MenuItem>
              )}
              <MenuItem
                sx={{
                  color: "gray.50",
                  bgColor: "#272A30",
                  _hover: {
                    bgColor: "#7259C6",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();

                  deleteMutation.mutate({
                    isDeleted: item?.isDeleted === true ? false : true,
                  });
                }}
              >
                {item?.isDeleted === true ? "Restore" : "Move to bin"}
              </MenuItem>
            </MenuList>
          </Menu>
        </CardBody>
      </Card>

      <CommonModal
        isOpen={isOpen}
        onClose={onClose}
        name="Save"
        item={projectInfo}
        setterFunction={setProjectInfo}
        actionFunction={editMutation.mutate}
      />
    </>
  );
};

export default Project;
