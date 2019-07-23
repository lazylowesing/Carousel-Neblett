import { CarouselInternalState, CarouselProps } from "../types";
declare function populateSlidesOnMouseTouchMove(state: CarouselInternalState, props: CarouselProps, initialX: number, lastX: number, clientX: number): {
    direction?: string;
    nextPosition: number | undefined;
    canContinue: boolean;
};
export { populateSlidesOnMouseTouchMove };
