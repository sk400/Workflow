import { Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useGlobalState } from "../context";
import { IoMdSearch } from "react-icons/io";

const Searchbar = () => {
  const { searchTerm, setSearchTerm } = useGlobalState();

  return (
    <>
      <InputGroup
        sx={{
          maxW: { base: "200px", sm: "250px", md: "400px", lg: "600px" },
        }}
      >
        <Input
          placeholder="Search"
          variant="outline"
          size="sm"
          borderRadius="18px"
          focusBorderColor="#17181F"
          color="gray.50"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <InputRightElement>
          <Icon as={IoMdSearch} color="gray.100" h={5} w={5} mt="-5px" />
        </InputRightElement>
      </InputGroup>
    </>
  );
};

export default Searchbar;
