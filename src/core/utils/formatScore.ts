export const formatScore = (score: number, nbDigints: number) => {
  const scoreAsText = score.toString();
  let zeroToAdd = 0;
  if (scoreAsText.length > nbDigints) return "9".repeat(6);
  zeroToAdd = nbDigints - scoreAsText.length;
  return "0".repeat(zeroToAdd) + scoreAsText;
};
