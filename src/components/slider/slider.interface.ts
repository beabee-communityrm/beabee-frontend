export interface AppSliderProps {
  infinite?: boolean;
}

export interface AppSliderSlideEventDetails {
  slideNumber: number;
  oldSlideNumber: number;
  slideEl: HTMLElement;
}
