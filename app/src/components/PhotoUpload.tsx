import { useState, useRef, useCallback } from 'react';
import { Upload, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processPhotoUpload, createCircularImage } from '../utils/photoUpload';
import { useToast } from '../hooks/useToast';

interface PhotoUploadProps {
  photo?: string;
  onPhotoChange: (photo: string | undefined) => void;
  firstName: string;
  lastName: string;
}

export function PhotoUpload({ photo, onPhotoChange, firstName, lastName }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const getInitials = () => {
    if (!firstName || !lastName) return '?';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      try {
        const result = await processPhotoUpload(file);
        const circularImage = await createCircularImage(result.dataUrl, 200);
        onPhotoChange(circularImage);
        success('Photo téléchargée avec succès');
      } catch (err) {
        error(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
      } finally {
        setIsProcessing(false);
      }
    },
    [onPhotoChange, success, error]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    onPhotoChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-24 h-24 rounded-full overflow-hidden cursor-pointer transition-all ${
          isDragging
            ? 'ring-4 ring-[#2196F3] ring-offset-2'
            : 'hover:ring-2 hover:ring-[#2196F3] hover:ring-offset-2'
        } ${photo ? '' : 'bg-gray-200'}`}
      >
        {photo ? (
          <img
            src={photo}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-400">{getInitials()}</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Upload className="w-6 h-6 text-white" />
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Remove button */}
        {photo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="mt-2 text-center">
        <p className="text-sm text-gray-500">Télécharger une photo</p>
        <p className="text-xs text-purple-600 mt-1">
          <Sparkles className="w-3 h-3 inline mr-1" />
          IA disponible
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="mt-2 text-xs"
      >
        <Upload className="w-3 h-3 mr-1" />
        Choisir un fichier
      </Button>
    </div>
  );
}
