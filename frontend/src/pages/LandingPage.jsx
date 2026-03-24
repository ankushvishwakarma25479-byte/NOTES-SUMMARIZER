import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Brain, FileText, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      title: "AI Summarization",
      description: "Compress long notes into bite-sized summaries instantly.",
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: "Key Points Extraction",
      description: "Automatically identify and list the most important concepts.",
      icon: <Brain className="h-6 w-6" />
    },
    {
      title: "Q&A Chat",
      description: "Chat with your documents to find answers quickly.",
      icon: <MessageSquare className="h-6 w-6" />
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-8 py-24 text-center md:py-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-3xl"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
            Summarize Notes and <span className="text-foreground/70">Learn Faster</span> with AI
          </h1>
          <p className="max-w-[42rem] leading-normal sm:text-lg sm:leading-8 mx-auto text-foreground/70">
            Upload your documents and let AI extract key points, generate summaries, and answer your questions in real-time.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/auth">
            <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto">Get Started</Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">View Demo</Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-4 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-border/20 border border-border"
            >
              <div className="p-3 bg-background rounded-full border border-border text-foreground">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
