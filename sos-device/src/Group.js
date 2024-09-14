import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Stack,
    useToast
} from "@chakra-ui/react";



function Profile() {
    const [groupName, setGroupName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const toast = useToast();


    // get group name on first render
    function getGroupName() {
        setGroupName(localStorage.getItem("groupName"))
        console.log(groupName);
    }

    useEffect(() => {
        getGroupName();
    }, []);



    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onFileUpload = async () => {
        if (!selectedFile) {
            toast({
                title: 'No file selected',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch("http://localhost:5000/generate-quiz", {
                method: "GET"
            });

            if (response.ok) {
                const data = await response.json();
                console.log("response from fetch:", data);

                toast({
                    title: 'File uploaded successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setSelectedFile(null);
            } else {
                throw new Error("Failed to fetch user metadata");
            }

        } catch (error) {
            toast({
                title: 'Upload failed',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error("Error fetching user metadata:", error);
        }

    };


    // const onFileUpload = async () => {
    //     if (!selectedFile) {
    //         toast({
    //             title: 'No file selected',
    //             status: 'warning',
    //             duration: 3000,
    //             isClosable: true,
    //         });
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('file', selectedFile);

    //     try {
    //         await axios.post('http://localhost:5000/upload', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //         toast({
    //             title: 'File uploaded successfully',
    //             status: 'success',
    //             duration: 3000,
    //             isClosable: true,
    //         });
    //         setSelectedFile(null);
    //     } catch (error) {
    //         toast({
    //             title: 'Upload failed',
    //             description: error.message,
    //             status: 'error',
    //             duration: 3000,
    //             isClosable: true,
    //         });
    //     }
    // };




    return (
        <Flex minH="100vh" direction="column" bg="background">
            <Box mb={7} mt={5} ml={5} mr={5}>
                <Heading
                    color="white"
                    size="xl"
                    align="center"
                    mb={5}
                >
                    {groupName}
                </Heading>


                <Box p={4} width="50%">
                    <FormControl>
                        <FormLabel>Upload lecture recording!</FormLabel>
                        <Input
                            type="file"
                            id="file-upload"
                            onChange={onFileChange}
                            accept="audio/mp3"
                        />
                    </FormControl>
                    <Stack spacing={4} mt={4}>
                        <Button colorScheme="teal" onClick={onFileUpload}>
                            Upload
                        </Button>
                    </Stack>
                </Box>

            </Box>

        </Flex>
    );
}

export default Profile;
