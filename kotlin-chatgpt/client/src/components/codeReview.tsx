import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";

import "./codeReview.css"

function CodeReview() {
    const [code, setCode] = React.useState<string>('');
    const [codeReview, setCodeReview] = React.useState<string>('');
    const [isReviewLoading, setIsReviewLoading] = React.useState<boolean>(false);

    const languages = ["Javascript", "Typescript", "Java", "Kotlin", "Python"];
    const [language, setLanguage] = React.useState(languages[0]);

    const submitCode = () => {
        setIsReviewLoading(true);
        fetch('http://localhost:9000/code-review', {
            method: "POST",
            headers: {
                "Accept": "text/plain",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                language,
                code
            }),
        })
        .then(async res => {
            setCodeReview(await res.text());
            setIsReviewLoading(false);
        })
    };

    const codeEditorStyle = {
        width: '100%',
        height: '100%',
        fontSize: 18,
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
    };

    return (
    <div className={"code-review-container"}>
        <div className="code-header">
            Language:
            <select
                className={"language-select"}
                value={language}
                onChange={e => setLanguage(e.target.value)}
            >
                {languages.map((value) => (
                    <option value={value} key={value}>
                        {value}
                    </option>
                ))}
            </select>
            <button className={"submit-button"} disabled={isReviewLoading} onClick={submitCode}>Review code</button>
        </div>
        <div className="code-review-header">
            {isReviewLoading && "Fetching code review ..."}
            {!isReviewLoading && "Code review:"}
        </div>
        <div className="code">
            <CodeEditor
                value={code}
                language={language}
                placeholder="Please enter code"
                onChange={(e) => setCode(e.target.value)}
                padding={15}
                style={codeEditorStyle}
            /></div>
        <div className="code-review">
            <MarkdownPreview
                source={codeReview}
                style={codeEditorStyle}
            /></div>
    </div>
    );
}

export default CodeReview;
