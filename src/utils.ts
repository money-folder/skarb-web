export const generatePseudoUUID = () => {
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);

  const uuid = array.reduce((acc, item) => {
    let hex = item.toString(16);
    hex = hex.padStart(8, '0');
    return acc + hex;
  }, '');

  return (
    uuid.slice(0, 8) +
    '-' +
    uuid.slice(8, 12) +
    '-' +
    uuid.slice(12, 16) +
    '-' +
    uuid.slice(16, 20) +
    '-' +
    uuid.slice(20)
  );
};

export const getLocalISOString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const generateNumberArray = (min: number, max: number, step: number) => {
  const result = [];

  for (let i = min; i <= max; i += step) {
    result.push(i);
  }

  if (!result.includes(max)) {
    result.push(max);
  }

  return result;
};

export const replacePlaceholders = (
  template: string,
  replacements: { [key: string]: string },
): string => template.replace(/{{\s*([\w]+)\s*}}/g, (match, p1) => replacements[p1] || match);
