import React from 'react';
import {
    Flex,
    Box,
    Heading,
    WrapItem,
    Image,
    Text
} from "@chakra-ui/react";


function openGroup(groupName) {
    localStorage.setItem("groupName", groupName)
    window.location.href = "/group";
}

function Profile() {

    return (
        <Flex minH="100vh" direction="column" bg="background">
            <Box mb={7} mt={5} ml={5} mr={5}>
                <Heading
                    color="white"
                    size="xl"
                    mb={5}
                >
                    Your Groups
                </Heading>
           

            <WrapItem>
                <Box
                    bg="secondBackground"
                    onClick={() => openGroup("History w/ Mr. Stefanik")}
                    cursor="pointer"
                    transition="all 0.3s ease-in-out"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                    borderRadius="lg"
                    _hover={{
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                    }}
                >
                    <Flex direction="column" align="center" height="100%">
                        <Box>
                            <Image
                                src={"/img/history.jpg"}
                                boxSize="180px"
                                objectFit="cover"
                            />
                        </Box>
                        <Box
                            flex="1"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            p={2}
                        >
                            <Text
                                align="center"
                                fontFamily="Montserrat,sans-serif"
                                fontWeight="bold"
                                style={{ overflowWrap: "break-word", width: "100%" }}
                            >
                                Group 1
                            </Text>
                        </Box>


                    </Flex>
                </Box>
            </WrapItem>
            </Box>

        </Flex>
    );
}

export default Profile;
