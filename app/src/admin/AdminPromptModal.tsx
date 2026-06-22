import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminPromptModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  description: string;
  placeholder: string;
  confirmLabel: string;
  confirmVariant?: 'destructive' | 'default' | 'blue';
  required?: boolean;
}

export default function AdminPromptModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  placeholder,
  confirmLabel,
  confirmVariant = 'default',
  required = false,
}: AdminPromptModalProps) {
  const [value, setValue] = useState('');

  function handleConfirm() {
    if (required && !value.trim()) return;
    onConfirm(value.trim());
    setValue('');
    onClose();
  }

  function handleClose() {
    setValue('');
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </DialogHeader>
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); }}
        />
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={required && !value.trim()}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
