import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { db } from "../firebase";

export const useGetRealtimeTasks = (user, projectId) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) return;
    const taskQuery = query(
      user &&
        collection(db, "users", user?.email, "projects", projectId, "tasks"),
      orderBy("createdAt", "asc")
    );

    setLoading(true);
    const unsubscribe = onSnapshot(
      taskQuery,
      (querySnapshot) => {
        const documents = querySnapshot?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));

        // if (documents?.length) {
        //   const highPriorityTasks = documents?.filter(
        //     (task) => task?.priority === "high"
        //   );
        //   const mediumPriorityTasks = documents?.filter(
        //     (task) => task?.priority === "medium"
        //   );
        //   const lowPriorityTasks = documents?.filter(
        //     (task) => task?.priority === "low"
        //   );

        //   let obj = {};

        //   if (highPriorityTasks?.length) {
        //     obj["high"] = highPriorityTasks;
        //   }

        //   if (mediumPriorityTasks?.length) {
        //     obj["medium"] = mediumPriorityTasks;
        //   }

        //   if (lowPriorityTasks?.length) {
        //     obj["low"] = lowPriorityTasks;
        //   }

        //   setData(obj);
        // }

        if (documents?.length) {
          setData(documents);
        } else {
          setData([]);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Error getting document:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [projectId]);
  return [data, loading];
};

export function useGiveFeedback({ title, description, status }) {
  const toast = useToast();
  return toast({
    title,
    description,
    status,
    duration: 9000,
    isClosable: true,
  });
}
