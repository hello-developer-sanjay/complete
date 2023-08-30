import React, { useState, useEffect } from "react";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import axios from "axios";
import { chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionButton = chakra(motion.button);

const Header = ({ activeButton, onSetActiveButton, setSelectedDocument, setSelectedCollectionAndTitle }) => {
  const [documentTitles, setDocumentTitles] = useState({
    ageofai: [],
    webdev: [],
    devtools: [],
    road: [],
  });

  useEffect(() => {
    fetchData("ageofai");
    fetchData("webdev");
    fetchData("devtools");
    fetchData("road");
  }, []);

   const fetchData = (collection) => {
    axios
      .get(`https://hello-back-0iam.onrender.com/api/${collection}`)
      .then((response) => {
        console.log(`Response data for ${collection} collection:`, response.data);
  
        if (Array.isArray(response.data)) {
          setDocumentTitles((prevTitles) => ({
            ...prevTitles,
            [collection]: response.data.map((item) => item.title),
          }));
        } else {
          console.error(`Invalid response data structure for ${collection} collection.`);
        }
      })
      .catch((error) => {
        console.error(`Error fetching data from ${collection} collection.`, error);
      });
  };

const fetchDocumentData = (title) => {
  const collection = activeButton; // Get the collection from activeButton
  axios
    .get(`https://hello-back-0iam.onrender.com/api/${collection}?title=${encodeURIComponent(title)}`)
    .then((response) => {
      setSelectedDocument(response.data.find((item) => item.title === title));
      setSelectedCollectionAndTitle({ collection, title });
      onSetActiveButton(collection);

      window.history.pushState(
        null,
        null,
        `/home?title=${encodeURIComponent(title)}`
      );
    })
    .catch((error) => {
      console.error("Error fetching document data.", error);
    });
};


  const MoreDropdownMenu = React.forwardRef(({ collection, titles }, ref) => (
  <Menu ref={ref}>
    {titles.map((title) => (
      <Menu.Item key={title}>
        <MotionButton
          whileTap={{ scale: 0.9 }}
          whileHover={{ y: -5, boxShadow: "0 0 10px #5F46E5", borderColor: "#5F46E5" }}
          onClick={() => fetchDocumentData(title)} // Updated to only pass title
          variant="primary"
        >
          {title}
        </MotionButton>
      </Menu.Item>
    ))}
  </Menu>
));


  const DropdownMenu = React.forwardRef(({ collection }, ref) => {
    const [showMore, setShowMore] = useState(false);
    const titles = documentTitles[collection];
  
    useEffect(() => {
      setShowMore(titles.length > 10);
    }, [titles]);
  
    return (
      <Menu ref={ref}>
        {titles.slice(0, showMore ? 10 : titles.length).map((title) => (
          <Menu.Item key={title}>
            <MotionButton
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -5, boxShadow: "0 0 10px #5F46E5", borderColor: "#5F46E5" }}
              onClick={() => fetchDocumentData(collection, title)}
              variant="primary"
            >
              {title.replace(/~/g, "")} {/* Replace all ~ characters */}
            </MotionButton>
          </Menu.Item>
        ))}
        {showMore && (
          <Menu.Item key="more">
            <Menu.SubMenu
              title={
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ cursor: "pointer" }}
                >
                  More...
                </motion.div>
              }
              popupOffset={[0, -10]}
              onTitleClick={() => setShowMore(!showMore)}
            >
            <MoreDropdownMenu collection={collection} titles={titles.slice(10)} />

            </Menu.SubMenu>
          </Menu.Item>
        )}
      </Menu>
    );
  });
  



  return (
    <header className="bg-gray-800 text-white p-4  mt-20 sticky top-0" style={{ zIndex: "999" }}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div>
          {/* Dev Tools Dropdown */}
          <Dropdown
  overlay={<DropdownMenu collection="devtools" />}
  trigger={["hover"]}
  placement="bottomLeft"
  onOpenChange={(open) => onSetActiveButton(open ? "devtools" : null)}
  menu
>

            <MotionButton
              whileTap={{ scale: 0.9 }}
              style={buttonStyle}
              variant="primary"
            >
              Dev Tools <DownOutlined />
            </MotionButton>
          </Dropdown>

          {/* Web Development Dropdown */}
          <Dropdown
  overlay={<DropdownMenu collection="webdev" />}
  trigger={["hover"]}
  placement="bottomLeft"
  onOpenChange={(open) => onSetActiveButton(open ? "webdev" : null)}
  menu
>

            <MotionButton
              whileTap={{ scale: 0.9 }}
              style={buttonStyle}
              variant="primary"
            >
              Web Development <DownOutlined />
            </MotionButton>
          </Dropdown>

          {/* The Age of AI Dropdown */}
          <Dropdown
  overlay={<DropdownMenu collection="ageofai" />}
  trigger={["hover"]}
  placement="bottomLeft"
  onOpenChange={(open) => onSetActiveButton(open ? "ageofai" : null)}
  menu
>

            <MotionButton
              whileTap={{ scale: 0.9 }}
              style={buttonStyle}
              variant="primary"
            >
              The Age of AI <DownOutlined />
            </MotionButton>
          </Dropdown>

          {/* Guided Roadmap Dropdown */}
          <Dropdown
  overlay={<DropdownMenu collection="road" />}
  trigger={["hover"]}
  placement="bottomLeft"
  onOpenChange={(open) => onSetActiveButton(open ? "road" : null)}
  menu
>

            <MotionButton
              whileTap={{ scale: 0.9 }}
              style={buttonStyle}
              variant="primary"
            >
              Guided Roadmap <DownOutlined />
            </MotionButton>
          </Dropdown>
        </div>
      </nav>
    </header>
  );
};

const buttonStyle = {
  position: "relative",
  margin: "0.3rem",
  padding: "0.5rem 1.2rem",
  cursor: "pointer",
  color: "#FFFFFF",
  border: "none",
  background: "#2c3e50", // Dark background color
  borderRadius: "20px",
  fontSize: "0.9rem",
  fontFamily: "Inter, sans-serif",
  outline: "none",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
  letterSpacing: "0.5px",
  
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "2px solid transparent",
    borderImage: "linear-gradient(45deg, rgba(255, 255, 255, 0.8), transparent)",
    borderImageSlice: 1,
    animation: "$shine 3s linear infinite",
    transformOrigin: "center",
    pointerEvents: "none",
  },

  "@keyframes shine": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },

  "&:hover": {
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)", // Increased shadow on hover
    background: "#34495e", // Darken background color on hover
  },

  "&:active": {
    transform: "translateY(1px)",
    boxShadow: "none",
  },

  "&:focus": {
    boxShadow: "0 0 0 3px rgba(255, 211, 42, 0.6)",
  },
};





export default Header;
