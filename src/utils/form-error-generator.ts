// TODO: Fix typing
const errorGenerator = (vuelidateInstance: any, validationProperty: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return vuelidateInstance[validationProperty].$errors[0]?.$message;
};

export { errorGenerator };
