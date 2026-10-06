import api from './api';
import type { Product, ProductCategory, ProductFilterParams, PaginatedProducts } from '../types/product';

// Catálogo base rico e autêntico para a experiência do supermercado
const MOCK_PRODUCTS: Product[] = [
  // 🍎 Hortifrúti
  {
    id: 101,
    name: 'Maçã Fuji Selecionada (Kg)',
    description: 'Docinhas, crocantes e colhidas frescas da melhor safra.',
    price: 9.49,
    stockQuantity: 28,
    category: 'hortifruti',
    unit: 'kg',
    isPromotion: true,
  },
  {
    id: 102,
    name: 'Banana Prata da Terra (Kg)',
    description: 'Frutas no ponto ideal de maturação, perfeitas para o café da manhã.',
    price: 6.89,
    stockQuantity: 35,
    category: 'hortifruti',
    unit: 'kg',
  },
  {
    id: 103,
    name: 'Tomate Italiano Especial (Kg)',
    description: 'Carnudos e saborosos, ideais para saladas frescas e molhos caseiros.',
    price: 8.79,
    stockQuantity: 18,
    category: 'hortifruti',
    unit: 'kg',
    isPromotion: true,
  },
  {
    id: 104,
    name: 'Alface Americana Hidropônica (Un)',
    description: 'Folhas crocantes e lavadas, direto do produtor rural parceiro.',
    price: 4.29,
    stockQuantity: 4, // Estoque baixo para testar alerta
    category: 'hortifruti',
    unit: 'un',
  },
  {
    id: 105,
    name: 'Cenoura Especial Selecionada (Kg)',
    description: 'Fresquinha, crocante e rica em nutrientes.',
    price: 5.99,
    stockQuantity: 22,
    category: 'hortifruti',
    unit: 'kg',
  },

  // 🥩 Açougue & Carnes
  {
    id: 201,
    name: 'Carne Moída Bovina de Primeira (Kg)',
    description: 'Moida na hora com cortes magros e selecionados no balcão.',
    price: 34.9,
    stockQuantity: 15,
    category: 'acougue',
    unit: 'kg',
    isPromotion: true,
  },
  {
    id: 202,
    name: 'Peito de Frango Desossado e Congelado (Kg)',
    description: 'Cortes nobres, saudáveis e sem pele.',
    price: 19.8,
    stockQuantity: 24,
    category: 'acougue',
    unit: 'kg',
  },
  {
    id: 203,
    name: 'Costelinha Suína Especial (Kg)',
    description: 'Carne macia, suculenta e com corte tradicional de domingo.',
    price: 27.5,
    stockQuantity: 3, // Estoque baixo
    category: 'acougue',
    unit: 'kg',
  },
  {
    id: 204,
    name: 'Filé de Tilápia Fresca (Kg)',
    description: 'Pescado fresco, limpo e sem espinhas, pronto para preparar.',
    price: 39.9,
    stockQuantity: 10,
    category: 'acougue',
    unit: 'kg',
    isPromotion: true,
  },

  // 🥐 Padaria Fresquinha
  {
    id: 301,
    name: 'Pão Francês Tradicional (Cesta 6 un)',
    description: 'Quentinho e crocante por fora, fofinho por dentro, saindo a toda hora.',
    price: 7.2,
    stockQuantity: 40,
    category: 'padaria',
    unit: 'un',
    isPromotion: true,
  },
  {
    id: 302,
    name: 'Bolo Caseiro de Fubá com Erva-Doce',
    description: 'A receita de vó do caderninho de 1987 do Seu Osvaldo.',
    price: 16.5,
    stockQuantity: 7,
    category: 'padaria',
    unit: 'un',
  },
  {
    id: 303,
    name: 'Pão de Queijo Mineiro Assado (Pct 10 un)',
    description: 'Com queijo meia cura de verdade, crocante e saboroso.',
    price: 12.9,
    stockQuantity: 19,
    category: 'padaria',
    unit: 'un',
  },
  {
    id: 304,
    name: 'Sonho Tradicional Recheado com Creme',
    description: 'Massa levíssima frita no ponto e polvilhada com açúcar de confeiteiro.',
    price: 4.5,
    stockQuantity: 2, // Alerta de estoque crítico
    category: 'padaria',
    unit: 'un',
  },

  // 📦 Mercearia Básica
  {
    id: 401,
    name: 'Café Tradicional do Seu Osvaldo 500g',
    description: 'Torrado e moído no capricho, sabor inconfundível do balcão de 1987.',
    price: 18.9,
    stockQuantity: 30,
    category: 'mercearia',
    unit: 'pct',
    isPromotion: true,
  },
  {
    id: 402,
    name: 'Arroz Branco Tipo 1 Nobre (Pacote 5kg)',
    description: 'Grãos selecionados, soltinho e indispensável no almoço da família.',
    price: 26.9,
    stockQuantity: 45,
    category: 'mercearia',
    unit: 'pct',
  },
  {
    id: 403,
    name: 'Feijão Carioca Novo Especial (1kg)',
    description: 'Cozimento rápido, caldo grosso e cor clara.',
    price: 8.49,
    stockQuantity: 32,
    category: 'mercearia',
    unit: 'pct',
  },
  {
    id: 404,
    name: 'Óleo de Soja Refinado 900ml',
    description: '100% vegetal, puro e ideal para suas receitas diárias.',
    price: 6.79,
    stockQuantity: 50,
    category: 'mercearia',
    unit: 'un',
  },
  {
    id: 405,
    name: 'Leite Integral Pasteurizado 1 Litro',
    description: 'Fonte natural de cálcio e energia para toda a família.',
    price: 5.49,
    stockQuantity: 26,
    category: 'mercearia',
    unit: 'un',
  },

  // ✨ Higiene & Limpeza
  {
    id: 501,
    name: 'Sabão em Pó Ação Profunda 1,6kg',
    description: 'Limpeza potente com perfume duradouro que rende muito mais.',
    price: 17.9,
    stockQuantity: 20,
    category: 'limpeza',
    unit: 'pct',
    isPromotion: true,
  },
  {
    id: 502,
    name: 'Detergente Líquido Neutro 500ml',
    description: 'Alto poder desengordurante com fórmula suave para as mãos da Dona Marta.',
    price: 2.79,
    stockQuantity: 60,
    category: 'limpeza',
    unit: 'un',
  },
  {
    id: 503,
    name: 'Desinfetante Floral Pinho Brisa 1L',
    description: 'Elimina 99,9% dos germes e deixa o chão brilhando e cheiroso.',
    price: 8.9,
    stockQuantity: 14,
    category: 'limpeza',
    unit: 'un',
  },
  {
    id: 504,
    name: 'Água Sanitária Clorada 2 Litros',
    description: 'Máxima higienização e ação alvejante para roupas e pisos.',
    price: 5.2,
    stockQuantity: 18,
    category: 'limpeza',
    unit: 'un',
  },
];

export const productService = {
  /**
   * Obtém a lista paginada e filtrada de produtos
   */
  async getProducts(params: ProductFilterParams = {}): Promise<PaginatedProducts> {
    const { category = 'all', search = '', page = 1, size = 8 } = params;

    try {
      // 1. Requisição real à API RESTful Spring Boot
      const response = await api.get<PaginatedProducts>('/products', {
        params: {
          category: category !== 'all' ? category : undefined,
          search: search ? search.trim() : undefined,
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      // 2. Fallback local inteligente e instantâneo
      let filtered = [...MOCK_PRODUCTS];

      // Filtro por setor / categoria
      if (category && category !== 'all') {
        filtered = filtered.filter((p) => p.category === category);
      }

      // Filtro por busca textual (nome ou descrição)
      if (search && search.trim() !== '') {
        const query = search.trim().toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }

      // Paginação
      const totalElements = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const validPage = Math.min(Math.max(1, page), totalPages);
      const startIndex = (validPage - 1) * size;
      const paginatedContent = filtered.slice(startIndex, startIndex + size);

      return {
        content: paginatedContent,
        totalElements,
        totalPages,
        currentPage: validPage,
        pageSize: size,
      };
    }
  },

  /**
   * Obtém detalhes de um produto por ID
   */
  async getProductById(id: number | string): Promise<Product | null> {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    } catch {
      const found = MOCK_PRODUCTS.find((p) => String(p.id) === String(id));
      return found || null;
    }
  },

  /**
   * Retorna a contagem total de produtos por categoria
   */
  async getCategoriesCount(): Promise<Record<ProductCategory | 'all', number>> {
    const counts: Record<ProductCategory | 'all', number> = {
      all: MOCK_PRODUCTS.length,
      hortifruti: MOCK_PRODUCTS.filter((p) => p.category === 'hortifruti').length,
      acougue: MOCK_PRODUCTS.filter((p) => p.category === 'acougue').length,
      padaria: MOCK_PRODUCTS.filter((p) => p.category === 'padaria').length,
      mercearia: MOCK_PRODUCTS.filter((p) => p.category === 'mercearia').length,
      limpeza: MOCK_PRODUCTS.filter((p) => p.category === 'limpeza').length,
    };
    return counts;
  },
};

export default productService;
