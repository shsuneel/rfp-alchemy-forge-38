import React, { useState } from 'react';
import RfpPromptInput from '@/components/home/RfpPromptInput';
import ContentOutlineDisplay from '@/components/home/ContentOutlineDisplay';
import DetailedInfoPrompt from '@/components/home/DetailedInfoPrompt';
import GuidedStepsNavigator from '@/components/home/GuidedStepsNavigator';
import TemplateSelectionView from '@/components/home/TemplateSelectionView'; // New import
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import axios from 'axios';
import {
  clearCurrentRfp,
  setProjectInfo,
  setRequirements,
  RequirementItem,
  // Potentially add action to set template later: setRfpTemplate
} from '@/store/rfpSlice';
import { toast } from '@/components/ui/use-toast'; // For template selection toast

type Stage = 'initialPrompt' | 'outlineDisplay' | 'detailedInfoPrompt' | 'guidance' | 'templateSelection'; // Added 'templateSelection'

// Simulated AI responses (placeholders)
const simulateAiOutline = async (prompt: string): Promise<string> => {
  console.log("Simulating AI outline generation for:", prompt);
   const response = await axios.post('http://localhost:3020/ai/suggestion', {
          field: "outline",
          currentValue: prompt,
        });
  return response.data.suggestion || "Outline generation failed.";
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
  const dispatch = useAppDispatch();

  const handleInitialPromptSubmit = async (prompt: string) => {
    setIsLoading(true);
    setRfpDescription(prompt);
    // Ensure previous RFP data is cleared if starting a new flow
    dispatch(clearCurrentRfp()); 
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
  
  const handleCompleteGuidanceAndPrepareRfpData = () => {
    // Data preparation logic, same as before
    dispatch(clearCurrentRfp()); // Clear again to ensure fresh start for this specific RFP generation

    let combinedProjectDescription = rfpDescription;
    if (contentOutline) {
      combinedProjectDescription += `\n\n--- Outline Suggested by AI Assistant ---\n${contentOutline}`;
    }
    if (detailedInfo) {
      combinedProjectDescription += `\n\n--- Additional Details Provided by User ---\n${detailedInfo}`;
    }

    const projectName = rfpDescription 
      ? `RFP: ${rfpDescription.substring(0, 40)}${rfpDescription.length > 40 ? '...' : ''}`
      : 'New RFP Project';

    dispatch(setProjectInfo({
      name: projectName,
      description: combinedProjectDescription,
      sector: '', 
      clientInfo: '', 
    }));

    const newRequirements: RequirementItem[] = guidanceSteps.map((step, index) => ({
      id: `guidance-req-${Date.now()}-${index}`,
      // Use step.content as the AI's prompt/question, not the user's answer to it.
      // User answers are not collected directly in guidance steps currently.
      // This structure assumes the guidance steps themselves become requirements.
      description: `Consideration for "${step.title}": ${step.content}`, 
      priority: "Medium",
    }));

    if (newRequirements.length > 0) {
      dispatch(setRequirements(newRequirements));
    }
    
    console.log("RFP data collected and dispatched to Redux from guidance steps.");
    setCurrentStage('templateSelection'); // Move to template selection
  };

  const handleSelectTemplate = (templateId: string) => {
    console.log("Template selected:", templateId);
    // Here you would typically dispatch an action to apply the template
    // e.g., dispatch(applyRfpTemplate(templateId));
    // For now, we'll just toast and navigate
    toast({
      title: "Template Selected (Illustrative)",
      description: `You selected template "${templateId}". Proceeding with your entered data. Full template functionality is a future enhancement.`,
    });
    navigate(ROUTES.FORGE, { state: { tab: 'rfp', fromHomePage: true } });
  };

  const handleStartBlankRfp = () => {
    console.log("Starting with a blank RFP using collected data.");
    toast({
      title: "Starting Blank RFP",
      description: "Proceeding to RFP Builder with the information you provided.",
    });
    navigate(ROUTES.FORGE, { state: { tab: 'rfp', fromHomePage: true } });
  };

  const handleBackToOutline = () => {
    setCurrentStage('outlineDisplay');
  };
  
  const handleRestart = () => {
    dispatch(clearCurrentRfp()); // Clear Redux store on restart
    setRfpDescription('');
    setContentOutline('');
    setDetailedInfo('');
    setGuidanceSteps([]);
    setCurrentGuidanceStepIndex(0);
    setCurrentStage('initialPrompt');
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 sm:p-6 md:p-8 relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg"></div> {/* Increased blur and darkness */}

      <div className="relative z-10 flex flex-col items-center justify-center w-full py-8"> {/* Added py-8 for padding */}
        {currentStage !== 'initialPrompt' && (
           <Button 
              variant="ghost" 
              onClick={handleRestart} 
              className="absolute top-4 left-4 text-sm text-white bg-black/40 hover:bg-black/60 m-2 sm:m-4" // Adjusted margin and opacity
            >
             <ArrowLeft className="mr-2 h-4 w-4" /> Start Over
           </Button>
        )}
         <Button 
              variant="outline" 
              onClick={() => navigate(ROUTES.FORGE, { state: { tab: 'rfpList' }})}
              className="absolute top-4 right-4 text-sm text-white bg-black/40 hover:bg-black/60 border-white/50 hover:border-white/70 m-2 sm:m-4" // Adjusted margin and opacity
            >
             Go to RFP Forge <ArrowRight className="ml-2 h-4 w-4" />
           </Button>


        <div className="text-center mb-10 mt-16 sm:mt-8 p-6 rounded-lg bg-black/50 shadow-xl max-w-3xl"> {/* Adjusted margins */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg mb-3">
            AI-Powered RFP Assistant
          </h1>
          <p className="text-lg text-gray-100 drop-shadow-md Tell us about your RFP. What are the main goals and requirements?max-w-2xl mx-auto">
            Let's craft your RFP together. Start by describing your project, and RFP Builder powered by GenAI will help you build a comprehensive RFP.
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
            onComplete={handleCompleteGuidanceAndPrepareRfpData} // Changed handler
            className="bg-card/80 backdrop-blur-md shadow-xl border border-border/30"
          />
        )}

        {currentStage === 'templateSelection' && (
          <TemplateSelectionView
            onSelectTemplate={handleSelectTemplate}
            onStartBlank={handleStartBlankRfp}
            className="animate-fade-in"
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
