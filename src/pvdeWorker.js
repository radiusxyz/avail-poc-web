// src/pvdeWorker.js

import {
  fetchTimeLockPuzzleZkpParam,
  fetchTimeLockPuzzleProvingKey,
  generateTimeLockPuzzleParam,
  generateTimeLockPuzzle,
  generateTimeLockPuzzleProof,
  fetchEncryptionZkpParam,
  fetchEncryptionProvingKey,
  generateSymmetricKey,
  encryptMessage,
  generateEncryptionProof,
} from "pvde";

self.onmessage = async (event) => {
  const { task, type, data } = event.data;

  if (task === "TIMELOCKPUZZLE") {
    const tlpParam = await generateTimeLockPuzzleParam();
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

    self.postMessage({
      timeLockPuzzle: tlp,
      timeLockPuzzleProof: tlpProof,
      encryptionKey: encKey,
    });
  }

  if (task === "ENCRYPTION") {
    // console.log("event.data received in Worker:", event.data);

    const { message, encKey, timeLockPuzzlePublicInput, timeLockPuzzleSecretInput } = data;

    const encZkpParam = await fetchEncryptionZkpParam();
    const encProvingKey = await fetchEncryptionProvingKey();
    const cipher = await encryptMessage(message, encKey);

    const encryptionPublicInput = { encryptedData: cipher, kHashValue: timeLockPuzzlePublicInput.kHashValue };
    const encryptionSecretInput = { data: message, k: timeLockPuzzleSecretInput.k };
    const encProof = await generateEncryptionProof(
      encZkpParam,
      encProvingKey,
      encryptionPublicInput,
      encryptionSecretInput
    );

    // Identify the type of encryption (FROM or TO) and send appropriate message
    if (type === "FROM_ENCRYPTION") {
      self.postMessage({
        type: "FROM_ENCRYPTION",
        cipher,
        encryptionProof: encProof,
      });
    } else if (type === "TO_ENCRYPTION") {
      self.postMessage({
        type: "TO_ENCRYPTION",
        cipher,
        encryptionProof: encProof,
      });
    }
  }
};
