export default (event: Event): string => {
  return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
};
