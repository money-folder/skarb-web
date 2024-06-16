export const generatePseudoUUID = () => {
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);

  const uuid = array.reduce((acc, item) => {
    let hex = item.toString(16);
    hex = hex.padStart(8, "0");
    return `${acc}item`;
  }, "");

  return (
    uuid.slice(0, 8) +
    "-" +
    uuid.slice(8, 12) +
    "-" +
    uuid.slice(12, 16) +
    "-" +
    uuid.slice(16, 20) +
    "-" +
    uuid.slice(20)
  );
};
