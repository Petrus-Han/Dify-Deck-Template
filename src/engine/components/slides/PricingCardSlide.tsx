import React from 'react';
import { SlideData } from '../../types';
import { SlideHeader } from '../Shared';
import { Info } from 'lucide-react';

interface PricingCardSlideProps {
  slide: SlideData;
}

export const PricingCardSlide: React.FC<PricingCardSlideProps> = ({ slide }) => {

  const isHighlightedDescription = (desc: string) => {
      const keywords = ['免费', 'free', '云市场', 'marketplace', 'custom', '定制'];
      return keywords.some(k => desc.toLowerCase().includes(k));
  };

  const isSuccessDescription = (desc: string) => {
      return ['免费', 'free'].some(k => desc.toLowerCase().includes(k));
  };

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 md:p-8 lg:p-12">
      <SlideHeader title={slide.title} subtitle={slide.subtitle} variant="vertical-bar" />
      
      <div className="flex-1 w-full overflow-y-auto p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch pt-2 pr-2">
          {slide.items?.map((item, idx) => (
            <div 
              key={idx} 
              className="relative flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Top Color Bar */}
              <div className={`h-2 w-full rounded-t-lg ${item.topBarColor || 'bg-gray-200'}`}></div>

              {/* Badge - "重点关注" style from image 2 */}
              {item.badge && (
                <div className="absolute -top-2 -right-2 z-10">
                   <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 shadow-md transform rotate-6 flex items-center rounded-sm">
                      <div className="mr-1 border-2 border-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">@</div>
                      {item.badge}
                   </div>
                </div>
              )}
              
              <div className="p-5 flex flex-col h-full">
                {/* Header: Icon + Title */}
                <div className="flex items-center mb-4">
                  {item.icon && <div className="mr-2">{item.icon}</div>}
                  <h3 className="text-xl font-bold text-blue-700">{item.title}</h3>
                </div>

                {/* Price / Large Status Text */}
                {item.price ? (
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">{item.price}</span>
                    {item.priceUnit && <span className="text-gray-500 ml-2 text-sm">{item.priceUnit}</span>}
                  </div>
                ) : (
                   // If no price, check description for "Free" style large text
                   item.description && isHighlightedDescription(item.description) ? (
                     <div className={`mb-6 text-3xl font-bold ${isSuccessDescription(item.description) ? 'text-green-600' : 'text-gray-900'}`}>
                       {item.description}
                     </div>
                   ) : null
                )}

                {/* Features List */}
                {item.features && (
                  <ul className="space-y-3 flex-1">
                    {item.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start text-sm text-gray-700 font-medium">
                        <div className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {/* Description fallback if not used as large status */}
                 {item.description && !item.price && !isHighlightedDescription(item.description) && (
                   <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Banner */}
      {slide.bottomBanner && (
        <div className="mt-6 sm:mt-8 w-full border border-red-400 bg-red-50 p-3 sm:p-4 rounded-lg flex items-center justify-center text-red-700 font-bold text-sm sm:text-base md:text-lg shadow-sm">
           <div className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs font-black">
             !
           </div>
           {slide.bottomBanner.text}
        </div>
      )}

      {/* Footer Note */}
      {slide.footer && (
        <div className="mt-4 w-full text-center text-slate-500 text-sm sm:text-base font-medium italic">
          {slide.footer}
        </div>
      )}
    </div>
  );
};
