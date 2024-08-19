import React, { createContext, useEffect, useState } from "react";

export const PvdeContext = createContext({
  timeLockPuzzle: "",
  timeLockPuzzleProof: "",
  encryptionKey: "",
});

export const PvdeProvider = ({ children }) => {
  const [timeLockPuzzle, setTimeLockPuzzle] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("");
  const [timeLockPuzzleProof, setTimeLockPuzzleProof] = useState("");

  useEffect(() => {
    const worker = new Worker(new URL("../pvdeWorker.js", import.meta.url), {
      type: "module",
    });

    worker.onmessage = (event) => {
      const { timeLockPuzzle, timeLockPuzzleProof, encryptionKey } = event.data;

      setTimeLockPuzzle(timeLockPuzzle);
      setTimeLockPuzzleProof(timeLockPuzzleProof);

      setEncryptionKey(encryptionKey);
    };

    worker.postMessage({ task: "TIMELOCKPUZZLE" });

    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <PvdeContext.Provider
      value={{
        timeLockPuzzle,
        timeLockPuzzleProof,
        encryptionKey,
      }}
    >
      {children}
    </PvdeContext.Provider>
  );
};
