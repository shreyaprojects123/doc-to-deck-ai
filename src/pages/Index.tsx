import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, FileText, Download, Wand2, Link, Upload, Sparkles } from 'lucide-react';
import { SlideCarousel } from '@/components/SlideCarousel';
import { generateSlides } from '@/lib/slideGenerator';
import { exportToPDF } from '@/lib/pdfExporter';
import { fetchContentFromUrl } from '@/lib/contentFetcher';
import { useToast } from '@/hooks/use-toast';
import { exportToPPTX } from "@/lib/pptxExporter";

export interface Slide {
  id: number;
  title: string;
  bullets: string[];
  type: 'cover' | 'content';
  visual?: string | null;
  visualDescription?: string | null;
  source?: string | null;
}

const themes = {
  professional: {
    name: 'Professional Blue',
    primary: 'bg-blue-900',
    secondary: 'bg-blue-50',
    accent: 'bg-blue-600',
    text: 'text-white',
    textSecondary: 'text-blue-900'
  },
  dark: {
    name: 'Dark Executive',
    primary: 'bg-gray-900',
    secondary: 'bg-gray-100',
    accent: 'bg-purple-600',
    text: 'text-white',
    textSecondary: 'text-gray-900'
  },
  vibrant: {
    name: 'Vibrant Creative',
    primary: 'bg-gradient-to-br from-orange-500 to-pink-500',
    secondary: 'bg-orange-50',
    accent: 'bg-orange-500',
    text: 'text-white',
    textSecondary: 'text-orange-900'
  }
};

const Index = () => {
  const [inputText, setInputText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>('professional');
  const { toast } = useToast();

  const handleFetchFromUrl = async () => {
    if (!urlInput.trim()) {
      toast({
        title: "Please enter a URL",
        description: "Add a Google Docs link or article URL",
        variant: "destructive"
      });
      return;
    }

    setIsFetchingUrl(true);
    try {
      const content = await fetchContentFromUrl(urlInput);
      setInputText(content);
      setUrlInput('');
      toast({
        title: "Content Fetched!",
        description: "Successfully extracted text from the URL"
      });
    } catch (error) {
      console.error('Error fetching URL content:', error);
      toast({
        title: "Fetch Failed",
        description: error instanceof Error ? error.message : "Could not fetch content from this URL",
        variant: "destructive"
      });
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleGenerateSlides = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Please enter some text",
        description: "Add content to generate slides from",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedSlides = await generateSlides(inputText);
      setSlides(generatedSlides);
      toast({
        title: "Slides Generated!",
        description: `Created ${generatedSlides.length} slides successfully`
      });
    } catch (error) {
      console.error('Error generating slides:', error);
      toast({
        title: "Generation Failed",
        description: "Please check your API key and try again",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (slides.length === 0) return;
    exportToPDF(slides, themes[selectedTheme]);
    toast({
      title: "PDF Downloaded!",
      description: "Your slides have been exported to PDF"
    });
  };

  const handleReset = () => {
    setSlides([]);
    setInputText('');
    setUrlInput('');
    // Optionally reset theme or other state if desired
  };

  const currentTheme = themes[selectedTheme];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Text to Slides Generator
                </h1>
                <p className="text-slate-600 text-lg mt-1">Transform your content into professional presentations instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedTheme} onValueChange={(value: keyof typeof themes) => setSelectedTheme(value)} disabled={slides.length === 0}>
                <SelectTrigger className="w-52 h-11 border border-blue-200 bg-white text-blue-900 shadow-none focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(themes).map(([key, theme]) => (
                    <SelectItem key={key} value={key}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleExportPDF} 
                disabled={slides.length === 0}
                className="bg-green-600 hover:bg-green-700 h-11 px-6"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={() => exportToPPTX(slides, selectedTheme)}
                disabled={slides.length === 0}
                className="bg-blue-600 hover:bg-blue-700 h-11 px-6"
              >
                Export as PPTX
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Enhanced Input Section */}
          <div className="space-y-6">
            <Card className="p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-800">Your Content</h2>
                </div>
                
                <div className="space-y-6">
                  {/* URL Input Section */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      Import from URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Google Docs link or article URL..."
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <Button
                        onClick={handleFetchFromUrl}
                        disabled={isFetchingUrl || !urlInput.trim()}
                        variant="outline"
                        className="px-4 py-3 h-auto border-slate-200 hover:bg-blue-50"
                      >
                        {isFetchingUrl ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">Supports Google Docs and most article URLs</p>
                  </div>
                  
                  {/* Text Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Document Text</label>
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste your document, notes, or brief here... or use the URL import above"
                      className="min-h-[280px] resize-none border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateSlides}
                  disabled={isGenerating || !inputText.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Generating slides...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Slides
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Enhanced Preview Section */}
          <div className="space-y-6">
            {slides.length > 0 ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-0">
                <SlideCarousel
                  slides={slides}
                  theme={currentTheme}
                  onRegenerate={handleReset}
                />
              </div>
            ) : (
              <Card className="p-16 text-center border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-12 h-12 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-800 mb-2">Slide Preview</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Add your content using text input or URL import, then generate slides to see them here
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
