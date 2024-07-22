// Useful functions

const renderFirstProject = async () => {
  try {
    const data = await getDocs(q);
    const documents = data?.docs?.map((doc) => ({
      ...doc?.data(),
      id: doc?.id,
    }));

    if (documents?.length) {
      navigate(`/project/${documents[0].id}`);
    } else {
      navigate("/");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  } finally {
    navigate("/");
  }
};
