/**
 * Utilitários de formatação para valores monetários e numéricos (padrão brasileiro pt-BR).
 */

const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formata um valor numérico para o padrão de moeda brasileira (ex: R$ 24,90).
 * Trata valores nulos, indefinidos ou NaN retornando R$ 0,00 de maneira segura.
 */
export const formatCurrency = (value?: number | null): string => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return BRL_FORMATTER.format(0);
  }
  return BRL_FORMATTER.format(value);
};
