export function createProgress(manifest) {
  const totalBytes = manifest.files.reduce((sum, file) => sum + file.bytes, 0);
  let completedBytes = 0;
  let completedFiles = 0;
  return {
    totalBytes,
    totalFiles: manifest.files.length,
    complete(file) {
      completedBytes += file.bytes;
      completedFiles += 1;
      return {
        id: manifest.id,
        version: manifest.version,
        file: file.path,
        completedBytes,
        totalBytes,
        completedFiles,
        totalFiles: manifest.files.length,
        percent: totalBytes === 0 ? 100 : Math.round((completedBytes / totalBytes) * 10000) / 100,
      };
    },
  };
}
