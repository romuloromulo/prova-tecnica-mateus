import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { loginSchema, type LoginFormData } from './authValidation';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const { setAuth, simulateLoginAsDonaMarta, simulateLoginAsPedro } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpa erro do campo ao digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Validação com Zod
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormData;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.login(result.data);
      setAuth(res.user, res.token);
      setSuccessToast(true);
      setTimeout(() => {
        onSuccess?.();
      }, 700);
    } catch {
      setGeneralError('Não conseguimos encontrar sua conta com esses dados. Confira o e-mail e a senha digitados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast de Sucesso */}
      {successToast && (
        <div
          role="status"
          className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-sm font-bold animate-fadeIn"
        >
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Login realizado com sucesso! Bem-vindo de volta!</span>
        </div>
      )}

      {/* Erro Geral */}
      {generalError && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs sm:text-sm font-medium"
        >
          <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Atalhos de Demonstração Rápida */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-mateus-sky-50 to-blue-50 border border-mateus-sky-200/80">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-mateus-blue mb-2">
          <Sparkles size={14} className="text-mateus-sky-500" />
          <span>Acesso Rápido para Avaliação do Desafio:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              simulateLoginAsDonaMarta();
              setSuccessToast(true);
              setTimeout(() => onSuccess?.(), 700);
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-mateus-blue-50 text-mateus-blue font-bold text-xs border border-mateus-sky-200 shadow-xs transition"
          >
            <span>👵 Entrar como Dona Marta</span>
          </button>

          <button
            type="button"
            onClick={() => {
              simulateLoginAsPedro();
              setSuccessToast(true);
              setTimeout(() => onSuccess?.(), 700);
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-mateus-blue-50 text-mateus-blue font-bold text-xs border border-mateus-sky-200 shadow-xs transition"
          >
            <span>📱 Entrar como Pedro</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Campo E-mail */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="block text-xs sm:text-sm font-bold text-slate-700"
          >
            E-mail cadastrado
          </label>
          <div className="relative">
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="ex: seu.nome@email.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              className={`w-full px-4 py-3 pl-11 rounded-xl text-sm font-medium bg-slate-50 border-2 transition focus:outline-none focus:bg-white ${
                errors.email
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-slate-200 focus:border-mateus-blue'
              }`}
            />
            <Mail
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
          {errors.email && (
            <p id="login-email-error" className="text-xs font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle size={13} /> {errors.email}
            </p>
          )}
        </div>

        {/* Campo Senha */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-xs sm:text-sm font-bold text-slate-700"
            >
              Sua senha
            </label>
            <button
              type="button"
              onClick={() => alert('Dica acolhedora do Dentinho: Se você esqueceu sua senha, ligue no 0800 700 1987 que nossa equipe ajuda você na hora!')}
              className="text-xs font-semibold text-mateus-blue hover:text-mateus-red transition underline underline-offset-2"
            >
              Esqueceu a senha?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Digite sua senha secreta"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              className={`w-full px-4 py-3 pl-11 pr-11 rounded-xl text-sm font-medium bg-slate-50 border-2 transition focus:outline-none focus:bg-white ${
                errors.password
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-slate-200 focus:border-mateus-blue'
              }`}
            />
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ocultar senha' : 'Ver senha digitada'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p id="login-password-error" className="text-xs font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle size={13} /> {errors.password}
            </p>
          )}
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-mateus-red hover:bg-mateus-red-hover text-white font-extrabold text-sm sm:text-base shadow-heart transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verificando seu caderninho...</span>
            </span>
          ) : (
            <>
              <LogIn size={18} />
              <span>Entrar no Caderninho Digital</span>
            </>
          )}
        </button>
      </form>

      {/* Alternar para Cadastro */}
      <div className="pt-4 border-t border-slate-100 text-center">
        <p className="text-xs sm:text-sm text-slate-600">
          Ainda não tem conta no nosso supermercado?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-mateus-blue hover:text-mateus-red transition underline underline-offset-4"
          >
            Cadastre-se com facilidade aqui
          </button>
        </p>
      </div>
    </div>
  );
};
