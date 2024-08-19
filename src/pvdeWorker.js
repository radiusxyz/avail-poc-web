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
} from "pvde";

self.onmessage = async (event) => {
  const { task } = event.data;
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
    const { message, encKey, encryptionPublicInput, encryptionSecretInput } = event.data;
    const encZkpParam = await fetchEncryptionZkpParam();
    const encProvingKey = await fetchEncryptionProvingKey();
    const cipher = await encryptMessage(message, encKey);
    const encProof = await generateEncryptionProof(
      encZkpParam,
      encProvingKey,
      encryptionPublicInput,
      encryptionSecretInput
    );

    self.postMessage({
      cipher,
      encryptionProof: encProof,
    });
  }
};
