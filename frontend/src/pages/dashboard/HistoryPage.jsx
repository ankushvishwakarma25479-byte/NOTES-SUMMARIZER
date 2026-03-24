import React, { useEffect, useState } from 'react';
import { FileText, Search, Filter, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents');
      setDocuments(data.data);
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.delete(`/documents/${id}`);
      toast.success('Document deleted');
      setDocuments(documents.filter(doc => doc._id !== id));
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document History</h1>
          <p className="text-foreground/70">View and manage all your previously uploaded files.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/50" />
          <Input 
            placeholder="Search documents..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading documents...</p>
      ) : filteredDocs.length === 0 ? (
        <p className="text-sm text-foreground/50 mt-4">No documents found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
          {filteredDocs.map((doc) => (
            <Link key={doc._id} to={`/dashboard/workspace/${doc._id}`}>
              <Card className="hover:border-foreground/50 transition-colors cursor-pointer h-full relative group">
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-border/50 rounded-lg">
                      <FileText className="h-6 w-6 text-foreground/80" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md border border-border">
                      {doc.fileType}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold line-clamp-2 leading-tight mb-2 pr-6">{doc.fileName}</h3>
                    <div className="flex items-center justify-between text-xs text-foreground/50 gap-2">
                      <span className="truncate">{new Date(doc.uploadedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <div 
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDelete(e, doc._id)}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
