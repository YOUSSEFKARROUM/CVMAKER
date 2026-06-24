import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDownloadRequest } from '../hooks/useDownloadRequest';
import { useToast } from '../hooks/useToast';
import { Button } from './ui/button';
import {
  Copy, Check, Send, CreditCard, MessageCircle,
  ArrowRight, Sparkles, Clock,
} from 'lucide-react';

interface PaymentInstructionsProps {
  cvName: string;
  templateUsed: string;
  onRequestSent: () => void;
}

const PAYMENT_INFO = {
  holder: 'YOUSSEF AIT KARROUM',
  rib: '230 090 7001966211004800 74',
  iban: 'MA64 2300 9070 0196 6211 0048 0074',
  swift: 'CIHMMAMC',
  bank: 'CIH Bank',
  whatsapp: '+212691719109',
  price: '30',
  currency: 'DH',
  quota: 4,
} as const;

export default function PaymentInstructions({ cvName, templateUsed, onRequestSent }: PaymentInstructionsProps) {
  const { t } = useTranslation();
  const { requestDownload } = useDownloadRequest();
  const { success } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function copyToClipboard(text: string, field: string) {
    await navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopiedField(field);
    success(t('payment.copied', 'Copié !'));
    setTimeout(() => setCopiedField(null), 2000);
  }

  async function handleSendRequest() {
    setSending(true);
    try {
      await requestDownload(cvName, templateUsed);
      onRequestSent();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message === 'ALREADY_PENDING') {
        onRequestSent();
      }
    } finally {
      setSending(false);
    }
  }

  function openWhatsApp() {
    const message = encodeURIComponent(
      `Bonjour, je viens d'effectuer le paiement de ${PAYMENT_INFO.price} ${PAYMENT_INFO.currency} pour l'accès PDF sur CV Maker.\n\n` +
      `Email du compte : (votre email)\n` +
      `Merci de valider mon accès.`
    );
    window.open(`https://wa.me/${PAYMENT_INFO.whatsapp.replace(/\+/g, '')}?text=${message}`, '_blank');
  }

  return (
    <div className="space-y-5">
      {/* Header prix */}
      <div className="text-center py-4 px-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5
                      border border-blue-500/20">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-blue-600">
            {t('payment.offer', 'Offre de lancement')}
          </span>
        </div>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-foreground">{PAYMENT_INFO.price}</span>
          <span className="text-lg text-muted-foreground">{PAYMENT_INFO.currency}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t('payment.quota', 'Accès à {{count}} téléchargements PDF', { count: PAYMENT_INFO.quota })}
        </p>
      </div>

      {/* Étapes */}
      <div className="space-y-4">
        {/* Étape 1 — Virement */}
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <StepBadge>1</StepBadge>
            <h3 className="text-sm font-semibold text-foreground">
              {t('payment.step1', 'Effectuez le virement bancaire')}
            </h3>
          </div>
          <div className="space-y-2.5 ml-8">
            <InfoRow label={t('payment.holder', 'Titulaire')} value={PAYMENT_INFO.holder}
              onCopy={() => copyToClipboard(PAYMENT_INFO.holder, 'holder')} copied={copiedField === 'holder'} />
            <InfoRow label={t('payment.bank', 'Banque')} value={PAYMENT_INFO.bank} copyable={false} />
            <InfoRow label="RIB" value={PAYMENT_INFO.rib} mono
              onCopy={() => copyToClipboard(PAYMENT_INFO.rib, 'rib')} copied={copiedField === 'rib'} />
            <InfoRow label="IBAN" value={PAYMENT_INFO.iban} mono
              onCopy={() => copyToClipboard(PAYMENT_INFO.iban, 'iban')} copied={copiedField === 'iban'} />
            <InfoRow label="Code SWIFT" value={PAYMENT_INFO.swift} mono
              onCopy={() => copyToClipboard(PAYMENT_INFO.swift, 'swift')} copied={copiedField === 'swift'} />
            <InfoRow label={t('payment.amount', 'Montant')} value={`${PAYMENT_INFO.price} ${PAYMENT_INFO.currency}`}
              copyable={false} highlight />
          </div>
        </div>

        {/* Étape 2 — WhatsApp */}
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <StepBadge>2</StepBadge>
            <h3 className="text-sm font-semibold text-foreground">
              {t('payment.step2', 'Envoyez la preuve de paiement')}
            </h3>
          </div>
          <div className="ml-8 space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('payment.step2Desc', 'Envoyez le reçu de virement par WhatsApp pour une activation rapide.')}
            </p>
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-2 px-4 py-3
                         rounded-xl bg-[#25D366] hover:bg-[#22c55e] text-white
                         font-medium text-sm transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              {t('payment.whatsapp', 'Envoyer sur WhatsApp')}
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-muted-foreground text-center">{PAYMENT_INFO.whatsapp}</p>
          </div>
        </div>

        {/* Étape 3 — Confirmer */}
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <StepBadge>3</StepBadge>
            <h3 className="text-sm font-semibold text-foreground">
              {t('payment.step3', 'Confirmez votre demande')}
            </h3>
          </div>
          <div className="ml-8 space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('payment.step3Desc', "Cliquez ci-dessous pour que l'admin soit notifié. Votre accès sera activé sous 24h.")}
            </p>
            <Button variant="blue" className="w-full gap-2" size="lg"
                    onClick={handleSendRequest} disabled={sending}>
              {sending ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {t('payment.confirm', "J'ai effectué le paiement")}
            </Button>
          </div>
        </div>
      </div>

      {/* Note de confiance */}
      <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
        <CreditCard className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          {t('payment.note',
            "Paiement sécurisé par virement bancaire. Votre accès sera activé manuellement après vérification du paiement. Vous pourrez télécharger jusqu'à {{count}} CVs en PDF.",
            { count: PAYMENT_INFO.quota }
          )}
        </p>
      </div>
    </div>
  );
}

function StepBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
      {children}
    </div>
  );
}

function InfoRow({ label, value, onCopy, copied, mono, copyable = true, highlight }: {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
  mono?: boolean;
  copyable?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg
                     ${highlight ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-muted/30'}`}>
      <div className="min-w-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <p className={`text-sm font-medium text-foreground truncate
                       ${mono ? 'font-mono tracking-wide' : ''}
                       ${highlight ? 'text-blue-600 text-base' : ''}`}>
          {value}
        </p>
      </div>
      {copyable && onCopy && (
        <button onClick={onCopy}
                className="shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors"
                title="Copier">
          {copied
            ? <Check className="w-4 h-4 text-green-500" />
            : <Copy className="w-4 h-4 text-muted-foreground" />
          }
        </button>
      )}
    </div>
  );
}
