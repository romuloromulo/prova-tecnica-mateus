import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { registerSchema, type RegisterFormData } from './authValidation';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  // Formatação automática simples para telefone brasileiro (ex: 98 98888-7777)
  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 2) return raw;
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
  };

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    const nextValue = field === 'phone' ? formatPhone(value) : value;
    setFormData((prev) => ({ ...prev, [field]: nextValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterFormData;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.register(result.data);
      setAuth(res.user, res.token);
      setSuccessToast(true);
      setTimeout(() => {
        onSuccess?.();
      }, 900);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Houve um contratempo ao registrar sua conta. Por favor, tente novamente.';
      setGeneralError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {successToast && (
        <div
          role="status"
          className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-sm font-bold animate-fadeIn"
        >
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Conta criada com carinho! Bem-vindo à nossa família!</span>
        </div>
      )}

      {generalError && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs sm:text-sm font-medium"
        >
          <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Destaque Acolhedor do Caderninho */}
      <div className="p-3 rounded-xl bg-mateus-blue-50/70 border border-mateus-blue-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white p-1 shrink-0 shadow-xs flex items-center justify-center">
          <img
            src="/mascote/dentinho-ola.svg"
            alt="Mascote Dentinho"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-xs text-mateus-blue-900 font-medium leading-relaxed">
          <strong>Cadastro Simples & Amigo:</strong> Ao se cadastrar, você já garante <strong>R$ 250 de crédito inicial</strong> no Caderninho Digital de confiança do Seu Osvaldo!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Nome Completo */}
        <div className="space-y-1">
          <label htmlFor="reg-name" className="block text-xs sm:text-sm font-bold text-slate-700">
            Seu Nome Completo
          </label>
          <div className="relative">
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="ex: Marta Maria dos Santos"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'reg-name-error' : undefined}
              className={`w-full px-4 py-2.5 pl-11 rounded-xl text-sm font-medium bg-slate-50 border-2 transition focus:outline-none focus:bg-white ${
                errors.name
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-slate-200 focus:border-mateus-blue'
              }`}
            />
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {errors.name && (
            <p id="reg-name-error" className="text-xs font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle size={13} /> {errors.name}
            </p>
          )}
        </div>

        {/* E-mail */}
        <div className="space-y-1">
          <label htmlFor="reg-email" className="block text-xs sm:text-sm font-bold text-slate-700">
            E-mail para Recibos
          </label>
          <div className="relative">
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="ex: marta@exemplo.com.br"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'reg-email-error' : undefined}
              className={`w-full px-4 py-2.5 pl-11 rounded-xl text-sm font-medium bg-slate-50 border-2 transition focus:outline-none focus:bg-white ${
                errors.email
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-slate-200 focus:border-mateus-blue'
              }`}
            />
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {errors.email && (
            <p id="reg-email-error" className="text-xs font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle size={13} /> {errors.email}
            </p>
          )}
        </div>

        {/* Telefone / WhatsApp */}
        <div className="space-y-1">
          <label htmlFor="reg-phone" className="block text-xs sm:text-sm font-bold text-slate-700">
            Telefone ou WhatsApp
          </label>
          <div className="relative">
            <input
              id="reg-phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(98) 98888-7777"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
              className={`w-full px-4 py-2.5 pl-11 rounded-xl text-sm font-medium bg-slate-50 border-2 transition focus:outline-none focus:bg-white ${
                errors.phone
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-slate-200 focus:border-mateus-blue'
              }`}
            />
            <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {errors.phone && (
            <p id="reg-phone-error" className="text-xs font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle size={13} /> {errors.phone}
            </p>
          )}
        </div>

        {/* Senha e Confirmação de Senha */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="reg-password" className="block text-xs sm:text-sm font-bold text-slate-700">
              Crie sua Senha
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Mín. 6 letras/números"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'reg-password-error' : undefined}
                className={`w-full px-4 py-2.5 pl-10 pr-10 rounded-xl text-sm font-medium bg-slate-50 border-2 transition focus:outline-none focus:bg-white ${
                  errors.password
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-slate-200 focus:border-mateus-blue'
                }`}
              />
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p id="reg-password-error" className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-confirm-password" className="block text-xs sm:text-sm font-bold text-slate-700">
              Confirme a Senha
            </label>
            <div className="relative">
              <input
                id="reg-confirm-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Repita a mesma senha"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'reg-confirm-error' : undefined}
                className={`w-full px-4 py-2.5 pl-10 rounded-xl text-sm font-medium bg-slate-50 border-2 transition focus:outline-none focus:bg-white ${
                  errors.confirmPassword
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-slate-200 focus:border-mateus-blue'
                }`}
              />
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            {errors.confirmPassword && (
              <p id="reg-confirm-error" className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
          <span>Seus dados são protegidos com respeito e confidencialidade.</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-mateus-red hover:bg-mateus-red-hover text-white font-extrabold text-sm sm:text-base shadow-heart transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Preparando sua conta...</span>
            </span>
          ) : (
            <>
              <UserPlus size={18} />
              <span>Criar Minha Conta Grátis</span>
            </>
          )}
        </button>
      </form>

      <div className="pt-3 border-t border-slate-100 text-center">
        <p className="text-xs sm:text-sm text-slate-600">
          Já possui cadastro?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-mateus-blue hover:text-mateus-red transition underline underline-offset-4"
          >
            Fazer login agora
          </button>
        </p>
      </div>
    </div>
  );
};
