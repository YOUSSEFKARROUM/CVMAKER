import { useState } from 'react';
import { Sparkles, Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface AISuggestionButtonProps {
  onSuggest: () => Promise<string[]>;
  onApply: (suggestion: string) => void;
  buttonText?: string;
  dialogTitle?: string;
}

export function AISuggestionButton({
  onSuggest,
  onApply,
  buttonText = 'Perfectionner avec l\'IA',
  dialogTitle = 'Suggestions IA',
}: AISuggestionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleClick = async () => {
    setIsLoading(true);
    setIsOpen(true);
    try {
      const results = await onSuggest();
      setSuggestions(results);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (suggestion: string) => {
    onApply(suggestion);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className="mt-2 text-purple-600 border-purple-300 bg-purple-50/50 hover:bg-purple-100 hover:border-purple-400 font-medium"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4 mr-2" />
        )}
        {buttonText}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-600" />
              {dialogTitle}
            </DialogTitle>
            <DialogDescription>
              Voici quelques suggestions générées par notre IA. Cliquez sur celle qui vous convient le mieux.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
                <p className="text-gray-500">Génération des suggestions...</p>
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleApply(suggestion)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
