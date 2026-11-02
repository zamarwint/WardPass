import { argon2id } from "@noble/hashes/argon2.js";

type DeriveMessage = {
  passwordBytes: Uint8Array;
  salt: Uint8Array;
  params: { MEM: number; TIME: number; PARALLELISM: number; KEY_LEN: number };
};

type WorkerScope = {
  onmessage: ((event: MessageEvent<DeriveMessage>) => void) | null;
  postMessage(message: unknown, transfer?: Transferable[]): void;
};

const workerScope = self as unknown as WorkerScope;

workerScope.onmessage = ({ data }) => {
  try {
    const key = argon2id(data.passwordBytes, data.salt, {
      t: data.params.TIME,
      m: data.params.MEM,
      p: data.params.PARALLELISM,
      dkLen: data.params.KEY_LEN,
    });
    workerScope.postMessage({ key }, [key.buffer]);
  } catch {
    workerScope.postMessage({ error: "Key derivation failed." });
  }
};
