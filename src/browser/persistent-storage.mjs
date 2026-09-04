export async function requestPersistentStorage(storageManager = globalThis.navigator?.storage) {
  if (!storageManager?.persist) return { supported: false, persisted: false };
  const alreadyPersisted = await storageManager.persisted?.();
  if (alreadyPersisted) return { supported: true, persisted: true };
  return { supported: true, persisted: await storageManager.persist() };
}
