import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Plus, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';

export default function DashboardPage() {
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data } = await api.get('/documents');
        // Get the top 3 most recent
        setRecentDocs(data.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch documents", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-foreground/70">Here's an overview of your recent documents and activity.</p>
        </div>
        <Link to="/dashboard/upload">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Upload New
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recentDocs.length > 0 ? (
          <Link to={`/dashboard/workspace/${recentDocs[0]._id}`}>
            <Card className="hover:border-foreground/50 transition-colors cursor-pointer bg-foreground/5 border-border h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[160px]">
                <div className="p-3 bg-background rounded-full border border-border shadow-sm">
                  <Clock className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Resume Last Session</h3>
                  <p className="text-sm text-foreground/70 line-clamp-1">{recentDocs[0].fileName}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ) : (
          <Card className="bg-foreground/5 border-border h-full flex items-center justify-center min-h-[160px]">
            <p className="text-sm text-foreground/50">No recent documents</p>
          </Card>
        )}
        <Link to="/dashboard/upload">
          <Card className="hover:border-foreground/50 transition-colors cursor-pointer border-dashed h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[160px]">
              <div className="p-3 bg-border/50 rounded-full">
                <Plus className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="font-semibold">Upload New Document</h3>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-semibold">Recent Documents</h2>
        {loading ? (
          <p className="text-sm text-foreground/50">Loading...</p>
        ) : recentDocs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentDocs.map((doc, i) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/dashboard/workspace/${doc._id}`}>
                  <Card className="hover:border-foreground/50 transition-colors cursor-pointer h-full">
                    <CardContent className="p-5 flex items-start space-x-4">
                      <div className="p-2 bg-border/50 rounded-lg shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <p className="font-medium leading-tight line-clamp-2">{doc.fileName}</p>
                        <p className="text-xs text-foreground/50">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground/50">No documents uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
