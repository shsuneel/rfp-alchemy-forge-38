
import React from "react";
import { Slide, Template } from "./PresentationEditor";

interface SlidePreviewProps {
  slide: Slide;
  template: Template;
  width?: number;
  height?: number;
  scale?: number;
  editable?: boolean;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({
  slide,
  template,
  width = 960,
  height = 540,
  scale = 1,
  editable = false,
}) => {
  const aspectRatio = width / height;
  const slideStyle = {
    width: `${width * scale}px`,
    height: `${height * scale}px`,
    backgroundColor: template.primaryColor,
    position: "relative" as const,
    overflow: "hidden",
  };

  const renderElement = (element: any) => {
    const elementStyle = {
      position: "absolute" as const,
      left: `${element.x * scale}px`,
      top: `${element.y * scale}px`,
      width: `${element.width * scale}px`,
      height: `${element.height * scale}px`,
      ...element.style,
    };

    switch (element.type) {
      case "text":
        return (
          <div 
            key={element.id}
            style={elementStyle}
            className="overflow-hidden"
          >
            {element.content}
          </div>
        );
      case "image":
        return (
          <img
            key={element.id}
            src={element.content}
            style={elementStyle}
            className="object-cover"
            alt="Slide element"
          />
        );
      case "shape":
        return (
          <div
            key={element.id}
            style={{
              ...elementStyle,
              backgroundColor: element.style?.backgroundColor || template.accentColor,
              borderRadius: element.style?.borderRadius || "0",
            }}
          />
        );
      case "diagram":
        return (
          <img
            key={element.id}
            src={element.content}
            style={elementStyle}
            className="object-contain"
            alt="Diagram"
          />
        );
      default:
        return null;
    }
  };

  // Add special styling for title slides
  const getTitleSlideElements = () => {
    if (slide.type === "title") {
      return (
        <div 
          className="absolute inset-0 flex flex-col"
          style={{ backgroundColor: template.primaryColor }}
        >
          <div 
            className="h-16 flex items-center px-12"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="text-white text-xl font-medium">
              {slide.elements.find(e => e.id === "elem-1")?.content || "Header Content"}
            </div>
          </div>
          
          <div className="flex-1 flex">
            <div className="w-[40%] flex flex-col justify-center p-12">
              <h1 className="text-white text-4xl font-bold mb-4">
                {slide.elements.find(e => e.id === "elem-2")?.content || slide.title}
              </h1>
              <div className="text-white mt-auto">
                {slide.elements.find(e => e.id === "elem-3")?.content || "Date"}
              </div>
            </div>
            
            <div 
              className="w-[60%] h-full"
              style={{ 
                backgroundImage: `url(${slide.elements.find(e => e.id === "elem-4")?.content || ""})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
          </div>
        </div>
      );
    }
    
    return slide.elements.map(element => renderElement(element));
  };

  return (
    <div style={slideStyle} className="shadow-lg">
      {getTitleSlideElements()}
      
      {slide.type === "master" && (
        <div className="absolute bottom-4 right-4 text-xs text-white opacity-60">
          Master Slide
        </div>
      )}
    </div>
  );
};

export default SlidePreview;
