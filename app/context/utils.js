//Extracting single quote Error
export const extractError = (message) => {
  const regex = /'([^']*)'/;
  const error = message?.match(regex);
  return error ? error[1] : null;
};
