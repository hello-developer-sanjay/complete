import React, { useState, useEffect, useRef } from "react";
import { Box, Input, VStack, Text, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, CloseButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import Welcome from "./Welcome";
import CompilerOverlay from "./CompilerOverlay";
import { useNavigate, useLocation } from "react-router-dom";
import "./Home.css";

// eslint-disable-next-line react/prop-types
const Home = ({ selectedDocument }) => {
  const [allFields, setAllFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [playingVideoUrl, setPlayingVideoUrl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [compilerVisible, setCompilerVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [zoomedImage, setZoomedImage] = useState(null);

  const observer = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setAllFields(
      selectedDocument
        ? Object.entries(selectedDocument).filter(([field]) => field !== "_id")
        : []
    );

    if (selectedDocument) {
      setShowWelcome(false);
    }
  }, [selectedDocument]);

useEffect(() => {
  const urlParams = new URLSearchParams(location.search);
  const collection = urlParams.get("collection");
  const title = urlParams.get("title");
  if (collection && title) {
    axios
      .get(`https://hello-back-0iam.onrender.com/api/${collection}?title=${encodeURIComponent(title)}`)
      .then((response) => {
        setSelectedDocument(response.data.find((item) => item.title === title));
      })
      .catch((error) => {
        console.error("Error fetching document data.", error);
      });
  }
}, [location.search]);



  const observeLastField = (node) => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Load more fields if needed
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  };

  const handleScroll = () => {
    const container = document.getElementById("home-section");
    if (container) {
      const scrollPosition = container.scrollTop;
      const containerHeight = container.scrollHeight - container.clientHeight;
      const progress = (scrollPosition / containerHeight) * 100;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    const container = document.getElementById("home-section");
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handleTitleClick = (videoUrl) => {
    setPlayingVideoUrl(videoUrl);
  };

 const handleFieldClick = (fieldIndex) => {
  const fieldElement = document.getElementById(`field-${fieldIndex}`);
  if (fieldElement) {
    const container = document.getElementById("home-section");
    const containerRect = container.getBoundingClientRect();
    const fieldRect = fieldElement.getBoundingClientRect();

    const offsetY = fieldRect.top - containerRect.top;
    container.scrollBy({ top: offsetY, behavior: "smooth" });
  }
  setSelectedField(fieldIndex);
  setSidebarOpen(false);

  // Now, let's set the selectedDocument to the data of the selected field.
  if (fieldIndex >= 0 && fieldIndex < allFields.length) {
    const selectedFieldData = allFields[fieldIndex][1];
    setSelectedDocument(selectedFieldData);
  }

  navigate(`/home?selectedField=${fieldIndex}`);
};

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filteredFields = () => {
    const filtered = allFields.filter(([field, value]) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered;
  };

  const toggleCompiler = () => {
    setCompilerVisible(!compilerVisible);
  };

  const openImageZoom = (imageUrl) => {
    setZoomedImage(imageUrl);
  };

  const closeImageZoom = () => {
    setZoomedImage(null);
  };

  const renderTextWithAsterisksAndTildes = (text) => {
    const asteriskRegex = /\*(.*?)\*/g;
    const tildeRegex = /~(.*?)~/g;
    let lastIndex = 0;
    const elements = [];

    let match;
    while ((match = asteriskRegex.exec(text)) || (match = tildeRegex.exec(text))) {
      if (match.index !== lastIndex) {
        elements.push(<span key={lastIndex}>{text.substring(lastIndex, match.index)}</span>);
      }

      elements.push(
        <span key={match.index} className={match[0].startsWith("*") ? "asterisk-text" : "tilde-text"}>
          {match[1]}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      elements.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
    }

    return elements;
  };

  const renderNestedData = (data) => {
    return (
      <VStack align="start" spacing={1} pl={4}>
        {Object.entries(data).map(([nestedField, nestedValue], nestedIndex) => (
          <Box key={nestedIndex} w="100%">
            <Text fontWeight="bold">{nestedField}:</Text>
            {typeof nestedValue === "string" && nestedValue.startsWith("http") ? (
              nestedValue.match(/\.(jpeg|jpg|gif|png)$/) ? (
                <Image src={nestedValue} alt="Image" className="data-image" onClick={() => openImageZoom(nestedValue)} />
              ) : nestedValue.match(/\.(mp4|webm|mkv)$/) ? (
                <Box position="relative" paddingTop="56.25%">
                  <ReactPlayer
                    url={nestedValue}
                    controls
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />
                </Box>
              ) : (
                <Text>{renderTextWithAsterisksAndTildes(nestedValue)}</Text>
              )
            ) : Array.isArray(nestedValue) ? (
              renderNestedArray(nestedValue)
            ) : typeof nestedValue === "object" ? (
              renderNestedData(nestedValue)
            ) : (
              <Text>{renderTextWithAsterisksAndTildes(nestedValue)}</Text>
            )}
          </Box>
        ))}
      </VStack>
    );
  };

  const renderNestedArray = (array) => {
    return (
      <VStack align="start" spacing={1} pl={4}>
        {array.map((item, idx) => (
          <Box key={idx} w="100%">
            {typeof item === "string" && item.startsWith("http") ? (
              item.match(/\.(jpeg|jpg|gif|png)$/) ? (
                <Image src={item} alt={`Image ${idx}`} className="data-image" onClick={() => openImageZoom(item)} />
              ) : item.match(/\.(mp4|webm|mkv)$/) ? (
                <Box position="relative" paddingTop="56.25%">
                  <ReactPlayer
                    url={item}
                    controls
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />
                </Box>
              ) : (
                <Text>{renderTextWithAsterisksAndTildes(item)}</Text>
              )
            ) : Array.isArray(item) ? (
              renderNestedArray(item)
            ) : typeof item === "object" ? (
              renderNestedData(item)
            ) : (
              <Text>{renderTextWithAsterisksAndTildes(item)}</Text>
            )}
          </Box>
        ))}
      </VStack>
    );
  };

  return (
    <Box
      w="full"
      minH="100vh"
      mx="auto"
      d="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="flex-start"
      id="home-section"
      overflowY="scroll"
      maxHeight="calc(100vh - 100px)"
      height="auto"
      overflowX="hidden"
      border="1px solid #ccc"
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
    >
      {showWelcome && <Welcome hideWelcome={!showWelcome} />}
      {!showWelcome && (
        <Box
          className={`sticky top-0 z-10 p-4 ${
            sidebarOpen ? "show-sidebar" : ""
          }`}
          boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
          borderbottom="none"
          bg="white"
        >
          <Input
            type="text"
            placeholder="Search for fields"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            w="full"
            p={2}
            borderWidth="1px"
            rounded="md"
            bg="gray.100"
          />
          <VStack mt={2} spacing={2} align="stretch">
            <Box w={`${scrollProgress}%`} h="4px" bg="green" rounded="sm" />
          </VStack>
          <Button
            className="sidebar-toggle"
            onClick={handleSidebarToggle}
          >
            ExpandVue
          </Button>
          <Button
            onClick={toggleCompiler}
            variant="link"
            className="compiler-button"
          >
            Compiler
          </Button>
          {compilerVisible && <CompilerOverlay onClose={toggleCompiler} />}
          <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <Text className="section-heading">Data Dive Point</Text>
            {allFields.map(([field], index) => (
              <div
                key={index}
                className={`sidebar-field ${
                  selectedField === field ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedField(field);
                  handleFieldClick(index);
                }}
              >
                {field === "title" ? "" : field} {/* Exclude "title" */}
              </div>
            ))}
            <Button
              className="close-sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              FoldSecurely
            </Button>
          </div>
        </Box>
      )}
      <Box
        maxW="7xl"
        mx="auto"
        p={4}
        mt={8}
        style={{ marginTop: "48px" }}
      >
        {filteredFields().map(([field, value], index) => (
          <motion.div
            key={index}
            id={`field-${index}`}
            ref={
              index === filteredFields().length - 1
                ? (node) => observeLastField(node)
                : null
            }
          >
            <Box w="100%">
              <Text
                onClick={() => {
                  setSelectedField(field);
                  handleFieldClick(index);
                }}
                cursor="pointer"
                color={selectedField === field ? "blue" : "red "}
                fontWeight="bold"
                fontSize="lg"
              >
                {field === "title" ? "" : field}
              </Text>
              {Array.isArray(value) ? (
                renderNestedArray(value)
              ) : typeof value === "object" ? (
                renderNestedData(value)
              ) : (
                <Text>
                  {typeof value === 'string' ? renderTextWithAsterisksAndTildes(value) : value}
                </Text>
              )}
            </Box>
          </motion.div>
        ))}
      </Box>
      <Modal isOpen={!!zoomedImage} onClose={closeImageZoom} size="full">
      <ModalOverlay />
      <ModalContent>
       
        <ModalBody>
          <Image src={zoomedImage} alt="Zoomed" maxH="80vh" mx="auto" />
        </ModalBody>
        <ModalFooter className="modal-footer">
          <Button
            onClick={closeImageZoom}
            className="zoomed-image-button" // Add the class here
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </Box>
  );
};

export default Home;
