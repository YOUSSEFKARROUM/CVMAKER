import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Mail, Lock, User, Check, AlertCircle, LayoutTemplate, FileDown, Gift } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { fadeIn, fadeInUp, scaleIn } from '../styles/design-system';
import { LogoIcon } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

function getPasswordStrength(password: string) {
  if (!password) return 0;
  let s = 0;
  if (password.length >= 6)           s++;
  if (password.length >= 10)          s++;
  if (/[A-Z]/.test(password))        s++;
  if (/[0-9]/.test(password))        s++;
  if (/[^A-Za-z0-9]/.test(password)) s++;
  return s;
}
// Level 1=destructive, 2=warning, 3=info, 4–5=success
const strengthColors = ['bg-destructive', 'bg-warning', 'bg-info', 'bg-success', 'bg-success'];
const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];

const FEATURES = [
  { icon: LayoutTemplate, label: '19 templates', sub: 'Designs professionnels' },
  { icon: FileDown,       label: 'Export PDF',   sub: 'Haute qualité' },
  { icon: Gift,           label: '100% Gratuit', sub: 'Sans frais cachés' },
];

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { t } = useTranslation();
  const { login, register, forgotPassword, error, clearError, authLoading, isAuthAvailable } = useAuth();

  const [mode, setMode]               = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData]       = useState({ email: '', password: '', displayName: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched]         = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '', displayName: '' });
      setFieldErrors({});
      setTouched({});
      clearError();
    }
  }, [isOpen, clearError]);

  useEffect(() => {
    const errors: Record<string, string> = {};
    if (touched.email) {
      if (!formData.email)                                            errors.email = t('validation.required');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))  errors.email = t('validation.email');
    }
    if (touched.password && mode !== 'forgot') {
      if (!formData.password)                  errors.password = t('validation.required');
      else if (formData.password.length < 6)   errors.password = t('validation.minLength', { count: 6 });
    }
    if (touched.displayName && mode === 'register') {
      if (!formData.displayName)                 errors.displayName = t('validation.required');
      else if (formData.displayName.length < 2)  errors.displayName = t('validation.minLength', { count: 2 });
    }
    setFieldErrors(errors);
  }, [formData, touched, mode, t]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setTouched({ email: true, password: true, displayName: true });
    if (Object.keys(fieldErrors).length > 0) return;
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        onSuccess?.(); onClose();
      } else if (mode === 'register') {
        await register(formData.email, formData.password, formData.displayName);
        onSuccess?.(); onClose();
      } else if (mode === 'forgot') {
        await forgotPassword(formData.email);
        setMode('login');
      }
    } catch { /* handled by useAuth */ }
  };

  const switchMode = (m: AuthMode) => {
    setMode(m); clearError(); setFieldErrors({}); setTouched({});
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[860px] bg-card border border-border rounded-xl shadow-overlay overflow-hidden flex"
      >
        {/* ── Left panel ───────────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:w-[320px] flex-col justify-between p-8 auth-panel-bg text-white flex-shrink-0 relative overflow-hidden">
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -top-24 -left-16 w-64 h-64 rounded-full bg-blue/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 w-48 h-48 rounded-full bg-blue/8 blur-2xl" />
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

          <div className="relative z-10">
            <div className="w-11 h-11 rounded-xl bg-blue flex items-center justify-center text-blue-foreground mb-6 shadow-cta">
              <LogoIcon className="text-blue-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">
              <span className="font-extrabold">cv</span>
              <span className="font-light">maker</span>
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Créez votre CV professionnel en quelques minutes
            </p>
          </div>

          <div className="relative z-10 space-y-2.5">
            {FEATURES.map(f => (
              <div key={f.label} className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.09] backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-blue/20 border border-blue/20 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-blue" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none mb-0.5">{f.label}</p>
                  <p className="text-xs text-white/45">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="relative z-10 text-white/20 text-xs">© 2026 cvmaker</p>
        </div>

        {/* ── Right panel — form ────────────────────────────────────────── */}
        <div className="flex-1 p-8 lg:p-10 relative min-w-0">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ── Tabs: Login / Register ────────────────────────────────── */}
          {mode !== 'forgot' && (
            <div className="flex border-b border-border -mx-8 lg:-mx-10 px-8 lg:px-10 mb-6">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`pb-3 mr-6 text-sm font-medium border-b-2 -mb-px transition-colors duration-150 ${
                  mode === 'login'
                    ? 'border-blue text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('auth.loginTitle')}
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors duration-150 ${
                  mode === 'register'
                    ? 'border-blue text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('auth.registerTitle')}
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Subtitle / forgot header */}
              <div className="mb-6">
                {mode === 'forgot' && (
                  <>
                    <h2 className="text-xl font-semibold text-foreground tracking-tight mb-1">
                      {t('auth.forgotTitle')}
                    </h2>
                    <p className="text-sm text-muted-foreground">{t('auth.forgotSubtitle')}</p>
                  </>
                )}
                {mode !== 'forgot' && (
                  <p className="text-sm text-muted-foreground">
                    {mode === 'login' ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Display name (register only) */}
                {mode === 'register' && (
                  <FormField
                    label={t('auth.displayName')}
                    error={touched.displayName && fieldErrors.displayName ? fieldErrors.displayName : undefined}
                    isValid={!fieldErrors.displayName && !!touched.displayName && !!formData.displayName}
                    required
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        type="text"
                        aria-label={t('auth.displayName')}
                        value={formData.displayName}
                        onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                        onBlur={() => setTouched({ ...touched, displayName: true })}
                        className="pl-9"
                        placeholder={t('auth.displayNamePlaceholder')}
                      />
                      {formData.displayName && !fieldErrors.displayName && touched.displayName && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-success" />
                      )}
                    </div>
                  </FormField>
                )}

                {/* Email */}
                <FormField
                  label={t('auth.email')}
                  error={touched.email && fieldErrors.email ? fieldErrors.email : undefined}
                  isValid={!fieldErrors.email && !!touched.email && !!formData.email}
                  required
                >
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="email"
                      aria-label={t('auth.email')}
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      onBlur={() => setTouched({ ...touched, email: true })}
                      className="pl-9"
                      placeholder="email@exemple.com"
                    />
                    {formData.email && !fieldErrors.email && touched.email && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-success" />
                    )}
                  </div>
                </FormField>

                {/* Password */}
                {mode !== 'forgot' && (
                  <div>
                    <FormField
                      label={t('auth.password')}
                      error={touched.password && fieldErrors.password ? fieldErrors.password : undefined}
                      isValid={!fieldErrors.password && !!touched.password && !!formData.password}
                      required
                    >
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          aria-label={t('auth.password')}
                          value={formData.password}
                          onChange={e => setFormData({ ...formData, password: e.target.value })}
                          onBlur={() => setTouched({ ...touched, password: true })}
                          className="pl-9 pr-9"
                          placeholder={t('auth.passwordPlaceholder')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Strength bar (register only) */}
                      {mode === 'register' && formData.password && (
                        <div className="space-y-1 pt-1">
                          <div className="flex gap-1 h-1">
                            {[1,2,3,4,5].map(l => (
                              <div
                                key={l}
                                className={`flex-1 rounded-full transition-colors duration-200 ${
                                  l <= passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-border'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Force :{' '}
                            <span className={
                              passwordStrength >= 4 ? 'text-success'
                              : passwordStrength === 3 ? 'text-info'
                              : passwordStrength === 2 ? 'text-warning'
                              : 'text-destructive'
                            }>
                              {strengthLabels[passwordStrength - 1] ?? 'Très faible'}
                            </span>
                          </p>
                        </div>
                      )}
                    </FormField>
                    {/* Mot de passe oublié — aligné à droite, visible uniquement en mode login */}
                    {mode === 'login' && (
                      <div className="flex justify-end mt-1.5">
                        <button
                          type="button"
                          onClick={() => switchMode('forgot')}
                          className="text-xs text-blue hover:text-blue/80 hover:underline underline-offset-4 transition-colors focus-visible:outline-none"
                        >
                          {t('auth.forgotLink')}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Auth unavailable warning */}
                {!isAuthAvailable && (
                  <InfoBox variant="warning">
                    L'authentification n'est pas configurée. Vous pouvez utiliser l'application sans compte.
                  </InfoBox>
                )}

                {/* Global error */}
                {error && (
                  <InfoBox variant="error">{error.message}</InfoBox>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  variant="blue"
                  size="lg"
                  disabled={authLoading || !isAuthAvailable}
                  className="w-full mt-1"
                >
                  {authLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      {mode === 'login'    && t('auth.loginButton')}
                      {mode === 'register' && t('auth.registerButton')}
                      {mode === 'forgot'   && t('auth.resetButton')}
                    </>
                  )}
                </Button>
              </form>

              {/* Mode switchers */}
              <div className="mt-5 text-center space-y-2 text-sm">
                {mode === 'login' && (
                  <p className="text-muted-foreground">
                    {t('auth.noAccount')}{' '}
                    <ModeLink onClick={() => switchMode('register')}>{t('auth.registerLink')}</ModeLink>
                  </p>
                )}
                {mode === 'register' && (
                  <p className="text-muted-foreground">
                    {t('auth.hasAccount')}{' '}
                    <ModeLink onClick={() => switchMode('login')}>{t('auth.loginLink')}</ModeLink>
                  </p>
                )}
                {mode === 'forgot' && (
                  <p>
                    <ModeLink onClick={() => switchMode('login')}>{t('auth.backToLogin')}</ModeLink>
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function InfoBox({ children, variant }: { children: React.ReactNode; variant: 'warning' | 'error' }) {
  const styles = variant === 'error'
    ? 'bg-destructive/8 border-destructive/30 text-destructive'
    : 'bg-warning/10 border-warning/30 text-warning';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className={`flex items-center gap-2.5 p-3 rounded-lg border text-sm ${styles}`}
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      {children}
    </motion.div>
  );
}

function ModeLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-medium text-blue hover:text-blue/80 hover:underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
    >
      {children}
    </button>
  );
}
