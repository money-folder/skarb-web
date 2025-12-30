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
): string =>
  template.replace(
    /{{\s*([\w]+)\s*}}/g,
    (match, p1) => replacements[p1] || match,
  );

export const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
