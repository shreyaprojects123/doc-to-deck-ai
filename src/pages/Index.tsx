
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, FileText, Download, Wand2 } from 'lucide-react';
import { SlideCarousel } from '@/components/SlideCarousel';
import { generateSlides } from '@/lib/slideGenerator';
import { exportToPDF } from '@/lib/pdfExporter';
import { useToast } from '@/hooks/use-toast';

export interface Slide {
  id: number;
  title: string;
  bullets: string[];
  type: 'cover' | 'content';
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
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>('professional');
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleGenerateSlides = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Please enter some text",
        description: "Add content to generate slides from",
        variant: "destructive"
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedSlides = await generateSlides(inputText, apiKey);
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

  const currentTheme = themes[selectedTheme];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Snappy AI Slides
              </h1>
              <p className="text-gray-600 mt-1">Transform your docs into professional presentations</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedTheme} onValueChange={(value: keyof typeof themes) => setSelectedTheme(value)} disabled={slides.length === 0}>
                <SelectTrigger className="w-48">
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
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Your Content</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Your API key is stored locally and not sent to our servers</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Document Text</label>
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste your document, notes, or brief here..."
                      className="min-h-[300px] resize-none"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateSlides}
                  disabled={isGenerating || !inputText.trim() || !apiKey.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Generating slides...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Slides
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {slides.length > 0 ? (
              <SlideCarousel slides={slides} theme={currentTheme} />
            ) : (
              <Card className="p-12 text-center border-2 border-dashed border-gray-200">
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">No slides yet</h3>
                    <p className="text-gray-500">Add your content and generate slides to see them here</p>
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
