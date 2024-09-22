import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Text,
  Button,
  Link,
  Stack,
  useToast,
  Wrap,
  WrapItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Switch,
  Spinner, // Import Spinner
} from "@chakra-ui/react";

function Group() {
  const [groupName, setGroupName] = useState("");
  const [lectureTitle, setLectureTitle] = useState(""); // State for lecture title
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [transcribedText, setTranscribedText] = useState(""); // State for transcribed text
  const [notes, setNotes] = useState([]); // State for notes
  const [selectedNote, setSelectedNote] = useState(null); // State for selected note
  const [isUploading, setIsUploading] = useState(false); // Loading state for upload
  const [isVideoMode, setIsVideoMode] = useState(false); // State to toggle between audio and video mode
  const [isRecording, setIsRecording] = useState(false); // State for recording status
  const [recordedBlob, setRecordedBlob] = useState(null); // State for recorded video blob
  const [mediaStream, setMediaStream] = useState(null); // Store the media stream
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls
  const toast = useToast();
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null); // Ref for the video element

  // get group name on first render
  function getGroupName() {
    const storedGroupName = localStorage.getItem("groupName");
    setGroupName(storedGroupName);
    console.log(storedGroupName);
  }

  useEffect(() => {
    getGroupName();
  }, []);

  // Load notes from the server
  async function loadNotes() {
    if (!groupName) return;

    try {
      console.log(
        `http://localhost:3001/lectures/${encodeURIComponent(groupName)}`
      );
      const response = await axios.get(
        `http://localhost:3001/lectures/${encodeURIComponent(groupName)}`
      );
      setNotes(response.data); // Assuming response.data is an array of notes
      console.log("Notes loaded:", notes);
    } catch (error) {
      console.error("Error loading notes:", error);
      toast({
        title: "Failed to load notes",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    loadNotes();
  }, [groupName]);

  const onFileChange = (event) => {
    if (isVideoMode) {
      setSelectedVideo(event.target.files[0]);
    } else {
      setSelectedFile(event.target.files[0]);
    }
    setIsFileUploaded(true); // Mark file as uploaded
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files.length > 0) {
      if (isVideoMode) {
        setSelectedVideo(event.dataTransfer.files[0]);
      } else {
        setSelectedFile(event.dataTransfer.files[0]);
      }
      setIsFileUploaded(true); // Mark file as uploaded
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onVideoUpload = async () => {
    if (!selectedVideo) {
      toast({
        title: "No video selected",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true); // Set loading state to true

    const formData = new FormData();
    formData.append("video", selectedVideo);
    try {
      const response = await fetch(
        "https://symphoniclabs--symphonet-vsr-modal-htn-model-upload-static-htn.modal.run",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.text();
        console.log("Transcription result:", data);
        setTranscribedText(data);
        // After uploading the file, add the note
        console.log("Making the request to add the note...");
        await axios.post(
          `http://localhost:3001/lectures/${encodeURIComponent(groupName)}`,
          {
            title: lectureTitle,
            notes: data, // Assuming the response data contains the content for the note
            bullets: ""
          }
        );
        console.log("Note added successfully");

        // Refresh the notes
        loadNotes();
        toast({
          title: "Video uploaded and transcribed successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setSelectedVideo(null);
      } else {
        throw new Error("Failed to transcribe the video");
      }
    } catch (error) {
      toast({
        title: "Video transcription failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error transcribing video:", error);
    } finally {
      setIsUploading(false); // Reset loading state
    }
  };

  const onFileUpload = async () => {
    if (!lectureTitle) {
      // Check if title is provided
      toast({
        title: "Missing title",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true); // Set loading state to true

    const formData = new FormData();
    if (isVideoMode) {
      if (!selectedVideo) {
        // Check if video is selected
        toast({
          title: "Missing video file",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setIsUploading(false); // Reset loading state
        return;
      }
      formData.append("file", selectedVideo);
      formData.append("title", lectureTitle); // Include lecture title in the form data
    } else {
      if (!selectedFile) {
        // Check if file is selected
        toast({
          title: "Missing audio file",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setIsUploading(false); // Reset loading state
        return;
      }
      formData.append("file", selectedFile);
      formData.append("title", lectureTitle); // Include lecture title in the form data
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response Data:", response.data);
      toast({
        title: "File uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // After uploading the file, add the note
      console.log("Making the request to add the note...");
      await axios.post(
        `http://localhost:3001/lectures/${encodeURIComponent(groupName)}`,
        {
          title: lectureTitle,
          notes: response.data.transcript, // Assuming the response data contains the content for the note
          bullets: response.data.bulletpoints
        }
      );
      console.log("Note added successfully");

      // Refresh the notes
      loadNotes();

      // Reset the form
      setSelectedFile(null);
      setSelectedVideo(null);
      setLectureTitle("");
      setIsFileUploaded(false);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false); // Reset loading state
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    onOpen(); // Open the modal
  };

  async function handleQuizMeClick() {
    try {
      let response = await axios.post("http://localhost:5000/make_quiz", {
        transcript: selectedNote?.notes,
      });

      console.log("Quiz received:", response.data["quiz"]);
      setQuizQuestions(
        Object.entries(response.data["quiz"]).map(([key, value]) => {
          return {
            id: key,
            ...value,
          };
        })
      );
    } catch (error) {
      console.error("Error making quiz request:", error.message);
    }
  }

  const handleQuizSubmit = () => {
    setIsQuizSubmitted(true);
    // Additional feedback logic could go here (e.g., checking correctness)
  };

  const handleAnswerChange = (questionIndex, selectedOption) => {
    if (!Object.keys(answers).includes(questionIndex.toString())) {
        setAnswers({
            ...answers,
            [questionIndex]: selectedOption,
          });
    }

  };


  function getButtonColor (selectedAnswer, correctAnswer, questionIndex) {
    const isSelected = answers[questionIndex] == selectedAnswer;

    return isSelected ? (
        selectedAnswer[0][0] === correctAnswer? "green" : "red"
      ) : "gray";
    
  };


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);

      // Set the video source to the media stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
        stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      toast({
        title: "Failed to start recording",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Flex direction="column" minH="100vh" bg="background">
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
        onClick={() => (window.location.href = "/profile")}
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        width="40px"
        height="40px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        _hover={{
          bg: "gray.600", // Darker background on hover
          transform: "scale(1.1)", // Slightly larger on hover
        }}
      >
        &lt;
      </Box>
      {/* Header */}
      <Box bg="purple.400" p={9} color="white">
        <Heading
          size="2xl"
          textAlign="center"
          fontWeight="bold"
        >
          {groupName}
        </Heading>
      </Box>
      <Flex direction="column" flex="1" bg="background" p={5}>
        <Box mb={7}>
          <Box p={4} width="100%">
            <Heading size="lg" mb={4}>
              Notes
            </Heading>
            {notes.length > 0 ? (
              <Wrap spacing={"10px"} mt={4}>
                {notes.map((note, index) => (
                  <WrapItem key={index} p={3} borderRadius="md">
                    <Box
                      height="150px"
                      width="150px"
                      bg="purple.400"
                      onClick={() => handleNoteClick(note)}
                      cursor="pointer"
                      transition="all 0.3s ease-in-out"
                      boxShadow="0 4px 6px rgba(0,0,0, 0.2)"
                      borderRadius="lg"
                    >
                      <Flex direction="column" align="center" height="100%">
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
                            style={{
                              overflowWrap: "break-word",
                              width: "100%",
                            }}
                            fontSize={20}
                          >
                            {note.title}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  </WrapItem>
                ))}
              </Wrap>
            ) : (
              <Text>No notes available for this group.</Text>
            )}
          </Box>

          <Box p={4} width="50%" mx="auto" bg="#FFFFFF10" borderRadius={10}>
            <FormControl mb={4}>
              <FormLabel>Lecture Title (required)</FormLabel>
              <Input
                type="text"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                placeholder="Give your lecture a title!"
              />
            </FormControl>

            {/* Toggle Switch */}
            <FormControl mb={4}>
              <FormLabel>Mode</FormLabel>
              <Flex align="center">
                <Text mr={2}>Audio</Text>
                <Switch
                  isChecked={isVideoMode}
                  onChange={() => setIsVideoMode(!isVideoMode)}
                />
                <Text ml={2}>Video</Text>
              </Flex>
            </FormControl>

            <FormControl>
              <FormLabel>
                {isVideoMode ? "Upload video file!" : "Upload audio file!"}
              </FormLabel>
              <Flex
                direction="column"
                align="center"
                justify="center"
                p={4}
                height="325px"
                border={`2px dashed ${
                  isFileUploaded ? "teal.500" : "gray.300"
                }`}
                borderRadius="md"
                bg={isFileUploaded ? "teal.100" : "whiteAlpha.800"}
                _hover={{ borderColor: "gray.500" }}
                _focus={{ borderColor: "blue.500" }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                cursor="pointer"
                onClick={handleClick}
              >
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  display="none"
                  accept={isVideoMode ? "video/mp4, video/webm" : "audio/mp3"}
                />
                <Box as="span" fontSize="md" color="gray.600">
                  {isVideoMode
                    ? selectedVideo
                      ? selectedVideo.name
                      : "Drag & drop your video here, or click to select"
                    : selectedFile
                    ? selectedFile.name
                    : "Drag & drop your file here, or click to select"}
                </Box>
              </Flex>
            </FormControl>

            {isVideoMode && (
              <Flex direction="column" align="center" mt={4}>
                <Box width="100%" mb={4}>
                  <video
                    ref={videoRef}
                    width="100%"
                    height="auto"
                    style={{ border: "1px solid black", borderRadius: "8px" }}
                    autoPlay
                    muted
                  />
                </Box>
                {!isRecording ? (
                  <Button
                    colorScheme="teal"
                    size="lg"
                    fontSize="lg"
                    px={8}
                    py={6}
                    boxShadow="md"
                    _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                    onClick={startRecording}
                  >
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    colorScheme="red"
                    size="lg"
                    fontSize="lg"
                    px={8}
                    py={6}
                    boxShadow="md"
                    _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                    onClick={stopRecording}
                  >
                    Stop Recording
                  </Button>
                )}

                {recordedBlob && (
                  <Button
                    colorScheme="blue"
                    size="lg"
                    fontSize="lg"
                    px={8}
                    py={6}
                    boxShadow="md"
                    _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                    onClick={downloadRecording}
                    mt={4}
                  >
                    Download Recording
                  </Button>
                )}
              </Flex>
            )}

            <Flex direction="column" align="center" mt={4}>
              <Button
                colorScheme="teal"
                size="lg"
                fontSize="lg"
                px={8}
                py={6}
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                onClick={isVideoMode ? onVideoUpload : onFileUpload}
                mb={4}
                isDisabled={isUploading} // Disable button while uploading
              >
                {isUploading ? (
                  <Spinner size="md" />
                ) : isVideoMode ? (
                  "Upload Video"
                ) : (
                  "Upload Audio"
                )}{" "}
                {/* Show spinner when uploading */}
              </Button>
            </Flex>
          </Box>
        </Box>
      </Flex>
      {/* Footer */}
      <Box bg="gray.800" p={4} color="white" textAlign="center" height="70px">
        Footer
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent maxWidth="80vw" width="80vw">
          <ModalHeader>Note Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {quizQuestions.length > 0 ? (
              // Display quiz questions if they have clicked "Quiz Me"
              quizQuestions.map((q, index) => (
                <Box key={index} mb={6}>
                  <Text fontWeight="bold">{q.question}</Text>
                  <Flex direction="column">
                    {q.options.map((option, optionIndex) => {

                      return (
                        <Button
                          key={optionIndex}
                          bg={getButtonColor(option, q.answer, index)}
                          onClick={() => handleAnswerChange(index, option)}
                          mt={2}
                          isDisabled={isQuizSubmitted} // Disable buttons after submitting
                        >
                          {option}
                        </Button>
                      );
                    })}
                  </Flex>
                </Box>
              ))
            ) : (

              // Display note details when the modal is first opened
              <Box>
                <details>
                    <summary>Full transcript</summary>
                    <Text>{selectedNote?.notes}</Text> 
                </details>
                <br/>
                <Text style={{ whiteSpace: 'pre-line' }}> {selectedNote?.bullets}</Text>
              
              </Box>

            )}
          </ModalBody>
          <ModalFooter>
            {quizQuestions.length > 0 ? (
              // Show Submit button if quiz is displayed
              <>
                {!isQuizSubmitted ? (
                  <Button colorScheme="teal" onClick={handleQuizSubmit}>
                    Submit Quiz
                  </Button>
                ) : (
                  <Text fontWeight="bold" color="green.500">
                    Quiz Submitted!
                  </Text>
                )}
              </>
            ) : (
              // "Quiz Me" button before the quiz starts
              <Button colorScheme="blue" onClick={handleQuizMeClick}>
                Quiz Me
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Group;
