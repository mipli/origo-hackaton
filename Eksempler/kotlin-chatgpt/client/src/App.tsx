import React from 'react';

import SimpleChat from "./components/simpleChat";
import CodeReview from "./components/codeReview";

import './App.css';

enum Page {
    SIMPLE_CHAT,
    CODE_REVIEW
}

function App() {
    const [currentPage, setCurrentPage] = React.useState<Page>(Page.SIMPLE_CHAT);

    const goToCodeReview = () => {
        setCurrentPage(Page.CODE_REVIEW)
    };

    const goToSimpleChat = () => {
        setCurrentPage(Page.SIMPLE_CHAT)
    };

    return (
    <>
      <div className="header">
          <button className={"header-button"} onClick={goToSimpleChat}>Simple Chat</button>
          <button className={"header-button"} onClick={goToCodeReview}>Code Review</button>
      </div>
      {currentPage === Page.CODE_REVIEW && <CodeReview></CodeReview> }
      {currentPage === Page.SIMPLE_CHAT && <SimpleChat></SimpleChat> }
    </>
    );
}

export default App;
