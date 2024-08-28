import { Button, useDisclosure } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";

import { useParams } from "react-router-dom";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import CommonCategoryModal from "./CommonCategoryModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateCategory = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { projectId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  /**
   * Handles the creation of a new category when the user clicks the "Create"
   * button.
   *
   * @return {Promise<void>} - A Promise that resolves when the category is
   *   created.
   */
  const handleClick = async () => {
    // Check if the user has entered a category name
    if (!categoryName) {
      // If the category name is empty, alert the user and return early
      alert("Please enter a category name");
      return;
    }

    // Get a reference to the categories collection for the current user and
    // project
    const categoriesRef = collection(
      db,
      "users",
      user?.email,
      "projects",
      projectId,
      "categories"
    );

    // Close the modal after the user clicks the "Create" button
    onClose();

    // Add a new document to the categories collection with the category name
    // and the current timestamp
    await addDoc(categoriesRef, {
      name: categoryName,
      createdAt: serverTimestamp(),
      tasks: [],
    });

    // Log a success message to the console when the category is created
    console.log("Category created successfully");

    // Reset the category name state to an empty string after the category is
    // created
    setCategoryName("");
  };

  const handleChange = (e) => {
    if (e?.target?.value?.length <= 20) setCategoryName(e?.target?.value);
  };

  const mutationCreate = useMutation({
    mutationFn: handleClick,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", projectId] });
    },
  });

  return (
    <>
      <Button
        variant="solid"
        borderRadius="18px"
        bgColor="gray.50"
        color="black"
        size="xs"
        sx={{
          px: 3,
          py: 3.5,
          _hover: {
            opacity: 0.8,
          },
        }}
        rightIcon={<IoMdAdd />}
        onClick={onOpen}
      >
        Category
      </Button>
      <CommonCategoryModal
        type="Create"
        isOpen={isOpen}
        onClose={onClose}
        categoryName={categoryName}
        handleChange={handleChange}
        handleClick={mutationCreate.mutate}
      />
    </>
  );
};

export default CreateCategory;
