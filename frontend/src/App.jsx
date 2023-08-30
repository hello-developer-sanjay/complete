import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar, Header, Home, Blogs, Footer } from "./components";
import SectionWrapper from "./hoc/SectionWrapper";

const HomeWithSectionWrapper = SectionWrapper(Home, "home");

const App = () => {
  const [activeButton, setActiveButton] = useState("ageofai");
  const [selectedDocument, setSelectedDocument] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const collection = urlParams.get("collection");
    const title = urlParams.get("title");

    if (collection && title) {
      fetchDocumentData(collection, title);
    }
  }, [location.search]);

  const fetchDocumentData = (collection, title) => {
    axios
      .get(`https://hello-back-0iam.onrender.com/api/${collection}?title=${encodeURIComponent(title)}`)
      .then((response) => {
        setSelectedDocument(response.data.find((item) => item.title === title));
        setActiveButton(collection);

        // Update the URL
        navigate(`/home?collection=${collection}&title=${encodeURIComponent(title)}`, {
          replace: true, // Replace the current URL
        });
      })
      .catch((error) => {
        console.error("Error fetching document data.", error);
      });
  };

  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />

          <Routes>
            <Route
              path="/"
              element={(
                <>
                  <Header
                    activeButton={activeButton}
                    setSelectedDocument={setSelectedDocument}
                  />
                  <HomeWithSectionWrapper selectedDocument={selectedDocument} />
                </>
              )}
            />
            <Route path="/home/:selectedField" element={<Home />} />
            <Route path="/blogs/*" element={<Blogs />} />
          </Routes>
        </div>

        <div className="relative z-0">
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
