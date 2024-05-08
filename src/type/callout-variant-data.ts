/** @deprecated Use this type from the common package instead */
export interface CalloutVariantData {
  title: string;
  excerpt: string;
  intro: string;
  thanksTitle: string;
  thanksText: string;
  thanksRedirect: string | null;
  shareTitle: string | null;
  shareDescription: string | null;
  slideNavigation: Record<string, CalloutVariantNavigationData>;
  componentText: Record<string, string>;
}

/** @deprecated Use this type from the common package instead */
export interface CalloutVariantNavigationData {
  prevText: string;
  nextText: string;
  submitText: string;
}
