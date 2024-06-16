import { createContext, useState } from "react";
import run from "./clone";

export const Content = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([
    {
      text: "Hi, I am ChatGPT, a state-of-the-art language model developed by OpenAI. I'm designed to understand and generate human-like text based on the input I receive. You can ask me questions, have conversations, seek information, or even request assistance with various tasks. Just let me know how I can help you!",
      isBot: true,
    },
  ]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const onSent = async () => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);

    const text = input;
    setInput("");
    setPrevPrompts((prev) => [
      ...prev,
      { text, isBot: false },
    ]);

    const response = await run(text);
    let responseArray = response.split("**");
    let newResponse = "";

    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += `<b>${responseArray[i]}</b>`;
      }
    }

    let newResponse2 = newResponse.split("*").join("</br>");
    setPrevPrompts((prev) => [
      ...prev,
      { text: newResponse2, isBot: true },
    ]);

    setResultData(newResponse2);
    setLoading(false);
  };

  const newChat = () => {
    setInput("");
    setPrevPrompts([
      {
        text: "Hi, I am ChatGPT, a state-of-the-art language model developed by OpenAI. I'm designed to understand and generate human-like text based on the input I receive. You can ask me questions, have conversations, seek information, or even request assistance with various tasks. Just let me know how I can help you!",
        isBot: true,
      },
    ]);
    setShowResult(false);
    setLoading(false);
    setResultData("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Content.Provider value={contextValue}>
      {props.children}
    </Content.Provider>
  );
};

export default ContextProvider;
