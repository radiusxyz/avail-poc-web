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
  if (event.data === "start") {
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
    const encZkpParam = await fetchEncryptionZkpParam();
    const encProvingKey = await fetchEncryptionProvingKey();

    self.postMessage({
      timeLockPuzzleParam: tlpParam,
      timeLockPuzzle: tlp,
      timeLockPuzzleZkpParam: tlpZkpParam,
      timeLockPuzzleProvingKey: tlpProvingKey,
      timeLockPuzzleProof: tlpProof,
      encryptionKey: encKey,
      encryptionZkpParam: encZkpParam,
      encryptionProvingKey: encProvingKey,
    });
  }
};
