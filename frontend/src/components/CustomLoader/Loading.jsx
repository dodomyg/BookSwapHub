import { Container, Spinner } from "@chakra-ui/react";

const Loader = () => {
  return (
    <Container w={"100%"} h={"100vh"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
      <Spinner
        thickness="4px"
        size={"xl"}
        color="red.500"
        css={{ "--spinner-track-color": "colors.gray.200" }}
      />
    </Container>
  );
};

export default Loader;
