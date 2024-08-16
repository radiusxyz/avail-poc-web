import React, { createContext, useEffect, useState } from "react";
import {
  fetchTimeLockPuzzleZkpParam,
  fetchTimeLockPuzzleProvingKey,
  generateTimeLockPuzzleParam,
  generateTimeLockPuzzle,
  generateTimeLockPuzzleProof,
  fetchEncryptionZkpParam,
  fetchEncryptionProvingKey,
  generateSymmetricKey,
} from "pvde";

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
    const paramFetcher = async () => {
      const tlpParam = await generateTimeLockPuzzleParam(2048);
      const tlp = await generateTimeLockPuzzle(tlpParam);
      const [tlpSecretInput, tlpPublicInput] = tlp;
      const tlpZkpParam = await fetchTimeLockPuzzleZkpParam();
      const tlpProvingKey = await fetchTimeLockPuzzleProvingKey();
      const tlpProof = await generateTimeLockPuzzleProof(
        tlpZkpParam,
        tlpProvingKey,
        tlpPublicInput,
        tlpSecretInput,
        tlpParam
      );
      const encKey = await generateSymmetricKey(tlpSecretInput.k);
      const encZkpParam = await fetchEncryptionZkpParam();
      const encProvingKey = await fetchEncryptionProvingKey();

      setTimeLockPuzzleParam(tlpParam);
      setTimeLockPuzzle(tlp);
      setTimeLockPuzzleZkpParam(tlpZkpParam);
      setTimeLockPuzzleProvingKey(tlpProvingKey);
      setTimeLockPuzzleProof(tlpProof);

      setEncryptionKey(encKey);
      setEncryptionZkpParam(encZkpParam);
      setEncryptionProvingKey(encProvingKey);
    };

    paramFetcher();
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
