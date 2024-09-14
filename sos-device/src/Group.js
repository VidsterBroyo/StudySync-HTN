import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Text,
    Button,
    Stack,
    useToast
} from "@chakra-ui/react";



function Profile() {
    const [groupName, setGroupName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [transcribedText, setTranscribedText] = useState(""); // New state for transcribed text
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

    const onVideoChange = (event) => {
        setSelectedVideo(event.target.files[0]);
    };




    const onVideoUpload = async () => {
        if (!selectedVideo) {
            toast({
                title: 'No video selected',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        const formData = new FormData();
        formData.append('video', selectedVideo);
        try {
            const response = await fetch(
                "https://symphoniclabs--symphonet-vsr-modal-model-upload-static.modal.run",
                {
                    method: "POST",
                    body: formData,
                }
            );
            if (response.ok) {
                const data = await response.text();
                console.log("Transcription result:", data);
                // Set transcribed text
                setTranscribedText(data);
                toast({
                    title: 'Video uploaded and transcribed successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setSelectedVideo(null);
            } else {
                throw new Error("Failed to transcribe the video");
            }
        } catch (error) {
            toast({
                title: 'Video transcription failed',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error("Error transcribing video:", error);
        }
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
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response Data:', response.data)
            toast({
                title: 'File uploaded successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setSelectedFile(null);
        } catch (error) {
            toast({
                title: 'Upload failed',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };




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
                {/* Notes Upload */}
                <Box p={4} width="50%">
                    <FormControl>
                        <FormLabel>Upload your notes!</FormLabel>
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
                {/* Video Upload */}
                <Box p={4} width="50%">
                    <FormControl>
                        <FormLabel>Upload a voiceless video!</FormLabel>
                        <Input
                            type="file"
                            id="video-upload"
                            onChange={onVideoChange}
                            accept="video/mp4"
                        />
                    </FormControl>
                    <Stack spacing={4} mt={4}>
                        <Button colorScheme="teal" onClick={onVideoUpload}>
                            Upload and Transcribe
                        </Button>
                    </Stack>
                </Box>
                {/* Transcription Result Display */}
                {transcribedText && (
                    <Box p={4} width="50%" mt={5}>
                        <Heading size="md">Transcription Result</Heading>
                        <Text mt={2} p={2} bg="gray.100" borderRadius="md">
                            {transcribedText}
                        </Text>
                    </Box>
                )}
            </Box>
        </Flex>
    );
}

export default Profile;
