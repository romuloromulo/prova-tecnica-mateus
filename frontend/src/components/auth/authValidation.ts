import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Por favor, digite seu e-mail cadastrado.')
    .email('O formato do e-mail não parece certo (exemplo: seu.nome@gmail.com).'),
  password: z
    .string()
    .min(1, 'Por favor, digite sua senha de acesso.')
    .min(4, 'A senha possui no mínimo 4 caracteres.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Por favor, informe seu nome completo.')
      .min(3, 'O nome deve ter pelo menos 3 letras.'),
    email: z
      .string()
      .min(1, 'Por favor, informe seu e-mail.')
      .email('Digite um e-mail válido para enviarmos seus comprovantes de compra.'),
    phone: z
      .string()
      .min(1, 'Informe seu telefone ou WhatsApp com DDD.')
      .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Informe um telefone válido com DDD (ex: 98 98888-7777).'),
    password: z
      .string()
      .min(1, 'Crie uma senha de acesso.')
      .min(6, 'Para sua segurança, a senha deve ter pelo menos 6 caracteres.'),
    confirmPassword: z
      .string()
      .min(1, 'Por favor, confirme sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas digitadas precisam ser iguaizinhas.',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
