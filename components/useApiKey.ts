import React from "react";

export const useApiKey = () => {
  let storedApiKey;
  if (typeof window !== "undefined") {
    storedApiKey = window.localStorage.getItem("devToApiKey");
  }
  const [apiKey, _setApiKey] = React.useState(storedApiKey);
  function setApiKey(newKey) {
    _setApiKey(newKey);
    window.localStorage.setItem("devToApiKey", newKey);
  }
  return [apiKey, setApiKey];
};
