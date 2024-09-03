import {
  Box,
  Flex,
  Heading,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLabel } from "../lib/functions";
import { IoCheckmarkDone } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
const BinTask = ({ task }) => {
  const { data: label } = useQuery({
    queryKey: ["label", task?.label?.id],
    queryFn: () => fetchLabel(task?.label),
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const projectId = task?.projectId;
  const categoryId = task?.categoryId;
  const queryClient = useQueryClient();

  // Update the categoryId on dragEND

  const restoreTask = async () => {
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

      const category = await getDoc(categoryRef);

      const categoryData = category.data();

      const array = [...categoryData?.tasks];

      const updatedArray = array?.map((item) => {
        if (item?.id === task?.id) {
          return {
            ...item,
            isDeleted: false,
          };
        }
        return item;
      });

      await updateDoc(categoryRef, {
        tasks: updatedArray,
      });

      console.log("Task updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const editMutation = useMutation({
    mutationFn: restoreTask,
    onMutate: () => {
      queryClient.cancelQueries(["categories", projectId]);
      const previousCategories = queryClient.getQueryData([
        "categories",
        projectId,
      ]);

      queryClient.setQueryData(["categories", projectId], (oldCategories) => {
        const updatedCategories = oldCategories?.map((category) => {
          if (category?.id === categoryId) {
            return {
              ...category,
              tasks: category?.tasks?.map((item) => {
                if (task?.id === item?.id) {
                  return {
                    ...task,
                    isDeleted: false,
                  };
                }
                return item;
              }),
            };
          }
          return category;
        });

        return updatedCategories;
      });

      return { previousCategories };
    },
    onError: (context) => {
      queryClient.setQueryData(
        ["categories", projectId],
        context?.previousCategories
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["categories", projectId]);
      queryClient.invalidateQueries(["label", task?.label?.ref?.id]);
    },
  });

  const date = new Date(task?.deadline);

  const formattedDate = date.toLocaleString("default", {
    month: "short",
    day: "numeric",
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
      <Flex>
        {label ? (
          <Tag
            sx={{
              borderRadius: "2xl",
              bgColor: label?.background,
              color: "gray.50",
            }}
          >
            {label?.name}
          </Tag>
        ) : (
          <Tag
            sx={{
              borderRadius: "2xl",
              bgColor: "#7259C6",
              color: "gray.50",
            }}
          >
            No label
          </Tag>
        )}
        <Spacer />
        <Text
          sx={{
            fontWeight: "medium",
          }}
        >
          {formattedDate}
        </Text>
      </Flex>
      <Heading size="sm" fontWeight="medium">
        {task?.title}{" "}
        {task?.isCompleted && (
          <Icon as={IoCheckmarkDone} color="#48CFCB" boxSize={5} />
        )}
      </Heading>
      {task?.imageUrl && (
        <Image
          src={task?.imageUrl}
          alt="image"
          objectFit="cover"
          borderRadius="14px"
        />
      )}
      <Text fontSize="xs">{task?.description}</Text>
      <Menu>
        <MenuButton
          sx={{
            bgColor: "#20212C",
            color: "#D3D3D6",
            position: "absolute",
            bottom: 2,
            right: 2,
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
              editMutation.mutate();
            }}
          >
            Restore
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default BinTask;
