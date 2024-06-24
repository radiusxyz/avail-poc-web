import React, { useState } from "react";
import CreateEditFeedback from "../pfa/screens/CreateEditFeedback";
import { suggestionList } from "../pfa/model";

const TotalTxs = () => {
  const [suggestions, setSuggestions] = useState(suggestionList);

  const handleSetSuggestions = (handler) => setSuggestions(handler);

  return <CreateEditFeedback suggestions={suggestions} handler={handleSetSuggestions} />;
};

export default TotalTxs;
