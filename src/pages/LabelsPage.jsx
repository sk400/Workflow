import { useQuery } from "@tanstack/react-query";
import { Box, Wrap, WrapItem } from "@chakra-ui/react";
import CreateLabel from "../features/labels/CreateLabel";
import { Loading } from "../components";
import Label from "../features/labels/Label";
import { getLabels } from "../lib/functions";

const LabelsPage = () => {
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
