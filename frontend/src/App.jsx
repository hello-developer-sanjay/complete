import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar, Header, Home, Blogs, Footer } from "./components";
import SectionWrapper from "./hoc/SectionWrapper";
import axios from "axios"; // Don't forget to import axios

const HomeWithSectionWrapper = SectionWrapper(Home, "home");

const App = () => {
  const [activeButton, setActiveButton] = useState("ageofai");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedCollectionAndTitle, setSelectedCollectionAndTitle] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const collection = urlParams.get("collection");
    const title = urlParams.get("title");

    if (collection && title) {
      fetchDocumentData(collection, title);
    }
  }, []);

const fetchDocumentData = (title) => {
  axios
    .get(`https://hello-back-0iam.onrender.com/api/${activeButton}?title=${encodeURIComponent(title)}`)
    .then((response) => {
      setSelectedDocument(response.data.find((item) => item.title === title));
      setSelectedCollectionAndTitle({ collection: activeButton, title });
      onSetActiveButton(activeButton);

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
                    onSetActiveButton={setActiveButton}
                    setSelectedDocument={setSelectedDocument}
                    setSelectedCollectionAndTitle={setSelectedCollectionAndTitle}
                  />
                  <HomeWithSectionWrapper
                    selectedDocument={selectedDocument}
                    selectedCollectionAndTitle={selectedCollectionAndTitle}
                  />
                </>
              )}
            />
            <Route
              path="/home/:selectedField"
              element={<Home selectedDocument={selectedDocument} />}
            />
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
