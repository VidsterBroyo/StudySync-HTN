import React from 'react';
import {
    Flex,
    Box,
    Heading,
    WrapItem,
    Image,
    Text,
    SimpleGrid,
    VStack
} from "@chakra-ui/react";

function openGroup(groupName) {
    localStorage.setItem("groupName", groupName);
    window.location.href = "/group";
}

function Profile() {
    return (
        <Flex minH="100vh" direction="column" bg="purple.200" p={5}>
            {/* Back Button */}
            <Box
                position="absolute"
                top={4}
                left={4}
                p={2}
                bg="gray.700"
                color="white"
                borderRadius="full"
                cursor="pointer"
                onClick={() => window.location.href = "/"}
                fontSize="2xl"
                fontWeight="bold"
                textAlign="center"
                width="40px"
                height="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{
                    bg: 'gray.600',
                    transform: 'scale(1.1)'
                }}
            >
                &lt;
            </Box>

            {/* Heading */}
            <Heading color="white" size="xl" mb={8} textAlign="center">
                Your Classes
            </Heading>

            {/* Class Container */}
            <VStack
                bg="white"
                p={5}
                borderRadius="lg"
                boxShadow="lg"
                width="100%"
                maxW="1200px"
                mx="auto"
                overflowY="auto"
                spacing={5}
                height="400px"
                border="2px dashed gray"
            >
                <Text fontSize="xl" fontWeight="bold" color="purple.600">
                    Which class shall you be summarizing today?
                </Text>
                <SimpleGrid columns={[1, 2, 3]} spacing={10} width="100%">
                    {/* Class Box 1 - History */}
                    <WrapItem>
                        <Box
                            bg="purple.100"
                            onClick={() => openGroup("History")}
                            cursor="pointer"
                            transition="all 0.3s ease-in-out"
                            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                            borderRadius="lg"
                            _hover={{
                                transform: "translateY(-5px)",
                                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                            }}
                        >
                            <Flex direction="column" align="center">
                                <Image
                                    src={"/img/history.jpg"}
                                    boxSize="250px"
                                    objectFit="cover"
                                />
                                <Box p={3}>
                                    <Text
                                        align="center"
                                        fontFamily="Montserrat, sans-serif"
                                        fontWeight="bold"
                                        color="purple.800"
                                    >
                                        Mr. Baldur: History 4U
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </WrapItem>

                    {/* Class Box 2 - English */}
                    <WrapItem>
                        <Box
                            bg="purple.100"
                            onClick={() => openGroup("English")}
                            cursor="pointer"
                            transition="all 0.3s ease-in-out"
                            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                            borderRadius="lg"
                            _hover={{
                                transform: "translateY(-5px)",
                                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                            }}
                        >
                            <Flex direction="column" align="center">
                                <Image
                                    src={"/img/engrish.png"}
                                    boxSize="250px"
                                    objectFit="cover"
                                />
                                <Box p={3}>
                                    <Text
                                        align="center"
                                        fontFamily="Montserrat, sans-serif"
                                        fontWeight="bold"
                                        color="purple.800"
                                    >
                                        Mrs. Smith: English 4U
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </WrapItem>

                    {/* Class Box 3 - Computer Science */}
                    <WrapItem>
                        <Box
                            bg="purple.100"
                            onClick={() => openGroup("Computer Science")}
                            cursor="pointer"
                            transition="all 0.3s ease-in-out"
                            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                            borderRadius="lg"
                            _hover={{
                                transform: "translateY(-5px)",
                                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                            }}
                        >
                            <Flex direction="column" align="center">
                                <Image
                                    src={"/img/cs.png"}
                                    boxSize="250px"
                                    objectFit="cover"
                                />
                                <Box p={3}>
                                    <Text
                                        align="center"
                                        fontFamily="Montserrat, sans-serif"
                                        fontWeight="bold"
                                        color="purple.800"
                                    >
                                        Mr. Bulhao: Computer Science 4U
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </WrapItem>

                    {/* Class Box 4 - French */}
                    <WrapItem>
                        <Box
                            bg="purple.100"
                            onClick={() => openGroup("French")}
                            cursor="pointer"
                            transition="all 0.3s ease-in-out"
                            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                            borderRadius="lg"
                            _hover={{
                                transform: "translateY(-5px)",
                                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                            }}
                        >
                            <Flex direction="column" align="center">
                                <Image
                                    src={"/img/french.png"}
                                    boxSize="250px"
                                    objectFit="cover"
                                />
                                <Box p={3}>
                                    <Text
                                        align="center"
                                        fontFamily="Montserrat, sans-serif"
                                        fontWeight="bold"
                                        color="purple.800"
                                    >
                                        Mrs. Colette: French 4U
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </WrapItem>
                </SimpleGrid>
            </VStack>

            {/* Footer */}
            <Flex
                bg="purple.500"
                color="white"
                p={4}
                justifyContent="center"
                mt="auto"
            >
                <Text>© 2024 StudySync. All rights reserved.</Text>
            </Flex>
        </Flex>
    );
}

export default Profile;
