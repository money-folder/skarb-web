export const downloadFile = (filename: string, b64: string) => {
  const url = `data:file;base64,${b64}`;
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
