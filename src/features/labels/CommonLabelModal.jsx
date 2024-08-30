import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Wrap,
  WrapItem,
  Box,
  Center,
  Icon,
} from "@chakra-ui/react";
import { MdOutlineCheck } from "react-icons/md";

const colors = [
  "#EF9712",
  "#D34748",
  "#3772FF",
  "#3651D9",
  "#48BB78",
  "#319795",
  "#4FD1C5",
  "#3182ce",
  "#00B5D8",
  "#805AD5",
  "#97266D",
  "#FF1F5A",
  "#17BEBB",
];

const CommonLabelModal = ({
  isOpen,
  onClose,
  setLabelData,
  labelData,
  type,
  handleClick,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent
        sx={{
          p: 5,
          gap: 3,
          bgColor: "#272A30",
        }}
      >
        <Input
          variant="filled"
          name="name"
          sx={{
            bgColor: "#2d3748",
            color: "#a0aec0",
            _hover: {
              bgColor: "#2d3748",
              opacity: 0.8,
            },
          }}
          focusBorderColor="#7259C6"
          autoComplete="off"
          placeholder="Name"
          value={labelData?.name}
          onChange={(e) =>
            setLabelData((prev) => ({ ...prev, name: e.target.value }))
          }
        />

        <Wrap
          sx={{
            bgColor: "#2d3748",
            p: 3,
            borderRadius: "4px",
          }}
        >
          {colors?.map((item) => (
            <WrapItem
              key={item}
              onClick={() =>
                setLabelData((prev) => ({ ...prev, background: item }))
              }
            >
              <Box
                sx={{
                  width: "25px",
                  height: "25px",
                  bgColor: item,
                  borderRadius: "sm",
                  cursor: "pointer",
                  opacity: labelData?.background === item ? 0.5 : 1,
                }}
              >
                <Center
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: labelData?.background === item ? "flex" : "none",
                  }}
                >
                  <Icon as={MdOutlineCheck} color="gray.50" opacity={1} />
                </Center>
              </Box>
            </WrapItem>
          ))}
        </Wrap>

        <Button
          sx={{
            bgColor: "#7259C6",
            color: "gray.50",
            _hover: {
              bgColor: "#7259C6",
              opacity: 0.8,
            },
          }}
          onClick={handleClick}
        >
          {type}
        </Button>
      </ModalContent>
    </Modal>
  );
};

export default CommonLabelModal;
