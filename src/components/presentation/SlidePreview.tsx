
import React from "react";
import { Slide, Template, SlideElement } from "@/store/presentationSlice";

interface SlidePreviewProps {
  slide: Slide;
  template: Template;
  width?: number;
  height?: number;
  scale?: number;
  editable?: boolean;
  masterElements?: SlideElement[];
  slideIndex?: number;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({
  slide,
  template,
  width = 960,
  height = 540,
  scale = 1,
  editable = false,
  masterElements = [],
  slideIndex,
}) => {
  const aspectRatio = width / height;
  const slideStyle = {
    width: `${width * scale}px`,
    height: `${height * scale}px`,
    backgroundColor: template.primaryColor,
    backgroundImage: slide.customBackground ? `url(${slide.customBackground})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative" as const,
    overflow: "hidden",
  };

  const renderElement = (element: SlideElement) => {
    const elementStyle = {
      position: "absolute" as const,
      left: `${element.x * scale}px`,
      top: `${element.y * scale}px`,
      width: `${element.width * scale}px`,
      height: `${element.height * scale}px`,
      ...(element.style || {}),
    };

    // Special handling for page numbers
    if (element.role === "pageNumber" && slideIndex !== undefined) {
      const content = element.content.replace("{page}", `${slideIndex + 1}`);
      
      return (
        <div 
          key={element.id}
          style={elementStyle}
          className="overflow-hidden"
        >
          {content}
        </div>
      );
    }

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
      case "logo":
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
      case "footer":
      case "header":
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

  // Add special styling for specific slide types
  const getSlideContent = () => {
    switch (slide.type) {
      case "title":
        return (
          <div 
            className="absolute inset-0 flex flex-col"
            style={{ 
              backgroundColor: slide.customBackground ? 'transparent' : template.primaryColor 
            }}
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
      
      case "section":
        // Use agenda style from the uploaded image
        if (template.id === "agenda") {
          return (
            <div className="absolute inset-0 flex">
              <div className="w-1/2 h-full bg-cover bg-center" 
                   style={{ backgroundImage: "url('/lovable-uploads/7d958b51-2c47-49c4-ad1c-03bcf81b4262.png')" }}>
              </div>
              <div className="w-1/2 bg-[#1E293B] p-8 flex flex-col justify-center">
                <h2 className="text-4xl font-bold text-white mb-12">AGENDA</h2>
                <div className="space-y-8">
                  {[1, 2, 3, 4].map(num => (
                    <div key={num} className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-full border-2 border-white text-white flex items-center justify-center text-xl">
                        {num}
                      </div>
                      <div className="text-xl text-white">
                        {slide.elements.find(e => e.id === `agenda-item-${num}`)?.content || 
                         ["Our Understanding", "Overall Process & Approach", "Technical Architecture", "Implementation Plan"][num-1]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        } else if (template.id === "understanding") {
          return (
            <div className="absolute inset-0 flex">
              <div className="w-[45%] h-full bg-[#002060] p-10 flex flex-col justify-center">
                <div className="text-8xl font-bold text-white mb-4">00</div>
                <h2 className="text-3xl font-bold text-white">
                  {slide.elements.find(e => e.id.includes("title"))?.content || "Understanding of Ask"}
                </h2>
              </div>
              <div className="w-[55%] h-full bg-cover bg-center"
                   style={{ backgroundImage: "url('/lovable-uploads/f9b25e6f-fbcf-4ead-b44f-cd069f221d2d.png')" }}>
              </div>
            </div>
          );
        } else {
          return (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              {[...slide.elements].map(element => renderElement(element))}
              {slide.applyMaster !== false && masterElements.map(element => renderElement(element))}
            </div>
          );
        }
      
      case "template":
        if (template.id === "blank") {
          return (
            <div className="absolute inset-0 flex"
                 style={{ backgroundImage: "url('/lovable-uploads/919105d7-797a-4abc-8b18-b7a547e61870.png')" }}>
              <div className="absolute bottom-8 left-16">
                <img src="/lovable-uploads/f9b25e6f-fbcf-4ead-b44f-cd069f221d2d.png" 
                     alt="Logo" 
                     className="h-12 object-contain" />
              </div>
              {[...slide.elements].map(element => renderElement(element))}
              {slide.applyMaster !== false && masterElements.map(element => renderElement(element))}
            </div>
          );
        } else {
          return (
            <div className="absolute inset-0">
              {/* Pre-defined layout placeholders */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-white bg-opacity-20" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-white bg-opacity-10" />
              
              {[...slide.elements].map(element => renderElement(element))}
              {slide.applyMaster !== false && masterElements.map(element => renderElement(element))}
            </div>
          );
        }
        
      case "master":
        // For master slide preview, just render all master elements
        return (
          <div className="absolute inset-0">
            {slide.elements.map(element => renderElement(element))}
          </div>
        );
        
      default:
        return (
          <>
            {slide.elements.map(element => renderElement(element))}
            {slide.applyMaster !== false && masterElements.map(element => renderElement(element))}
          </>
        );
    }
  };

  return (
    <div style={slideStyle} className="shadow-lg">
      {getSlideContent()}
      
      {slide.type === "master" && (
        <div className="absolute bottom-4 right-4 text-xs text-white opacity-60">
          Master Slide
        </div>
      )}
      
      {slideIndex !== undefined && (
        <div className="absolute bottom-2 right-2 text-xs text-white opacity-60">
          Slide {slideIndex + 1}
        </div>
      )}
    </div>
  );
};

export default SlidePreview;
