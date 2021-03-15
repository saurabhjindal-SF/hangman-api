export const replaceLetter = (
  origString: string,
  replaceChar: string,
  index: number,
) => {
  const firstPart = origString.substr(0, index);
  const lastPart = origString.substr(index + 1);

  const newString = firstPart + replaceChar + lastPart;
  return newString;
};
