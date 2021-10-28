export interface Callout {
  title: string;
  slug: string;
  expires: string | null;
  excerpt: string;
  image?: string;
  templateSchema: {
    intro: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    formSchema: object;
  };
}
