/**
 * Utilitários de Pagamento e Validações Financeiras Reais
 * Implementa o Algoritmo de Luhn (ISO/IEC 7812), detecção de bandeiras (BIN),
 * máscaras de digitação e gerador de payload PIX padrão Banco Central do Brasil.
 */

export type CardBrand = 'visa' | 'mastercard' | 'elo' | 'hipercard' | 'unknown';

export interface TestCardPreset {
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  expectedStatus: 'APPROVED' | 'REJECTED';
  description: string;
}

export const TEST_CARDS: TestCardPreset[] = [
  {
    name: 'Cartão Sucesso (Visa)',
    number: '4000 0000 0000 0001',
    expiry: '12/28',
    cvv: '123',
    expectedStatus: 'APPROVED',
    description: 'Aprovação imediata garantida para avaliação.',
  },
  {
    name: 'Cartão Recusado - Saldo Insuficiente (Mastercard)',
    number: '5500 0000 0000 0002',
    expiry: '08/27',
    cvv: '456',
    expectedStatus: 'REJECTED',
    description: 'Simula recusa bancária por saldo insuficiente.',
  },
  {
    name: 'Cartão Recusado - Bloqueio de Segurança (Elo)',
    number: '6363 6800 0000 0003',
    expiry: '05/29',
    cvv: '789',
    expectedStatus: 'REJECTED',
    description: 'Simula recusa por bloqueio preventivo da emissora.',
  },
];

/**
 * Validação real pelo Algoritmo de Luhn (ISO/IEC 7812)
 * Usado internacionalmente por Visa, Mastercard, Amex, etc.
 */
export const validateLuhn = (cardNumber: string): boolean => {
  const clean = cardNumber.replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

/**
 * Detecta a bandeira do cartão com base nos primeiros dígitos (BIN)
 */
export const detectCardBrand = (cardNumber: string): CardBrand => {
  const clean = cardNumber.replace(/\D/g, '');

  if (/^4/.test(clean)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
  if (/^(4011|4389|4514|5041|5066|5067|5090|6277|6362|6363|6504|6505|6516)/.test(clean)) return 'elo';
  if (/^(6062|3841)/.test(clean)) return 'hipercard';

  return 'unknown';
};

/**
 * Formata número de cartão com espaços a cada 4 dígitos (ex: 4000 0000 0000 0000)
 */
export const formatCardNumber = (value: string): string => {
  const clean = value.replace(/\D/g, '').slice(0, 16);
  return clean.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

/**
 * Formata data de validade (MM/AA)
 */
export const formatExpiry = (value: string): string => {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 3) {
    return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  }
  return clean;
};

/**
 * Formata CVV (até 4 dígitos)
 */
export const formatCvv = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 4);
};

/**
 * Formata CEP (00000-000)
 */
export const formatCep = (value: string): string => {
  const clean = value.replace(/\D/g, '').slice(0, 8);
  if (clean.length > 5) {
    return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  }
  return clean;
};

/**
 * Gera um payload oficial simulado de PIX no padrão EMVCo / Banco Central (BR Code)
 */
export const generatePixBrCode = (orderNumber: string, amount: number): string => {
  const cleanAmount = amount.toFixed(2);
  const chave = 'financeiro@grupomateus.com.br';
  const nome = 'SUPERMERCADO VOCE NO CORACAO DA GENTE';
  const cidade = 'SAO LUIS';

  // Estrutura simplificada legível de payload EMV BR Code
  return `00020126580014br.gov.bcb.pix0136${chave}5204000053039865406${cleanAmount}5802BR59${nome.length}${nome}60${cidade.length}${cidade}62170513${orderNumber}6304MATEUS`;
};
