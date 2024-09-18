import {
  Flex,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Wrap,
  WrapItem,
  IconButton,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import Project from "../features/projects/Project";
import { BinTask, DeleteModal, Loading } from "../components";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearBinProjects,
  clearBinTasks,
  getCategories,
  getProjects,
} from "../lib/functions";
import { MdDelete } from "react-icons/md";
import { useState } from "react";

const Bin = () => {
  const [dataType, setDataType] = useState("projects");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const { data: projects, isPending } = useQuery({
    queryKey: ["bin", "projects"],
    queryFn: getProjects,
    select: (data) => {
      return data?.filter((project) => project?.isDeleted === true);
    },
  });

  const { data: projectIds } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    select: (data) => {
      return data?.map((project) => project?.id);
    },
  });

  const categoriesQueries = useQueries({
    queries: projectIds
      ? projectIds.map((projectId) => {
          return {
            queryKey: ["categories", projectId],
            queryFn: () => getCategories(projectId),
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

    values?.forEach((item) => {
      tasks.push(...item?.tasks);
    });
  });

  const deletedTasks = tasks?.filter((task) => task?.isDeleted === true);

  const clearTasks = () => {
    deletedTasks?.forEach((task) => {
      const projectId = task?.projectId;
      const categoryId = task?.categoryId;

      queryClient.setQueryData(["categories", projectId], (oldCategories) => {
        const updatedCategories = oldCategories?.map((category) => {
          if (category?.id === categoryId) {
            return {
              ...category,
              tasks: category?.tasks?.filter((item) => item?.id !== task?.id),
            };
          }
          return category;
        });

        return updatedCategories;
      });
    });

    clearBinTasks(deletedTasks);
  };

  const clearProjects = () => {
    queryClient.setQueryData(["bin", "projects"], (old) => []);
    clearBinProjects();
  };

  const decideDisplayProperty = () => {
    if (dataType === "projects") {
      return projects?.length === 0 ? "none" : "block";
    } else if (dataType === "tasks") {
      return deletedTasks?.length === 0 ? "none" : "block";
    }
  };

  if (isPending) return <Loading />;

  return (
    <>
      <Tabs variant="solid-rounded">
        <TabList>
          <Tab
            _selected={{ color: "gray.100", bg: "#7259C6" }}
            onClick={() => setDataType("projects")}
          >
            Projects
          </Tab>
          <Tab
            _selected={{ color: "gray.100", bg: "#7259C6" }}
            onClick={() => setDataType("tasks")}
          >
            Tasks
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel pt={10}>
            {projects?.length > 0 ? (
              <Flex
                direction="column"
                align="center"
                width="100%"
                mx="auto"
                gap={5}
                mt={5}
                // mb={20}
              >
                <SimpleGrid
                  templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                  spacing={4}
                  width="100%"
                >
                  {projects?.map((project) => (
                    <Project item={project} key={project?.id} />
                  ))}
                </SimpleGrid>
              </Flex>
            ) : (
              <Text color="gray.50">No projects found</Text>
            )}
          </TabPanel>
          <TabPanel pt={10}>
            {deletedTasks?.length > 0 ? (
              <Wrap spacing={["10px", "40px"]}>
                {deletedTasks?.map((task) => {
                  return (
                    <WrapItem key={task?.id}>
                      <BinTask task={task} />
                    </WrapItem>
                  );
                })}
              </Wrap>
            ) : (
              <Text color="gray.50">No tasks found</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <IconButton
        icon={<Icon w={6} h={6} as={MdDelete} />}
        aria-label="Delete"
        variant="ghost"
        size="sm"
        color="gray.100"
        onClick={onOpen}
        sx={{
          position: "fixed",
          bottom: "50px",
          right: "50px",
          zIndex: "10",
          bgColor: "#7259C6",
          borderRadius: "full",
          width: "40px",
          height: "40px",
          display: decideDisplayProperty(),

          _hover: {
            opacity: 0.8,
          },
        }}
      />

      <DeleteModal
        isOpen1={isOpen}
        onClose1={onClose}
        text={`Are you sure you want to delete ${dataType} permanently?`}
        handleClick={() => {
          return dataType === "projects" ? clearProjects() : clearTasks();
        }}
      />
    </>
  );
};

export default Bin;
