import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fadeIn, scaleIn, colors } from '../styles/design-system';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { t } = useTranslation();
  const { login, register, forgotPassword, error, clearError, authLoading, isAuthAvailable } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '', displayName: '' });
      setFieldErrors({});
      setTouched({});
      clearError();
    }
  }, [isOpen, clearError]);

  // Real-time validation
  useEffect(() => {
    const errors: Record<string, string> = {};
    
    if (touched.email) {
      if (!formData.email) {
        errors.email = t('validation.required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = t('validation.email');
      }
    }

    if (touched.password && mode !== 'forgot') {
      if (!formData.password) {
        errors.password = t('validation.required');
      } else if (formData.password.length < 6) {
        errors.password = t('validation.minLength', { count: 6 });
      }
    }

    if (touched.displayName && mode === 'register') {
      if (!formData.displayName) {
        errors.displayName = t('validation.required');
      } else if (formData.displayName.length < 2) {
        errors.displayName = t('validation.minLength', { count: 2 });
      }
    }

    setFieldErrors(errors);
  }, [formData, touched, mode, t]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Mark all fields as touched
    setTouched({ email: true, password: true, displayName: true });

    // Check for errors
    if (Object.keys(fieldErrors).length > 0) return;

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        onSuccess?.();
        onClose();
      } else if (mode === 'register') {
        await register(formData.email, formData.password, formData.displayName);
        onSuccess?.();
        onClose();
      } else if (mode === 'forgot') {
        await forgotPassword(formData.email);
        setMode('login');
      }
    } catch (err) {
      // Error handled by useAuth
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    clearError();
    setFieldErrors({});
    setTouched({});
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex"
      >
        {/* Left side - Visual */}
        <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-8 text-white overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ background: colors.gradient.primary }}
          />
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-6">
              <span className="text-2xl font-bold">CV</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">CV Maker</h3>
            <p className="text-white/80 text-sm">Créez votre CV professionnel en quelques minutes</p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">10+ Templates</p>
                <p className="text-white/70 text-xs">Designs professionnels</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Export PDF</p>
                <p className="text-white/70 text-xs">Haute qualité</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">100% Gratuit</p>
                <p className="text-white/70 text-xs">Sans frais cachés</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-white/60 text-xs">
            © 2026 CV Maker
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 p-8 lg:p-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {mode === 'login' && t('auth.loginTitle')}
                  {mode === 'register' && t('auth.registerTitle')}
                  {mode === 'forgot' && t('auth.forgotTitle')}
                </h2>
                <p className="text-slate-500 text-sm">
                  {mode === 'login' && t('auth.loginSubtitle')}
                  {mode === 'register' && t('auth.registerSubtitle')}
                  {mode === 'forgot' && t('auth.forgotSubtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-slate-700">
                      {t('auth.displayName')}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="displayName"
                        type="text"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        onBlur={() => setTouched({ ...touched, displayName: true })}
                        className={`pl-10 h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 ${
                          fieldErrors.displayName && touched.displayName ? 'border-red-300' : ''
                        }`}
                        placeholder={t('auth.displayNamePlaceholder')}
                      />
                      {formData.displayName && !fieldErrors.displayName && touched.displayName && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {fieldErrors.displayName && touched.displayName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.displayName}
                      </motion.p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    {t('auth.email')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onBlur={() => setTouched({ ...touched, email: true })}
                      className={`pl-10 h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 ${
                        fieldErrors.email && touched.email ? 'border-red-300' : ''
                      }`}
                      placeholder="email@exemple.com"
                    />
                    {formData.email && !fieldErrors.email && touched.email && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {fieldErrors.email && touched.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.email}
                    </motion.p>
                  )}
                </div>

                {mode !== 'forgot' && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700">
                      {t('auth.password')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onBlur={() => setTouched({ ...touched, password: true })}
                        className={`pl-10 pr-10 h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 ${
                          fieldErrors.password && touched.password ? 'border-red-300' : ''
                        }`}
                        placeholder={t('auth.passwordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password strength indicator */}
                    {mode === 'register' && formData.password && (
                      <div className="space-y-1">
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`flex-1 rounded-full transition-colors ${
                                level <= passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500">
                          Force: <span className={passwordStrength > 2 ? 'text-green-600' : 'text-orange-500'}>
                            {strengthLabels[passwordStrength - 1] || 'Très faible'}
                          </span>
                        </p>
                      </div>
                    )}
                    
                    {fieldErrors.password && touched.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.password}
                      </motion.p>
                    )}
                  </div>
                )}

                {!isAuthAvailable && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    L'authentification n'est pas configurée. Vous pouvez utiliser l'application sans compte.
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error.message}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={authLoading || !isAuthAvailable}
                  className="w-full h-12 rounded-xl text-base font-semibold"
                  style={{ background: colors.gradient.primary }}
                >
                  {authLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('common.loading')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {mode === 'login' && t('auth.loginButton')}
                      {mode === 'register' && t('auth.registerButton')}
                      {mode === 'forgot' && t('auth.resetButton')}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-3 text-sm">
                {mode === 'login' && (
                  <>
                    <p className="text-slate-500">
                      {t('auth.noAccount')}{' '}
                      <button
                        onClick={() => switchMode('register')}
                        className="font-semibold hover:underline"
                        style={{ color: colors.primary[600] }}
                      >
                        {t('auth.registerLink')}
                      </button>
                    </p>
                    <p>
                      <button
                        onClick={() => switchMode('forgot')}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {t('auth.forgotLink')}
                      </button>
                    </p>
                  </>
                )}

                {mode === 'register' && (
                  <p className="text-slate-500">
                    {t('auth.hasAccount')}{' '}
                    <button
                      onClick={() => switchMode('login')}
                      className="font-semibold hover:underline"
                      style={{ color: colors.primary[600] }}
                    >
                      {t('auth.loginLink')}
                    </button>
                  </p>
                )}

                {mode === 'forgot' && (
                  <p className="text-slate-500">
                    <button
                      onClick={() => switchMode('login')}
                      className="font-semibold hover:underline"
                      style={{ color: colors.primary[600] }}
                    >
                      {t('auth.backToLogin')}
                    </button>
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
