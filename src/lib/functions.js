import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

const user = JSON.parse(localStorage.getItem("user"));

export const getCategories = async (projectId) => {
  try {
    const q = query(
      collection(db, "users", user?.email, "projects", projectId, "categories"),
      orderBy("createdAt", "asc")
    );

    const querySnapshot = await getDocs(q);
    const categories = querySnapshot?.docs?.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return categories;
  } catch (error) {
    console.error("Error getting document:", error);
  }
};

export const getProjects = async () => {
  try {
    const userProjectsRef = collection(db, "users", user?.email, "projects");
    const querySnapshot = await getDocs(
      query(userProjectsRef, orderBy("createdAt", "asc"))
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

export const getLabels = async () => {
  const labelsRef = collection(db, "users", user?.email, "labels");
  const labelsSnap = await getDocs(
    query(labelsRef, orderBy("createdAt", "asc"))
  );
  const labelsList = labelsSnap.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return labelsList;
};

export const fetchLabel = async (reference) => {
  try {
    const label = await getDoc(reference);
    return label.data();
  } catch (error) {
    console.log(error);
  }
};

export const clearBinProjects = async () => {
  try {
    const q = query(
      collection(db, "users", user?.email, "projects"),
      where("isDeleted", "==", true)
    );
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log("Bin projects are deleted successfully");
  } catch (error) {
    console.error("Error clearing bin: ", error);
  }
};

export const clearBinTasks = async (binTasks) => {
  try {
    if (!binTasks?.length) {
      return;
    }

    const batch = writeBatch(db);

    binTasks?.forEach(async (task) => {
      // find the category in firestore

      const categoryRef = doc(
        db,
        "users",
        user?.email,
        "projects",
        task?.projectId,
        "categories",
        task?.categoryId
      );

      const categorySnap = await getDoc(categoryRef);
      const categoryData = categorySnap.data();

      // Remove the task from the category
      const updatedTasks = categoryData?.tasks?.filter(
        (t) => t?.id !== task?.id
      );

      // Save the update the category
      await updateDoc(categoryRef, {
        tasks: updatedTasks,
      });
    });

    console.log("Bin tasks are deleted successfully");
  } catch (error) {
    console.error("Error clearing bin: ", error);
  }
};
