import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, File, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const processNotes = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsProcessing(false);
      toast.success('Document uploaded and processed successfully');
      navigate(`/dashboard/workspace/${data.data._id}`);
    } catch (error) {
      setIsProcessing(false);
      toast.error(error.response?.data?.message || 'Error processing document');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Notes</h1>
        <p className="text-foreground/70 mb-8 mt-2">Upload PDF or Text files to instantly generate summaries and key points.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center transition-colors flex flex-col items-center justify-center space-y-4",
              dragActive ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/50",
              file ? "border-solid bg-background" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="p-4 bg-border/50 rounded-full mb-4">
                  <UploadCloud className="h-8 w-8 text-foreground/70" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Click or drag file to this area to upload</h3>
                <p className="text-sm text-foreground/50 mb-4">Supported formats: PDF, TXT (Max 10MB)</p>
                <div className="mt-2 relative">
                  <Button variant="outline" type="button" className="pointer-events-none">Select File</Button>
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }} 
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full flex items-center justify-between p-4 border border-border rounded-lg bg-background"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-border/50 rounded-lg">
                    <File className="h-8 w-8 text-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-foreground/50">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {!isProcessing ? (
                  <button onClick={() => setFile(null)} className="p-2 hover:bg-border/50 rounded-full transition-colors text-foreground/70">
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <CheckCircle className="h-5 w-5 text-foreground animate-pulse" />
                )}
              </motion.div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              size="lg" 
              disabled={!file || isProcessing} 
              onClick={processNotes}
              className="w-full sm:w-auto min-w-[140px]"
            >
              {isProcessing ? "Processing..." : "Process Notes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
