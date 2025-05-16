import React, { useState } from 'react';
import RfpPromptInput from '@/components/home/RfpPromptInput';
import ContentOutlineDisplay from '@/components/home/ContentOutlineDisplay';
import DetailedInfoPrompt from '@/components/home/DetailedInfoPrompt';
import GuidedStepsNavigator from '@/components/home/GuidedStepsNavigator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Stage = 'initialPrompt' | 'outlineDisplay' | 'detailedInfoPrompt' | 'guidance';

// Simulated AI responses (placeholders)
const simulateAiOutline = (prompt: string): Promise<string> => {
  console.log("Simulating AI outline generation for:", prompt);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
`1. Introduction
   - Project Overview
   - Goals and Objectives
2. Scope of Work
   - Key Deliverables
   - Features (e.g., ${prompt.includes("mobile") ? "Mobile App," : ""} User Registration, Product Catalog)
3. Technical Requirements
   - Preferred Technologies (if any)
   - Performance and Scalability
4. Timeline and Budget
   - Expected Project Duration
   - Budget Constraints (if any)
5. Vendor Information
   - Submission Guidelines
   - Evaluation Criteria`
      );
    }, 1500);
  });
};

const simulateAiGuidanceSteps = (details: string): Promise<{ title: string; content: string }[]> => {
  console.log("Simulating AI guidance steps generation for:", details);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { title: "Project Goals", content: "Clearly define the primary and secondary goals of this project. What problems are you trying to solve?" },
        { title: "Target Audience", content: "Describe your target users. What are their needs and pain points?" },
        { title: "Key Features", content: "List the essential features required. For each, briefly explain its purpose." },
        { title: "Technical Specifications", content: "Any specific technologies, platforms, or integrations required?" },
        { title: "Success Metrics", content: "How will you measure the success of this project?" },
      ]);
    }, 1500);
  });
};


const HomePage = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('initialPrompt');
  const [rfpDescription, setRfpDescription] = useState('');
  const [contentOutline, setContentOutline] = useState('');
  const [detailedInfo, setDetailedInfo] = useState('');
  const [guidanceSteps, setGuidanceSteps] = useState<{ title: string; content: string }[]>([]);
  const [currentGuidanceStepIndex, setCurrentGuidanceStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInitialPromptSubmit = async (prompt: string) => {
    setIsLoading(true);
    setRfpDescription(prompt);
    const outline = await simulateAiOutline(prompt);
    setContentOutline(outline);
    setCurrentStage('outlineDisplay');
    setIsLoading(false);
  };

  const handleProceedToDetailedInfo = () => {
    setCurrentStage('detailedInfoPrompt');
  };

  const handleDetailedInfoSubmit = async (details: string) => {
    setIsLoading(true);
    setDetailedInfo(details);
    const steps = await simulateAiGuidanceSteps(details);
    setGuidanceSteps(steps);
    setCurrentGuidanceStepIndex(0);
    setCurrentStage('guidance');
    setIsLoading(false);
  };
  
  const handleNextGuidanceStep = () => {
    if (currentGuidanceStepIndex < guidanceSteps.length - 1) {
      setCurrentGuidanceStepIndex(prev => prev + 1);
    }
  };

  const handlePreviousGuidanceStep = () => {
    if (currentGuidanceStepIndex > 0) {
      setCurrentGuidanceStepIndex(prev => prev - 1);
    }
  };
  
  const handleCompleteGuidance = () => {
    // Navigate to the main app/forge or show a summary
    console.log("RFP data collected:", { rfpDescription, contentOutline, detailedInfo, guidanceSteps });
    // For now, navigate to the /forge page
    navigate('/forge'); 
    // Potentially dispatch an action to save this data to Redux rfpSlice
  };

  const handleBackToOutline = () => {
    setCurrentStage('outlineDisplay');
  };
  
  const handleRestart = () => {
    setRfpDescription('');
    setContentOutline('');
    setDetailedInfo('');
    setGuidanceSteps([]);
    setCurrentGuidanceStepIndex(0);
    setCurrentStage('initialPrompt');
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 sm:p-6 md:p-8 relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80')" }}
    >
      {/* Optional: Add a semi-transparent overlay if needed for better text contrast globally */}
      {/* <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div> */}

      {/* Content needs to be relative to stack on top of any global overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {currentStage !== 'initialPrompt' && (
           <Button 
              variant="ghost" 
              onClick={handleRestart} 
              className="absolute top-0 left-0 text-sm text-white bg-black/20 hover:bg-black/40 m-4" // Adjusted for visibility
            >
             <ArrowLeft className="mr-2 h-4 w-4" /> Start Over
           </Button>
        )}
         <Button 
              variant="outline" 
              onClick={() => navigate('/forge')} 
              className="absolute top-0 right-0 text-sm text-white bg-black/20 hover:bg-black/40 border-white/50 hover:border-white/70 m-4" // Adjusted for visibility
            >
             Go to RFP Forge <ArrowRight className="ml-2 h-4 w-4" />
           </Button>


        <div className="text-center mb-12 mt-16 sm:mt-0"> {/* Added margin-top for spacing from top buttons */}
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground drop-shadow-lg mb-3">
            AI-Powered RFP Assistant
          </h1>
          <p className="text-lg text-gray-200 drop-shadow-md max-w-2xl mx-auto">
            Let's craft your Request for Proposal together. Start by describing your project, and our AI will help you build a comprehensive RFP.
          </p>
        </div>

        {currentStage === 'initialPrompt' && (
          <div className="w-full max-w-lg p-6 rounded-xl bg-card/80 backdrop-blur-md shadow-xl border border-border/30">
            <RfpPromptInput onSubmit={handleInitialPromptSubmit} isLoading={isLoading} />
          </div>
        )}

        {currentStage === 'outlineDisplay' && (
          <div className="w-full max-w-lg flex flex-col items-center space-y-6">
            <ContentOutlineDisplay 
              outline={contentOutline} 
              className="bg-card/80 backdrop-blur-md shadow-xl border border-border/30" 
            />
            <Button onClick={handleProceedToDetailedInfo} className="w-full text-base py-3">
              Looks Good, Add More Details <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {currentStage === 'detailedInfoPrompt' && (
          <div className="w-full max-w-lg flex flex-col items-center space-y-6 p-6 rounded-xl bg-card/80 backdrop-blur-md shadow-xl border border-border/30">
            <Button variant="outline" onClick={handleBackToOutline} className="self-start text-sm mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Outline
            </Button>
            <DetailedInfoPrompt onSubmit={handleDetailedInfoSubmit} isLoading={isLoading} />
          </div>
        )}

        {currentStage === 'guidance' && guidanceSteps.length > 0 && (
          <GuidedStepsNavigator
            steps={guidanceSteps}
            currentStepIndex={currentGuidanceStepIndex}
            onNext={handleNextGuidanceStep}
            onPrevious={handlePreviousGuidanceStep}
            onComplete={handleCompleteGuidance}
            className="bg-card/80 backdrop-blur-md shadow-xl border border-border/30"
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
