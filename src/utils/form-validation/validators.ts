const passwordValidator = (value: string): boolean => {
  // validates only if user enters password
  if (!value) return true;
  return (
    value.length >= 8 &&
    /[0-9]/.test(value) &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value)
  );
};
export { passwordValidator };
