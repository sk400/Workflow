import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export const useGetRealtimeData = (user, projectId) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) return;
    const taskQuery = query(
      user &&
        collection(
          db,
          "users",
          user?.email,
          "projects",
          projectId,
          "categories"
        ),
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
