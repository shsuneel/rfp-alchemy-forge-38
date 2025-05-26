import React, { useState, useEffect } from 'react';
import RfpPromptInput from '@/components/home/RfpPromptInput';
import ContentOutlineDisplay from '@/components/home/ContentOutlineDisplay';
import DetailedInfoPrompt from '@/components/home/DetailedInfoPrompt';
import GuidedStepsNavigator from '@/components/home/GuidedStepsNavigator';
import TemplateSelectionView from '@/components/home/TemplateSelectionView';
import BotInteraction from '@/components/bot/BotInteraction';
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
  setPendingFilesForExtraction,
} from '@/store/rfpSlice';
import { toast as sonnerToast } from 'sonner';
import { useToast } from '@/components/ui/use-toast';

type Stage = 'botInterface' | 'initialPrompt' | 'outlineDisplay' | 'detailedInfoPrompt' | 'guidance' | 'templateSelection';

// Simulated AI responses (placeholders)
const simulateAiOutline = async (prompt: string): Promise<string> => {
  console.log("Simulating AI outline generation for:", prompt);
  const suggestionUri: string = 'http://localhost:3020/ai/suggestion';
  const pptUri: string = 'http://localhost:3020/py/ppt';
  const response = await axios.post(suggestionUri, {
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

// Removed the simulateAiGuidanceSteps.initialData related logic as it's now handled by a state variable.

const getGreeting = () => {
  const hour = new Date().getHours();
  // Assuming a user name, e.g., from auth context or hardcoded for now
  const userName = "Valued User"; // Placeholder, ideally from user context
  if (hour < 12) return `Good Morning, ${userName}`;
  if (hour < 18) return `Good Afternoon, ${userName}`;
  return `Good Evening, ${userName}`;
};

const HomePage = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('botInterface'); // Default to new bot interface
  const [rfpDescription, setRfpDescription] = useState('');
  const [contentOutline, setContentOutline] = useState('');
  const [detailedInfo, setDetailedInfo] = useState('');
  const [guidanceSteps, setGuidanceSteps] = useState<{ title: string; content: string }[]>([]);
  const [initialGuidanceSteps, setInitialGuidanceSteps] = useState<{ title: string; content: string }[]>([]);
  const [currentGuidanceStepIndex, setCurrentGuidanceStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast: shadcnToast } = useToast();

  const greetingMessage = getGreeting();

  const handleInitialPromptSubmit = async (prompt: string) => {
    setIsLoading(true);
    setRfpDescription(prompt);
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
    // Store a deep copy of the initial steps for later reference (e.g., for requirements)
    setInitialGuidanceSteps(JSON.parse(JSON.stringify(steps)));
    setGuidanceSteps(steps); // These steps will be modified by user input/AI suggestions
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

  const handleGuidanceStepContentChange = (stepIndex: number, newContent: string) => {
    setGuidanceSteps(prevSteps =>
      prevSteps.map((step, index) =>
        index === stepIndex ? { ...step, content: newContent } : step
      )
    );
  };

  const handleCompleteGuidanceAndPrepareRfpData = () => {
    dispatch(clearCurrentRfp());

    let combinedProjectDescription = rfpDescription;
    if (contentOutline) {
      combinedProjectDescription += `\n\n--- Outline Suggested by AI Assistant ---\n${contentOutline}`;
    }
    if (detailedInfo) {
      combinedProjectDescription += `\n\n--- Additional Details Provided by User ---\n${detailedInfo}`;
    }
    if (guidanceSteps.length > 0) {
      combinedProjectDescription += `\n\n--- Guided Steps Information ---`;
      guidanceSteps.forEach(step => {
        combinedProjectDescription += `\n\n## ${step.title}\n${step.content}`;
      });
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

    const newRequirements: RequirementItem[] = guidanceSteps.map((step, index) => {
      // Find the original step definition from initialGuidanceSteps
      const originalStepDefinition = initialGuidanceSteps.find(s => s.title === step.title);
      // Use the original content if available, otherwise fall back to current step's content (which might have been user-edited)
      const requirementDescriptionContent = originalStepDefinition ? originalStepDefinition.content : step.content;

      return {
        id: `guidance-req-${Date.now()}-${index}`,
        description: `Consideration for "${step.title}": ${requirementDescriptionContent}`,
        priority: "Medium",
      };
    });

    if (newRequirements.length > 0) {
      dispatch(setRequirements(newRequirements));
    }

    console.log("RFP data collected and dispatched to Redux from guidance steps. Updated description includes step content.");
    setCurrentStage('templateSelection');
  };

  const handleSelectTemplate = (templateId: string) => {
    console.log("Template selected:", templateId);
    // Here you would typically dispatch an action to apply the template
    // e.g., dispatch(applyRfpTemplate(templateId));
    // For now, we'll just toast and navigate
    shadcnToast({
      title: "Template Selected (Illustrative)",
      description: `You selected template "${templateId}". Proceeding with your entered data. Full template functionality is a future enhancement.`,
    });
    navigate(ROUTES.FORGE, { state: { tab: 'rfp', fromHomePage: true } });
  };

  const handleStartBlankRfp = () => {
    console.log("Starting with a blank RFP using collected data.");
    shadcnToast({
      title: "Starting Blank RFP",
      description: "Proceeding to RFP Builder with the information you provided.",
    });
    navigate(ROUTES.FORGE, { state: { tab: 'rfp', fromHomePage: true } });
  };

  const handleBackToOutline = () => {
    setCurrentStage('outlineDisplay');
  };

  const handleStartNewRfpBotFlow = () => {
    dispatch(clearCurrentRfp()); // Clear any previous RFP data
    // The BotInteraction component will handle its own state for conversation
    // No need to set a specific 'stage' for BotInteraction's internal steps here,
    // as BotInteraction itself becomes the content for the 'botInterface' stage.
    // If BotInteraction needed to navigate HomePage stages, we'd do that from BotInteraction via a callback.
  };

  const handleNavigateToExistingRfps = () => {
    navigate(ROUTES.FORGE, { state: { tab: 'rfpList' } });
  };

  const handleRestart = () => {
    dispatch(clearCurrentRfp()); // Clear Redux store on restart
    setRfpDescription('');
    setContentOutline('');
    setDetailedInfo('');
    setGuidanceSteps([]);
    setInitialGuidanceSteps([]); // Clear initial steps as well
    setCurrentGuidanceStepIndex(0);
    setCurrentStage('botInterface'); // Restart to the new bot interface greeting
  };
  
  // Function to switch to the old flow, if needed, or could be removed if new UI replaces old.
  const switchToOldFlow = () => {
    setCurrentStage('initialPrompt');
  };

  const handleBotRfpCreationComplete = (rfpData: Record<string, any>) => {
    console.log("Bot interaction collected RFP Data:", rfpData);
    dispatch(clearCurrentRfp());

    let fullDescription = rfpData.projectDescription || '';
    if (rfpData.rfpPurpose) {
      fullDescription += `\n\nPurpose of RFP:\n${rfpData.rfpPurpose}`;
    }
    if (rfpData.problemStatement) {
      fullDescription += `\n\nProblem Statement:\n${rfpData.problemStatement}`;
    }
    if (rfpData.botExtractedKeyPoints && rfpData.botExtractedKeyPoints.length > 0) {
        fullDescription += `\n\nKey points extracted by Bot from documents:\n- ${rfpData.botExtractedKeyPoints.join('\n- ')}`;
    }

    dispatch(setProjectInfo({
      name: rfpData.projectDescription 
        ? `RFP: ${rfpData.projectDescription.substring(0, 40)}${rfpData.projectDescription.length > 40 ? '...' : ''}` 
        : 'New RFP (from Bot)',
      description: fullDescription,
      sector: '', // Placeholder, or extract from rfpData if available
      clientInfo: '', // Placeholder, or extract from rfpData if available
    }));

    if (rfpData.documentUpload && rfpData.documentUpload.length > 0) {
      dispatch(setPendingFilesForExtraction(rfpData.documentUpload as File[]));
    } else {
      dispatch(setPendingFilesForExtraction(null));
    }

    sonnerToast.success("RFP Data Collected", { description: "Proceeding to RFP Builder." });
    navigate(ROUTES.FORGE, { state: { tab: 'rfp', fromHomePage: true } }); // Removed rfpDataFromBot from state
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 sm:p-6 md:p-8 relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg"></div> {/* Increased blur and darkness */}

      <div className="relative z-10 flex flex-col items-center justify-center w-full py-8"> {/* Added py-8 for padding */}
        {currentStage !== 'botInterface' && ( // Show restart only if not on initial bot screen
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
          onClick={() => navigate(ROUTES.FORGE, { state: { tab: 'rfpList' } })}
          className="absolute top-4 right-4 text-sm text-white bg-black/40 hover:bg-black/60 border-white/50 hover:border-white/70 m-2 sm:m-4" // Adjusted margin and opacity
        >
          Go to RFP Forge <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="w-full text-center mb-10 mt-16 sm:mt-8 p-6 rounded-lg bg-black/50 shadow-xl max-w-[60rem]"> {/* Adjusted margins */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg mb-3">
            AI-Powered RFP Assistant
          </h1>
           {currentStage === 'botInterface' ? (
            <p className="text-xl text-gray-100 drop-shadow-md max-w-4xl mx-auto">
              {greetingMessage}
            </p>
          ) : (
            <p className="text-lg text-gray-100 drop-shadow-md max-w-4xl mx-auto">
              Let's craft your RFP together.<br />
              Start by describing your project, and RFP Builder powered by GenAI will help you build a comprehensive RFP.
            </p>
          )}
        </div>

        {currentStage === 'botInterface' && (
          <div className="w-full max-w-[60rem] p-6 rounded-xl bg-card/80 backdrop-blur-md shadow-xl border border-border/30">
            <BotInteraction 
              onRfpCreationComplete={handleBotRfpCreationComplete} // Updated handler
              onNavigateToExistingRfps={handleNavigateToExistingRfps}
            />
            {/* Button to access the old flow if needed during transition */}
            {/* <Button variant="link" onClick={switchToOldFlow} className="mt-4 text-white/80">
              Or use the classic RFP builder
            </Button> */}
          </div>
        )}

        {currentStage === 'initialPrompt' && (
          <div className="w-full max-w-[60rem] p-6 rounded-xl bg-card/80 backdrop-blur-md shadow-xl border border-border/30">
            <RfpPromptInput onSubmit={handleInitialPromptSubmit} isLoading={isLoading} />
          </div>
        )}

        {currentStage === 'outlineDisplay' && (
          <div className="w-full max-w-[60rem] flex flex-col items-center space-y-6"> {/* This container remains max-w-lg as "Content Outline Display" was not specified for width change */}
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
          // This container remains max-w-lg as "Detailed Info Prompt" was not specified for width change
          <div className="w-full max-w-[60rem] flex flex-col items-center space-y-6"> {/* This container remains max-w-lg as "Content Outline Display" was not specified for width change */}
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
            onComplete={handleCompleteGuidanceAndPrepareRfpData}
            onStepContentChange={handleGuidanceStepContentChange}
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
