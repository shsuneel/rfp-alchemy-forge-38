import React, { useState, useEffect, useRef } from 'react';
import ChatMessage, { Message } from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, MessageSquarePlus, ListChecks, Bot } from 'lucide-react';
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

// Reordered questions and updated prompt for documentUpload
const rfpCreationQuestions: RfpQuestion[] = [
  { id: uuidv4(), key: 'projectDescription', prompt: "Great! Let's start with your new RFP. Please provide a brief project description.", type: 'textarea', required: true },
  { id: uuidv4(), key: 'documentUpload', prompt: "Would you like to upload a document?", type: 'file', required: false },
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (botStage === 'initialActions' && messages.length === 0) { // ensure initial message is added only once
      addBotMessage("What would you like me to do for you today?", 'action-request', (
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <Button onClick={() => {
            setBotStage('creatingRfp');
            setCurrentQuestionIndex(0);
            setMessages([]); // Clear messages for new flow
            // Ensure rfpCreationQuestions is not empty before accessing index 0
            if (rfpCreationQuestions.length > 0) {
                addBotMessage(rfpCreationQuestions[0].prompt, 'input-prompt', renderInputForQuestion(rfpCreationQuestions[0]));
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
  }, [botStage, onNavigateToExistingRfps, messages.length]); // Added messages.length to dependency array


  const addMessage = (sender: 'bot' | 'user', text: string | undefined, type: Message['type'], children?: React.ReactNode) => {
    setMessages(prev => [...prev, { id: uuidv4(), sender, text, type, timestamp: new Date(), children }]);
  };

  const addBotMessage = (text: string, type: Message['type'] = 'text', children?: React.ReactNode) => {
    setIsBotTyping(true);
    setTimeout(() => {
      addMessage('bot', text, type, children);
      setIsBotTyping(false);
      // Auto-focus after bot message if it's an input prompt
      if (type === 'input-prompt' && inputRef.current) {
        inputRef.current.focus();
      }
    }, 500 + Math.random() * 500); // Simulate typing delay
  };

  const addUserMessage = (text: string) => {
    addMessage('user', text, 'text');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentInputValue(e.target.value);
  };
  
  const renderInputForQuestion = (question: RfpQuestion) => {
    if (question.type === 'file') {
      return (
        <div className="mt-2">
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
            <Paperclip className="mr-2 h-4 w-4" /> Attach Files
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
           <Button type="button" onClick={handleProceedWithoutFile} variant="ghost" className="mt-2 w-full text-sm">
            Skip / Proceed without file
          </Button>
        </div>
      );
    }
    
    return (
      <form onSubmit={handleInputSubmit} className="mt-2 flex flex-col sm:flex-row items-stretch gap-2">
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
        <Button type="submit" className="sm:self-end">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    );
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(f => f.name).join(', ');
      addUserMessage(`Uploaded: ${fileNames}`);
      
      const currentQuestion = rfpCreationQuestions[currentQuestionIndex];
      setRfpData(prev => ({ ...prev, [currentQuestion.key]: Array.from(files) })); 

      setCurrentInputValue(''); 
      
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < rfpCreationQuestions.length) {
        setCurrentQuestionIndex(nextIndex);
        addBotMessage(rfpCreationQuestions[nextIndex].prompt, 'input-prompt', renderInputForQuestion(rfpCreationQuestions[nextIndex]));
      } else {
        completeRfpCreation();
      }
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleProceedWithoutFile = () => {
    addUserMessage("Skipped file upload for this step.");
    // Store indication that file upload was skipped for this question
    const currentQuestion = rfpCreationQuestions[currentQuestionIndex];
    setRfpData(prev => ({ ...prev, [currentQuestion.key]: null })); // Or some other indicator like "skipped"
    
    setCurrentInputValue(''); // Clear any potential stray input
    
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < rfpCreationQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      addBotMessage(rfpCreationQuestions[nextIndex].prompt, 'input-prompt', renderInputForQuestion(rfpCreationQuestions[nextIndex]));
    } else {
      completeRfpCreation();
    }
  };

  const handleInputSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const currentQuestion = rfpCreationQuestions[currentQuestionIndex];
    if (currentQuestion.required && !currentInputValue.trim()) {
      toast.error("This field is required. Please provide a response.");
      // Re-focus on the input if it was required and empty
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

    setCurrentInputValue(''); 

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < rfpCreationQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      const nextQuestion = rfpCreationQuestions[nextIndex];
      addBotMessage(nextQuestion.prompt, 'input-prompt', renderInputForQuestion(nextQuestion));
    } else {
      completeRfpCreation();
    }
  };
  
  const completeRfpCreation = () => {
    // Ensure rfpData includes the last answer if any before this function was called
    // This might be redundant if handleInputSubmit always runs before, but good for safety.
    const finalRfpData = { ...rfpData };
    if (currentInputValue.trim() && currentQuestionIndex < rfpCreationQuestions.length) {
        const lastQuestionKey = rfpCreationQuestions[currentQuestionIndex].key;
        finalRfpData[lastQuestionKey] = currentInputValue;
    }

    addBotMessage("Thank you! I've collected all the initial information. What's next?", 'action-request', (
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <Button onClick={() => onRfpCreationComplete(finalRfpData)}>Proceed to RFP Builder</Button>
            {/* <Button variant="outline" onClick={() => { /* review or edit logic * / }}>Review My Answers</Button> */}
        </div>
    ));
    setBotStage('initialActions'); 
    // Clear messages and RFP data for a potential new session after completion,
    // or keep them if a review/edit step is added.
    // For now, let's reset for a clean start if user interacts again.
    // setMessages([]); // Commenting out to allow viewing conversation history
    setRfpData({});
    setCurrentQuestionIndex(0);
    setCurrentInputValue('');
  };

  // useEffect to focus input when a new question is rendered
  useEffect(() => {
    if (botStage === 'creatingRfp' && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.sender === 'bot' && lastMessage.type === 'input-prompt') {
            const currentQuestion = rfpCreationQuestions[currentQuestionIndex];
            if (currentQuestion && currentQuestion.type !== 'file' && inputRef.current) {
                 // Delay focus slightly to ensure the element is fully rendered and visible
                setTimeout(() => inputRef.current?.focus(), 100);
            }
        }
    }
  }, [messages, currentQuestionIndex, botStage]);


  return (
    <div className="flex flex-col h-full max-h-[70vh] w-full">
      <div className="flex-grow overflow-y-auto p-1 pr-2 space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isBotTyping && (
          <div className="flex items-center self-start p-4 animate-pulse">
            <Bot className="h-6 w-6 text-secondary-foreground mr-3" />
            <span className="text-sm text-muted-foreground">Bot is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default BotInteraction;
