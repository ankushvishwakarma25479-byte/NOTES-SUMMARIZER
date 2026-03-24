import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Send, Bot, Sparkles, AlertCircle, Lightbulb, HelpCircle, ListChecks } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function WorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [chat, setChat] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchDocumentData = async () => {
      try {
        // Fetch document by ID natively (we fetch all and filter since there's no single doc endpoint)
        const { data } = await api.get('/documents');
        const doc = data.data.find(d => d._id === id);
        
        if (!doc) {
          toast.error("Document not found");
          navigate('/dashboard');
          return;
        }
        
        setDocument(doc);
        
        // Fetch chat history
        const historyRes = await api.get(`/qa/${id}`);
        const historyMessages = historyRes.data.data.reduce((acc, currentQA) => {
          return [
            ...acc,
            { role: 'user', content: currentQA.question },
            { role: 'ai', content: currentQA.answer }
          ];
        }, []);
        
        setChat([
          { role: 'ai', content: 'Hello! I have analyzed this document. What would you like to know?' },
          ...historyMessages
        ]);
        
      } catch (error) {
        toast.error("Error loading document data");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentData();
  }, [id, navigate]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim() || isChatLoading || !document) return;
    
    const userMessage = query;
    setQuery('');
    setChat(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatLoading(true);
    
    try {
      const { data } = await api.post(`/qa/${id}`, { question: userMessage });
      // The backend returns the QA object
      setChat(prev => [...prev, { role: 'ai', content: data.data.answer }]);
    } catch (err) {
      toast.error("Failed to query the AI");
      // Optional: remove user message or show error mark
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSmartAction = async (action, endpoint, fieldInfo) => {
    if (isChatLoading) return;
    setIsChatLoading(true);
    setChat(prev => [...prev, { role: 'user', content: action }]);
    try {
      const { data } = await api.get(`/documents/${id}/${endpoint}`);
      const result = data.data[fieldInfo];
      const content = Array.isArray(result) ? result.join('\n• ') : result;
      setChat(prev => [...prev, { role: 'ai', content: Array.isArray(result) ? `• ${content}` : content }]);
      toast.success(`${action} completed! Check the Chat tab.`);
    } catch (err) {
      toast.error(`Failed: ${action}`);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading document workspace...</div>;
  }

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh] space-y-6">
        <div className="p-4 bg-muted rounded-full">
          <AlertCircle className="w-12 h-12 text-foreground/50" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">No Document Selected</h2>
          <p className="text-foreground/60 max-w-sm">Please select a document from your history or upload a new one to access the workspace.</p>
        </div>
        <Button onClick={() => navigate('/dashboard/upload')}>Upload Document</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
      {/* Left Panel: Document Viewer */}
      <div className="flex-1 bg-background border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4 bg-muted/50">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-foreground/70" />
            <h3 className="font-semibold truncate max-w-[200px]">{document.fileName}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => handleSmartAction("Explain like I'm 5", 'explain', 'explanation')} className="text-xs h-8"><Lightbulb className="w-3 h-3 mr-1" /> Explain Simply</Button>
            <Button size="sm" variant="outline" onClick={() => handleSmartAction("Generate Questions", 'questions', 'questions')} className="text-xs h-8"><HelpCircle className="w-3 h-3 mr-1" /> Questions</Button>
            <Button size="sm" variant="outline" onClick={() => handleSmartAction("Highlight Key Points", 'highlights', 'highlights')} className="text-xs h-8"><ListChecks className="w-3 h-3 mr-1" /> Highlights</Button>
          </div>
        </div>
        <div className="flex-1 p-8 overflow-y-auto font-serif text-foreground/80 leading-relaxed max-w-3xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Extracted Text Content</h2>
          <div className="whitespace-pre-wrap">
            {document.extractedText || "No readable text extracted."}
          </div>
          <div className="h-48" />
        </div>
      </div>

      {/* Right Panel: AI Tools */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-background border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
        <Tabs defaultValue="summary" className="h-full flex flex-col">
          <div className="p-2 border-b border-border bg-muted/20">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="keypoints">Key Points</TabsTrigger>
              <TabsTrigger value="chat">Q&A Chat</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            <TabsContent value="summary" className="h-full mt-0 overflow-y-auto p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-primary/10 rounded-full text-foreground border border-border">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">AI Summary</h3>
              </div>
              <div className="space-y-4 text-sm text-foreground/80 leading-relaxed p-4 bg-muted/50 rounded-lg border border-border whitespace-pre-wrap">
                {document.summary || "No summary available."}
              </div>
            </TabsContent>
            
            <TabsContent value="keypoints" className="h-full mt-0 overflow-y-auto p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-primary/10 rounded-full text-foreground border border-border">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Key Points</h3>
              </div>
              {document.keyPoints && document.keyPoints.length > 0 ? (
                <ul className="space-y-3 text-sm text-foreground/80 list-disc pl-5">
                  {document.keyPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-foreground/50 text-center py-4">No key points extracted.</p>
              )}
            </TabsContent>
            
            <TabsContent value="chat" className="h-full flex flex-col mt-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chat.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-border/50 flex items-center justify-center shrink-0">
                        <Bot className="h-5 w-5 text-foreground" />
                      </div>
                    )}
                    <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${
                      msg.role === 'user' 
                        ? 'bg-foreground text-background rounded-br-none' 
                        : 'bg-muted border border-border rounded-bl-none whitespace-pre-wrap'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-border/50 flex items-center justify-center shrink-0">
                      <Bot className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="p-3 bg-transparent flex gap-1 items-center">
                      <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce delay-150"></span>
                      <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce delay-300"></span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-border bg-background">
                <form onSubmit={handleSend} className="relative flex items-center">
                  <Input 
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Ask a question about the document..." 
                    disabled={isChatLoading}
                    className="pr-12 py-6 rounded-xl bg-muted/50 focus-visible:ring-1"
                  />
                  <Button disabled={isChatLoading} type="submit" size="icon" variant="ghost" className="absolute right-2 h-8 w-8 rounded-full hover:bg-foreground hover:text-background transition-colors">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
