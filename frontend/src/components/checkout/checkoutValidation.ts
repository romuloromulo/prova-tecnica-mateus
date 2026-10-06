import { z } from 'zod';
import { validateLuhn, TEST_CARDS } from '@/utils/paymentUtils';

/**
 * Validador Zod para Cartão de Crédito
 * Atende aos padrões bancários com algoritmo de Luhn, formato de validade e CVV.
 */
export const creditCardSchema = z.object({
  number: z
    .string()
    .min(1, 'Por favor, digite o número do cartão de crédito.')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length >= 13 && val.length <= 19, {
      message: 'O número do cartão deve conter entre 13 e 19 dígitos.',
    })
    .refine(
      (val) => {
        // Aceita se passar no Algoritmo de Luhn ou se for um dos cartões de teste de sandbox
        const isSandboxCard = TEST_CARDS.some(
          (c) => c.number.replace(/\D/g, '') === val
        );
        return isSandboxCard || validateLuhn(val);
      },
      {
        message: 'Número de cartão inválido (não confere com o algoritmo bancário Luhn).',
      }
    ),

  holderName: z
    .string()
    .min(1, 'Por favor, informe o nome impresso no cartão.')
    .min(3, 'O nome deve ter pelo menos 3 letras.')
    .max(60, 'Nome muito longo.')
    .refine((val) => /^[a-zA-ZÀ-ÿ\s]+$/.test(val), {
      message: 'O nome deve conter apenas letras.',
    }),

  expiry: z
    .string()
    .min(1, 'Informe a data de validade (MM/AA).')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato de validade inválido. Use MM/AA (ex: 12/28).')
    .refine(
      (val) => {
        const parts = val.split('/');
        if (parts.length !== 2) return false;
        const month = parseInt(parts[0], 10);
        const year = 2000 + parseInt(parts[1], 10);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-12

        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;
        return true;
      },
      {
        message: 'Cartão com validade vencida. Verifique o mês e ano.',
      }
    ),

  cvv: z
    .string()
    .min(1, 'Informe o código de segurança (CVV).')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 3 || val.length === 4, {
      message: 'O código CVV deve conter 3 ou 4 dígitos.',
    }),

  installments: z
    .number()
    .int()
    .min(1, 'Selecione pelo menos 1 parcela.')
    .max(12, 'Máximo de 12 parcelas.'),
});

export type CreditCardFormData = z.infer<typeof creditCardSchema>;

/**
 * Validador Zod para Endereço de Entrega
 */
export const shippingAddressSchema = z.object({
  recipientName: z
    .string()
    .min(1, 'Informe o nome de quem receberá as compras.')
    .min(3, 'O nome do destinatário deve ter no mínimo 3 caracteres.'),

  cep: z
    .string()
    .min(1, 'Informe o CEP.')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 8, {
      message: 'O CEP deve conter 8 dígitos (ex: 65051-210).',
    }),

  street: z
    .string()
    .min(1, 'Informe o nome da rua ou avenida.')
    .min(3, 'A rua deve ter no mínimo 3 caracteres.'),

  number: z
    .string()
    .min(1, 'Informe o número do endereço ou S/N.'),

  neighborhood: z
    .string()
    .min(1, 'Informe o bairro.')
    .min(2, 'O bairro deve ter no mínimo 2 caracteres.'),

  city: z
    .string()
    .min(1, 'Informe a cidade.'),

  state: z
    .string()
    .min(2, 'Informe o estado.')
    .max(2, 'Use a sigla de 2 letras (ex: MA).'),

  complement: z.string().optional(),
});

export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
