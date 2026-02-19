import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WarningModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function WarningModal({ 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Je n'ai pas d'expérience professionnelle",
  cancelText = 'Ok'
}: WarningModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden max-w-md w-full mx-4">
        <div className="bg-[#2196F3] p-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">D'autres informations requises</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={onConfirm}
              className="w-full"
            >
              {confirmText}
            </Button>
            <Button 
              onClick={onCancel} 
              className="w-full bg-[#2196F3] hover:bg-[#1976D2]"
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
