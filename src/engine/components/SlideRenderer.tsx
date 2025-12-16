import React from 'react';
import { SlideData, SlideType } from '../types';

import { TitleSlide, SectionSlide, CourseOverviewSlide, MacroFocusSlide, ChapterTitleSlide, EndSlide } from './slides/VisualSlides';
import { ContentSlide } from './slides/ContentSlide';
import { CardSlide } from './slides/CardSlide';
import { AccordionSlide } from './slides/AccordionSlide';
import { SplitSlide, DiagramSlide, MatrixSlide, AdaptiveContentSlide } from './slides/StructureSlides';
import { PricingCardSlide } from './slides/PricingCardSlide';
import { LicenseSlide } from './slides/LicenseSlide';
import { FAQSlide } from './slides/FAQSlide';
import { FocusColsSlide } from './slides/FocusColsSlide';
import { PillarsSlide } from './slides/PillarsSlide';
import { KeyTakeawaysSlide } from './slides/KeyTakeawaysSlide';
import { StorySlide } from './slides/StorySlide';
import { PresenterSlide } from './slides/PresenterSlide';

interface SlideRendererProps {
  slide: SlideData;
}

type SlideComponent = React.FC<{ slide: SlideData }>;

const SLIDE_COMPONENT_MAP: Record<SlideType, SlideComponent> = {
  [SlideType.TITLE]: TitleSlide,
  [SlideType.SECTION]: SectionSlide,
  [SlideType.COURSE_OVERVIEW]: CourseOverviewSlide,
  [SlideType.MACRO_FOCUS]: MacroFocusSlide,
  [SlideType.CHAPTER_TITLE]: ChapterTitleSlide,
  [SlideType.CONTENT]: ContentSlide,
  [SlideType.CARDS]: CardSlide,
  [SlideType.ACCORDION]: AccordionSlide,
  [SlideType.SPLIT]: SplitSlide,
  [SlideType.DIAGRAM]: DiagramSlide,
  [SlideType.MATRIX]: MatrixSlide,
  [SlideType.ADAPTIVE_CONTENT]: AdaptiveContentSlide,
  [SlideType.PRICING]: PricingCardSlide,
  [SlideType.LICENSE]: LicenseSlide,
  [SlideType.FAQ]: FAQSlide,
  [SlideType.FOCUS_COLS]: FocusColsSlide,
  [SlideType.PILLARS]: PillarsSlide,
  [SlideType.KEY_TAKEAWAYS]: KeyTakeawaysSlide,
  [SlideType.STORY]: StorySlide,
  [SlideType.PRESENTER]: PresenterSlide,
  [SlideType.END]: EndSlide,
};

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide }) => {
  const SlideComponent = SLIDE_COMPONENT_MAP[slide.type];
  
  if (!SlideComponent) {
    return <div className="p-20 text-red-500 font-bold text-3xl">Unknown Slide Type: {slide.type}</div>;
  }
  
  return <SlideComponent slide={slide} />;
};
