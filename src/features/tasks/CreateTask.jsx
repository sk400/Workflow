import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";

import { IoClose, IoCloudUploadSharp } from "react-icons/io5";
import { useState } from "react";
import { createReference, db } from "../../firebase";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateTask = ({ categoryId, setShow }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { projectId } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const queryClient = useQueryClient();

  const uploadImage = (e) => {
    const file = e.target.files[0];
    const acceptedFormats = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg",
    ];
    if (!acceptedFormats.includes(file.type)) {
      alert("Only image formats are accepted");
      return;
    }

    try {
      const name = file.name.split(".")[0];
      const imageRef = createReference(name);

      uploadBytes(imageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImageUrl(url);
        });
      });

      console.log("File uploaded successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setTaskData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async () => {
    if (
      !taskData?.title?.length ||
      !taskData?.description?.length ||
      !taskData?.deadline?.length
    ) {
      alert("Task name or description cannot be empty");
      return;
    }

    try {
      const categoryRef = doc(
        db,
        "users",
        user?.email,
        "projects",
        projectId,
        "categories",
        categoryId
      );

      const project = await getDoc(categoryRef);

      const projectData = project.data();

      const newTask = {
        ...taskData,
        id: Date.now(),
        imageUrl,
        createdAt: Date.now(),
      };
      setShow(false);
      await updateDoc(categoryRef, {
        tasks: [...projectData?.tasks, newTask],
      });

      setTaskData({ title: "", description: "" });
      setImageUrl("");

      console.log("Task added successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const createMutation = useMutation({
    mutationFn: handleClick,
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["categories", projectId] });

      const previousCategories = queryClient.getQueryData({
        queryKey: ["categories", projectId],
      });

      queryClient.setQueryData(["categories", projectId], (oldCategories) => {
        const updatedCategories = oldCategories?.map((oldCategory) => {
          if (oldCategory.id === categoryId) {
            return {
              ...oldCategory,
              tasks: [
                ...oldCategory.tasks,
                { ...taskData, imageUrl, id: Date.now() },
              ],
            };
          }
          return oldCategory;
        });

        return updatedCategories;
      });
      setShow(false);
      return { previousCategories };
    },
    onError: (context) => {
      queryClient.setQueryData(
        ["categories", projectId],
        context?.previousCategories
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", projectId] });
    },
  });

  return (
    <Box
      sx={{
        bgColor: "#20212C",
        color: "#D3D3D6",
        mt: 5,
        p: 3,
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        gap: 4,
        width: "300px",
      }}
    >
      <Heading size="sm" fontWeight="medium">
        Create new task
      </Heading>
      <Input
        variant="outline"
        name="title"
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
        focusBorderColor="#3772FF"
        autoComplete="off"
        placeholder="Title"
        value={taskData?.title}
        onChange={handleChange}
      />
      <Input
        variant="outline"
        type="date"
        name="deadline"
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
        focusBorderColor="#3772FF"
        autoComplete="off"
        placeholder="Deadline"
        value={taskData?.deadline}
        onChange={handleChange}
      />
      <Textarea
        name="description"
        placeholder="About the task"
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
        focusBorderColor="#3772FF"
        rows={6}
        resize="none"
        autoComplete="off"
        variant="outline"
        value={taskData?.description}
        onChange={handleChange}
      />

      {/* Image upload button */}

      {imageUrl ? (
        <Box sx={{ position: "relative", width: "100%" }}>
          <Image
            src={imageUrl}
            alt="image"
            objectFit="cover"
            borderRadius="14px"
          />
          <Icon
            as={IoClose}
            color="#a0aec0"
            w={6}
            h={6}
            sx={{
              position: "absolute",
              top: 3,
              right: 3,
              cursor: "pointer",
            }}
            onClick={() => setImageUrl(null)}
          />
        </Box>
      ) : (
        <>
          <label>
            <Flex
              width="100%"
              justifyContent="center"
              alignItems="center"
              sx={{
                bgColor: "#272A30",
                p: 3,
                borderRadius: "8px",
                color: "#a0aec0",
                cursor: "pointer",
                _hover: {
                  bgColor: "#272A30",
                  opacity: 0.8,
                },
              }}
            >
              <HStack>
                <Icon as={IoCloudUploadSharp} color="#a0aec0" w={6} h={6} />
                <Text>Upload</Text>
              </HStack>
            </Flex>
            <input
              type="file"
              name="upload-image"
              onChange={uploadImage}
              style={{
                width: "0px",
                height: "0px",
              }}
            />
          </label>
        </>
      )}

      <Button
        sx={{
          bgColor: "#3772FF",
          color: "gray.50",
          _hover: {
            bgColor: "#3772FF",
            opacity: 0.8,
          },
        }}
        onClick={() => {
          createMutation.mutate();
        }}
      >
        Done
      </Button>
    </Box>
  );
};

export default CreateTask;

// "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
