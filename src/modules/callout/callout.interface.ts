export interface Callout {
  title: string;
  slug: string;
  expires: string | null;
  // not available from API response
  excerpt: string;
  image?: string;
}
