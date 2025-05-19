
'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/image-uploader';
import { PoemDisplay } from '@/components/poem-display';
import { SnapVerseHeader } from '@/components/snapverse-header';
import { imageToPoem, type ImageToPoemInput } from '@/ai/flows/image-to-poem';
import { Spinner } from '@/components/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Wand2, Image as ImageIcon } from 'lucide-react'; // Changed ImageIcon to Image and imported

export default function HomePage() {
  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null);
  const [poem, setPoem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageReady = async (dataUri: string, previewUrl: string) => {
    setPoem(null);
    setError(null);
    setIsLoading(true);
    setDisplayImageUrl(previewUrl); // Show image while poem generates

    try {
      const input: ImageToPoemInput = { photoDataUri: dataUri };
      const result = await imageToPoem(input);
      setPoem(result.poem);
    } catch (e) {
      console.error('Poem generation error:', e);
      setError('Failed to generate poem. The image might be too complex or an unexpected error occurred. Please try a different image or URL.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <SnapVerseHeader />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Wand2 className="mx-auto h-12 w-12 text-accent mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary-foreground/90">
              SnapVerse
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
              Transform your photos into beautiful, AI-generated poetry. Upload an image and let creativity flow!
            </p>
          </div>

          <ImageUploader 
            onImageReady={handleImageReady} 
            isGeneratingPoem={isLoading}
            clearGlobalError={() => setError(null)}
          />

          {isLoading && (
            <div className="flex flex-col items-center justify-center mt-10 text-center">
              <Spinner size={48} />
              <p className="mt-3 text-muted-foreground animate-pulse">Crafting your masterpiece... this may take a moment.</p>
            </div>
          )}

          {error && !isLoading && (
            <Alert variant="destructive" className="mt-8 shadow-md rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Oops! Something went wrong.</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {displayImageUrl && poem && !isLoading && !error && (
            <PoemDisplay imageUrl={displayImageUrl} poem={poem} />
          )}
          
          {!displayImageUrl && !isLoading && !error && (
            <div className="mt-12 text-center text-muted-foreground p-6 border-2 border-dashed border-border rounded-xl">
              <ImageIcon className="mx-auto h-10 w-10 mb-3" /> {/* Used imported Image icon */}
              <p className="text-lg font-medium">Your poem will appear here</p>
              <p className="text-sm">Upload an image to see the magic happen!</p>
            </div>
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        © {new Date().getFullYear()} SnapVerse. Create By Seth.
      </footer>
    </div>
  );
}
