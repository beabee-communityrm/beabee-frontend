export default (event: Event) => {
  return (event.target as HTMLInputElement).value;
};
