import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

const user = JSON.parse(localStorage.getItem("user"));

export const getCategories = async (projectId) => {
  try {
    const q = query(
      collection(db, "users", user?.email, "projects", projectId, "categories"),
      orderBy("createdAt", "asc")
    );

    const querySnapshot = await getDocs(q);
    const categories = querySnapshot.docs.map((doc) => ({
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
