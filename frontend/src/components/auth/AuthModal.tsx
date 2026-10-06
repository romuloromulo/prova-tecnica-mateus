import React, { useState, useEffect } from 'react';
import { X, Heart, LogIn, UserPlus } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Fecha no ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Trava scroll do body enquanto o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho com Mascote Dentinho e Marca Grupo Mateus */}
        <div className="bg-gradient-to-r from-mateus-blue to-mateus-blue-800 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-dentinho shrink-0 flex items-center justify-center">
              <img
                src="/mascote/dentinho-ola.svg"
                alt="Mascote Dentinho"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-mateus-sky-200 uppercase tracking-wider">
                <Heart size={12} className="fill-mateus-red text-mateus-red" />
                <span>Supermercado Grupo Mateus</span>
              </div>
              <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-black text-white leading-tight">
                {activeTab === 'login' ? 'Bem-vindo ao Caderninho!' : 'Abra seu Caderninho Digital'}
              </h2>
              <p className="text-xs text-mateus-sky-100 mt-0.5">
                {activeTab === 'login'
                  ? 'Acesse suas compras e limites de confiança.'
                  : 'Cadastro fácil e humanizado para você e sua família.'}
              </p>
            </div>
          </div>

          {/* Abas Alternáveis */}
          <div className="mt-5 grid grid-cols-2 p-1 rounded-xl bg-mateus-blue-900/50 backdrop-blur-sm border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs sm:text-sm transition ${
                activeTab === 'login'
                  ? 'bg-white text-mateus-blue shadow-sm'
                  : 'text-mateus-sky-100 hover:text-white'
              }`}
            >
              <LogIn size={16} />
              <span>Já Tenho Conta</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs sm:text-sm transition ${
                activeTab === 'register'
                  ? 'bg-white text-mateus-blue shadow-sm'
                  : 'text-mateus-sky-100 hover:text-white'
              }`}
            >
              <UserPlus size={16} />
              <span>Quero Me Cadastrar</span>
            </button>
          </div>
        </div>

        {/* Corpo com formulários e scroll suave se a tela for menor */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {activeTab === 'login' ? (
            <LoginForm
              onSuccess={onClose}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          ) : (
            <RegisterForm
              onSuccess={onClose}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
