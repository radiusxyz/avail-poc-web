import React, { createContext, useEffect, useState } from "react";

export const PvdeContext = createContext({
  timeLockPuzzle: "",
  timeLockPuzzleParam: "",
  timeLockPuzzleZkpParam: "",
  timeLockPuzzleProvingKey: "",
  timeLockPuzzleProof: "",

  encryptionZkpParam: "",
  encryptionProvingKey: "",
  encryptionKey: "",
});

export const PvdeProvider = ({ children }) => {
  const [timeLockPuzzle, setTimeLockPuzzle] = useState("");
  const [timeLockPuzzleParam, setTimeLockPuzzleParam] = useState("");
  const [timeLockPuzzleZkpParam, setTimeLockPuzzleZkpParam] = useState("");
  const [timeLockPuzzleProvingKey, setTimeLockPuzzleProvingKey] = useState("");
  const [timeLockPuzzleProof, setTimeLockPuzzleProof] = useState("");

  const [encryptionZkpParam, setEncryptionZkpParam] = useState("");
  const [encryptionProvingKey, setEncryptionProvingKey] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("");

  useEffect(() => {
    // Specify the worker type as "module"
    const worker = new Worker(new URL("../pvdeWorker.js", import.meta.url), {
      type: "module",
    });

    worker.onmessage = (event) => {
      const {
        timeLockPuzzleParam,
        timeLockPuzzle,
        timeLockPuzzleZkpParam,
        timeLockPuzzleProvingKey,
        timeLockPuzzleProof,
        encryptionKey,
        encryptionZkpParam,
        encryptionProvingKey,
      } = event.data;

      setTimeLockPuzzleParam(timeLockPuzzleParam);
      setTimeLockPuzzle(timeLockPuzzle);
      setTimeLockPuzzleZkpParam(timeLockPuzzleZkpParam);
      setTimeLockPuzzleProvingKey(timeLockPuzzleProvingKey);
      setTimeLockPuzzleProof(timeLockPuzzleProof);

      setEncryptionKey(encryptionKey);
      setEncryptionZkpParam(encryptionZkpParam);
      setEncryptionProvingKey(encryptionProvingKey);
    };

    worker.postMessage("start");

    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <PvdeContext.Provider
      value={{
        timeLockPuzzle,
        timeLockPuzzleParam,
        timeLockPuzzleZkpParam,
        timeLockPuzzleProvingKey,
        timeLockPuzzleProof,
        encryptionZkpParam,
        encryptionProvingKey,
        encryptionKey,
      }}
    >
      {children}
    </PvdeContext.Provider>
  );
};
