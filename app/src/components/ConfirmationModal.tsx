import { Button } from '@/components/ui/button';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({ message, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">Supprimer la saisie</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={onConfirm} className="bg-[#2196F3] hover:bg-[#1976D2]">
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}
