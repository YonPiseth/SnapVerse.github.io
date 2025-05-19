
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // Moved imports to top
import { UploadCloud, Link2, AlertCircle } from 'lucide-react';
import { fetchImageAsDataUrl } from '@/actions/fetch-image';
import { Spinner } from '@/components/loader';

interface ImageUploaderProps {
  onImageReady: (dataUri: string, previewUrl: string) => void;
  isGeneratingPoem: boolean;
  clearGlobalError: () => void;
}

export function ImageUploader({ onImageReady, isGeneratingPoem, clearGlobalError }: ImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInputValue, setUrlInputValue] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearGlobalError();
    setInternalError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setInternalError('Invalid file type. Please upload an image.');
        return;
      }
      // Max file size: 5MB
      if (file.size > 5 * 1024 * 1024) {
        setInternalError('File is too large. Maximum size is 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        const previewUrl = URL.createObjectURL(file);
        onImageReady(dataUri, previewUrl);
      };
      reader.onerror = () => {
        setInternalError('Failed to read the file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInputValue) {
      setInternalError('Please enter an image URL.');
      return;
    }
    clearGlobalError();
    setInternalError(null);
    setInternalLoading(true);
    try {
      const result = await fetchImageAsDataUrl(urlInputValue);
      if (result.success && result.dataUri) {
        onImageReady(result.dataUri, urlInputValue); // Use original URL for preview
      } else {
        setInternalError(result.error || 'Failed to fetch image from URL.');
      }
    } catch (e) {
      console.error(e);
      setInternalError('An unexpected error occurred while fetching the image.');
    } finally {
      setInternalLoading(false);
    }
  };
  
  const isLoading = isGeneratingPoem || internalLoading;

  return (
    <Card className="w-full shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-muted/50 p-4 border-b">
        <CardTitle className="text-lg font-medium">Upload Your Image</CardTitle>
        <CardDescription className="text-sm">Choose a file or paste an image URL to get started.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'url')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upload" disabled={isLoading}>
              <UploadCloud className="mr-2 h-4 w-4" /> Upload File
            </TabsTrigger>
            <TabsTrigger value="url" disabled={isLoading}>
              <Link2 className="mr-2 h-4 w-4" /> Paste URL
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="sr-only">Upload image</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground">Max file size: 5MB. Supported formats: JPG, PNG, GIF, WEBP.</p>
            </div>
          </TabsContent>
          <TabsContent value="url">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInputValue}
                  onChange={(e) => setUrlInputValue(e.target.value)}
                  disabled={isLoading}
                  aria-label="Image URL"
                />
                <Button onClick={handleUrlSubmit} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {internalLoading ? <Spinner size={16} className="mr-2" /> : <Link2 className="mr-2 h-4 w-4" />}
                  Load Image
                </Button>
              </div>
               <p className="text-xs text-muted-foreground">Enter a direct link to an image file.</p>
            </div>
          </TabsContent>
        </Tabs>
        {internalError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{internalError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
