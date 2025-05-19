'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

interface PoemDisplayProps {
  imageUrl: string;
  poem: string;
}

export function PoemDisplay({ imageUrl, poem }: PoemDisplayProps) {
  const { toast } = useToast();
  const poemRef = React.useRef<HTMLDivElement>(null);

  const handleCopyPoem = async () => {
    try {
      await navigator.clipboard.writeText(poem);
      toast({
        title: 'Poem Copied!',
        description: 'The poem has been copied to your clipboard.',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: 'Could not copy the poem. Please try again.',
      });
    }
  };

  const handleDownloadImage = () => {
    // This will attempt to trigger a download. For data URIs or blob URLs, it works well.
    // For external URLs, it might open in a new tab depending on browser/server CORS settings.
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'snapverse-image.png'; // Suggest a filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
     toast({
        title: 'Image Download Started',
        description: 'Your image should start downloading shortly.',
      });
  };

  return (
    <Card className="mt-8 shadow-xl rounded-xl overflow-hidden animate-fadeIn opacity-0">
      <CardHeader className="bg-muted/30 p-4 border-b">
        <CardTitle className="text-xl font-semibold">Your SnapVerse Creation</CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid md:grid-cols-2 gap-6 items-start">
        <div className="relative aspect-square w-full max-w-md mx-auto md:max-w-full rounded-lg overflow-hidden shadow-md border">
          <Image
            src={imageUrl}
            alt="Uploaded image for poem generation"
            layout="fill"
            objectFit="contain"
            className="bg-gray-100"
            data-ai-hint="creative abstract"
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-primary-foreground/90">Generated Poem:</h3>
          <div ref={poemRef} className="p-4 bg-primary/20 rounded-md min-h-[200px] whitespace-pre-wrap text-foreground leading-relaxed font-mono text-sm shadow-inner">
            {poem}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button onClick={handleCopyPoem} variant="outline" className="w-full sm:w-auto">
              <Copy className="mr-2 h-4 w-4" /> Copy Poem
            </Button>
            <Button onClick={handleDownloadImage} variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> Download Image
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
