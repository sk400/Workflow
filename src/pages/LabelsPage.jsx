import { collection, doc, getDocs } from "firebase/firestore";
import { useGlobalState } from "../context";
import { db } from "../firebase";
import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { SimpleGrid, Wrap, WrapItem } from "@chakra-ui/react";
import Task from "../features/tasks/Task";

const LabelsPage = () => {
  const { user } = useGlobalState();

  const getProjects = async () => {
    try {
      const projectsRef = collection(db, "users", user?.email, "projects");

      const projectsDocs = await getDocs(projectsRef);

      return projectsDocs;
    } catch (error) {
      throw new Error(error);
    }
  };

  const getCategoriesOfAProject = async (projectId) => {
    try {
      const projectRef = doc(db, "users", user?.email, "projects", projectId);
      const categoriesRef = collection(projectRef, "categories");
      const categoriesDocs = await getDocs(categoriesRef);
      return categoriesDocs;
    } catch (error) {
      throw new Error(error);
    }
  };

  const { data: projectIds } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    select: (data) => {
      return data?.docs?.map((doc) => doc?.id);
    },
  });

  const categoriesQueries = useQueries({
    queries: projectIds
      ? projectIds.map((projectId) => {
          return {
            queryKey: ["categories", projectId],
            queryFn: () => getCategoriesOfAProject(projectId),
            select: (data) => {
              return data?.docs?.map((doc) => {
                return {
                  id: doc?.id,
                  ...doc?.data(),
                };
              });
            },
          };
        })
      : [],
  });

  const data = categoriesQueries?.map((query) => {
    return {
      ...query.data,
    };
  });

  const nonEmptyQueries = data
    ?.filter((category) => Object.keys(category).length !== 0)
    ?.map((item) => item);

  let tasks = [];
  nonEmptyQueries?.forEach((item, index) => {
    const values = Object.values(item);
    // categories.push(...values);
    values?.forEach((item) => {
      tasks.push(...item?.tasks);
    });
  });

  console.log(tasks);

  return (
    <Wrap>
      <WrapItem>label</WrapItem>
    </Wrap>
  );
};

export default LabelsPage;
