
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage, { Message } from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, MessageSquarePlus, ListChecks, Bot as BotIcon, Check, X, FileText } from 'lucide-react'; // Added BotIcon, Check, X, FileText
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface BotInteractionProps {
  onRfpCreationComplete: (rfpData: Record<string, any>) => void;
  onNavigateToExistingRfps: () => void;
}

type BotStage = 'initialActions' | 'creatingRfp';

interface RfpQuestion {
  id: string;
  key: string;
  prompt: string;
  type: 'textarea' | 'text' | 'file';
  required?: boolean;
}

// Simplified extracted info type for bot display
interface BotExtractedInfo {
  projectDescription?: string;
  keyPoints?: string[];
}

const rfpCreationQuestions: RfpQuestion[] = [
  { id: uuidv4(), key: 'projectDescription', prompt: "Great! Let's start with your new RFP. Please provide a brief project description.", type: 'textarea', required: true },
  { id: uuidv4(), key: 'documentUpload', prompt: "Would you like to upload any existing documents (like project briefs, requirement lists, etc.)? This can help me understand your needs better.", type: 'file', required: false },
  { id: uuidv4(), key: 'rfpPurpose', prompt: "What is the main purpose or goal of this RFP?", type: 'textarea', required: true },
  { id: uuidv4(), key: 'problemStatement', prompt: "Can you describe the problem this project aims to solve?", type: 'textarea', required: false },
  // Add more questions as needed
];

const BotInteraction: React.FC<BotInteractionProps> = ({ onRfpCreationComplete, onNavigateToExistingRfps }) => {
  const [botStage, setBotStage] = useState<BotStage>('initialActions');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInputValue, setCurrentInputValue] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [rfpData, setRfpData] = useState<Record<string, any>>({});
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const [botExtractedInfo, setBotExtractedInfo] = useState<BotExtractedInfo | null>(null);
  const [isAwaitingExtractionChoice, setIsAwaitingExtractionChoice] = useState(false);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (botStage === 'initialActions' && messages.length === 0) {
      addBotMessage("What would you like me to do for you today?", 'action-request', (
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <Button onClick={() => {
            setBotStage('creatingRfp');
            setCurrentQuestionIndex(0);
            setMessages([]); 
            setRfpData({});
            setBotExtractedInfo(null);
            setIsAwaitingExtractionChoice(false);
            if (rfpCreationQuestions.length > 0) {
                addBotMessage(rfpCreationQuestions[0].prompt, 'input-prompt');
            }
          }} className="w-full sm:w-auto">
            <MessageSquarePlus className="mr-2 h-4 w-4" /> Create New RFP
          </Button>
          <Button variant="outline" onClick={onNavigateToExistingRfps} className="w-full sm:w-auto">
            <ListChecks className="mr-2 h-4 w-4" /> Open Existing RFP
          </Button>
        </div>
      ));
    }
  }, [botStage, onNavigateToExistingRfps, messages.length]);


  const addMessage = (sender: 'bot' | 'user', text: string | undefined, type: Message['type'], children?: React.ReactNode) => {
    setMessages(prev => [...prev, { id: uuidv4(), sender, text, type, timestamp: new Date(), children }]);
  };

  const addBotMessage = (text: string, type: Message['type'] = 'text', children?: React.ReactNode) => {
    setIsBotTyping(true);
    setTimeout(() => {
      addMessage('bot', text, type, children);
      setIsBotTyping(false);
      if (type === 'input-prompt' || type === 'file-upload-prompt') {
        const currentQuestion = rfpCreationQuestions[currentQuestionIndex];
        if (currentQuestion && (currentQuestion.type === 'text' || currentQuestion.type === 'textarea') && inputRef.current) {
          setTimeout(() => inputRef.current?.focus(), 50); // Ensure focus after bot message is rendered
        }
      }
    }, 500 + Math.random() * 500);
  };

  const addUserMessage = (text: string) => {
    addMessage('user', text, 'text');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentInputValue(e.target.value);
  };

  const proceedToNextStepOrComplete = () => {
    setCurrentInputValue(''); // Clear input for next question
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < rfpCreationQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      addBotMessage(rfpCreationQuestions[nextIndex].prompt, 'input-prompt');
    } else {
      completeRfpCreation();
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const uploadedFiles = Array.from(files);
      const fileNames = uploadedFiles.map(f => f.name).join(', ');
      addUserMessage(`Uploaded: ${fileNames}`);
      
      const currentQuestion = rfpCreationQuestions[currentQuestionIndex];
      setRfpData(prev => ({ ...prev, [currentQuestion.key]: uploadedFiles })); 

      // Simulate extraction
      setIsBotTyping(true);
      setTimeout(() => {
        const mockExtracted: BotExtractedInfo = {
          projectDescription: `From '${fileNames}', it seems the project is about developing a new web platform.`,
          keyPoints: [
            "User authentication is required.",
            "Data visualization dashboard needed.",
            "Mobile responsiveness is crucial."
          ]
        };
        setBotExtractedInfo(mockExtracted);
        setIsAwaitingExtractionChoice(true);
        setIsBotTyping(false);

        addBotMessage(
          "I've quickly scanned the document(s). Here's a summary:",
          'text',
          (
            <div className="mt-2 p-3 rounded-md bg-background/50 border border-border">
              {mockExtracted.projectDescription && (
                <p className="text-sm mb-1"><strong>Project Overview:</strong> {mockExtracted.projectDescription}</p>
              )}
              {mockExtracted.keyPoints && mockExtracted.keyPoints.length > 0 && (
                <>
                  <p className="text-sm font-medium mt-2 mb-1">Key Points:</p>
                  <ul className="list-disc list-inside text-sm space-y-0.5">
                    {mockExtracted.keyPoints.map((point, idx) => <li key={idx}>{point}</li>)}
                  </ul>
                </>
              )}
              <div className="flex gap-2 mt-4">
                <Button onClick={handleUseBotExtractedData} size="sm">
                  <Check className="mr-2 h-4 w-4" /> Use This Info
                </Button>
                <Button onClick={handleIgnoreBotExtractedData} variant="outline" size="sm">
                  <X className="mr-2 h-4 w-4" /> Ignore
                </Button>
              </div>
            </div>
          )
        );
      }, 1500); // Simulate delay for extraction
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleUseBotExtractedData = () => {
    addUserMessage("Okay, I'll use the extracted information.");
    if (botExtractedInfo) {
      const updates: Record<string, any> = {};
      if (botExtractedInfo.projectDescription) {
        // Only update projectDescription in rfpData if it's not already set by user or if this is a good override point
        if (!rfpData.projectDescription || rfpData.projectDescription.length < botExtractedInfo.projectDescription.length) {
             updates.projectDescription = botExtractedInfo.projectDescription;
        }
      }
      updates.botExtractedKeyPoints = botExtractedInfo.keyPoints || []; // Store key points

      setRfpData(prev => ({ ...prev, ...updates }));
      if(updates.projectDescription) {
        addBotMessage("I've updated the project description with the extracted info. You can edit it later if needed.");
      } else {
        addBotMessage("Noted the key points from the document.");
      }
    }
    setBotExtractedInfo(null);
    setIsAwaitingExtractionChoice(false);
    proceedToNextStepOrComplete();
  };

  const handleIgnoreBotExtractedData = () => {
    addUserMessage("Alright, I'll ignore the extracted summary.");
    setBotExtractedInfo(null);
    setIsAwaitingExtractionChoice(false);
    proceedToNextStepOrComplete();
  };


  const handleProceedWithoutFile = () => {
    addUserMessage("Skipped file upload for this step.");
    const currentQuestion = rfpCreationQuestions[currentQuestionIndex];
    setRfpData(prev => ({ ...prev, [currentQuestion.key]: null })); 
    proceedToNextStepOrComplete();
  };

  const handleInputSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const currentQuestion = rfpCreationQuestions[currentQuestionIndex];
    if (currentQuestion.required && !currentInputValue.trim()) {
      toast.error("This field is required. Please provide a response.");
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    if (currentInputValue.trim()) {
      addUserMessage(currentInputValue);
      setRfpData(prev => ({ ...prev, [currentQuestion.key]: currentInputValue }));
    } else if (!currentQuestion.required) {
       addUserMessage("(Skipped)"); 
       setRfpData(prev => ({ ...prev, [currentQuestion.key]: "" })); 
    }
    proceedToNextStepOrComplete();
  };
  
  const completeRfpCreation = () => {
    // Ensure last input value is captured if not submitted through form explicitly
    // This case is mostly handled by handleInputSubmit or file handlers now.
    // However, if proceedToNextStepOrComplete is called directly when last question is active and has input,
    // this logic could be relevant. For now, assuming currentInputValue is processed before this.
    
    addBotMessage("Thank you! I've collected all the initial information. What's next?", 'action-request', (
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <Button onClick={() => onRfpCreationComplete(rfpData)}>Proceed to RFP Builder</Button>
        </div>
    ));
    // Reset for a potential new RFP creation without full page reload
    setBotStage('initialActions'); // This will trigger the initial message setup via useEffect
    // setRfpData({}); // Moved to initialActions setup
    // setCurrentQuestionIndex(0); // Moved to initialActions setup
    // setCurrentInputValue(''); // Moved to initialActions setup
  };

  useEffect(() => {
    if (botStage === 'creatingRfp' && !isAwaitingExtractionChoice) { // Only focus if not waiting for extraction choice
      const currentQuestion = rfpCreationQuestions[currentQuestionIndex];
      if (currentQuestion && (currentQuestion.type === 'text' || currentQuestion.type === 'textarea') && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [currentQuestionIndex, botStage, isAwaitingExtractionChoice]);

  const renderActiveInputArea = () => {
    // Do not render input area if awaiting extraction choice, the choice buttons are in chat.
    if (botStage !== 'creatingRfp' || currentQuestionIndex >= rfpCreationQuestions.length || isAwaitingExtractionChoice) {
      return null;
    }

    const question = rfpCreationQuestions[currentQuestionIndex];

    if (question.type === 'file') {
      return (
        <div className="p-4 border-t border-border bg-background">
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
            <Paperclip className="mr-2 h-4 w-4" /> Attach Files
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.md" // Added common document types
          />
           <Button type="button" onClick={handleProceedWithoutFile} variant="ghost" className="mt-2 w-full text-sm">
            Skip / Proceed without file
          </Button>
        </div>
      );
    }
    
    return (
      <form onSubmit={handleInputSubmit} className="p-4 border-t border-border bg-background flex flex-col sm:flex-row items-stretch gap-2">
        {question.type === 'textarea' ? (
          <Textarea
            value={currentInputValue}
            onChange={handleInputChange}
            placeholder="Your response..."
            rows={3}
            className="flex-grow"
            required={question.required}
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          />
        ) : (
          <Input
            value={currentInputValue}
            onChange={handleInputChange}
            placeholder="Type here..."
            className="flex-grow"
            required={question.required}
            ref={inputRef as React.RefObject<HTMLInputElement>}
          />
        )}
        <Button type="submit" className="sm:self-end mt-2 sm:mt-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    );
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh] w-full bg-card text-card-foreground rounded-lg shadow-lg">
      <div className="flex-grow overflow-y-auto p-1 pr-2 space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isBotTyping && (
          <div className="flex items-center self-start p-3 ml-2"> {/* Adjusted padding/margin */}
            <BotIcon className="h-6 w-6 text-secondary-foreground mr-2" /> {/* Explicitly use BotIcon */}
            <span className="text-sm text-muted-foreground animate-pulse">Bot is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {renderActiveInputArea()}
    </div>
  );
};

export default BotInteraction;
