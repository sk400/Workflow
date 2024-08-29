import { collection, getDocs, orderBy, query } from "firebase/firestore";

import { db } from "../firebase";

import { useQuery } from "@tanstack/react-query";
import { Box, Wrap, WrapItem } from "@chakra-ui/react";
import CreateLabel from "../features/labels/CreateLabel";
import { Loading } from "../components";
import Label from "../features/labels/Label";

const LabelsPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const getLabels = async () => {
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

  const { data: labels, isPending } = useQuery({
    queryKey: ["labels"],
    queryFn: getLabels,
  });

  if (isPending) return <Loading />;

  return (
    <Box>
      <Wrap>
        {labels?.map((label) => (
          <WrapItem key={label.id}>
            <Label label={label} />
          </WrapItem>
        ))}

        <WrapItem>
          <CreateLabel />
        </WrapItem>
      </Wrap>
    </Box>
  );
};

export default LabelsPage;
