import React, { useState } from "react";
import Table from "../components/Table";
import { useTxs } from "../contexts/TxsContext";
import CreateEditFeedback from "../pfa/screens/CreateEditFeedback";
import { suggestionList } from "../pfa/model";

const TotalTxs = () => {
  const { txs } = useTxs();
  const [suggestions, setSuggestions] = useState(suggestionList);

  const handleSetSuggestions = (handler) => setSuggestions(handler);
  const headers = ["role", "block", "timestamp", "submission status", "reward", "leader", "violation"];

  console.log(txs);

  const entries = txs.map(({ role, block }) => {
    return {
      role,
      block: block.height,
      timestamp: block.timestamp,
      "submission status": block.status,
      reward: block.reward,
      violation: block.violation,
      leader: block.leader,
    };
  });

  return <CreateEditFeedback suggestions={suggestions} handler={handleSetSuggestions} />;
};

export default TotalTxs;
