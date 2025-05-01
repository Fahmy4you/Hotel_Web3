export const checkIsNumber = (value: string | null | undefined): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  const trimmedValue = value.trim();

  if (trimmedValue === "") {
    return false;
  }

  const num = Number(trimmedValue);
  return !isNaN(num) && isFinite(num);
};
