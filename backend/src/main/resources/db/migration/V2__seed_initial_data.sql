-- V2: Carga Inicial de Dados de Teste (Personas Dona Marta, Pedro e Catálogo de Produtos)
-- Supermercado "Você no Coração da Gente" (Grupo Mateus)

-- Hash BCrypt para a senha 'marta123': $2a$10$wYQO1i8YQ9sE7P0b5h0Sbe1.wX1eP5N1e9W8sO0p1q2r3s4t5u6v7
-- Hash BCrypt para a senha 'pedro123': $2a$10$r9QO1i8YQ9sE7P0b5h0Sbe1.wX1eP5N1e9W8sO0p1q2r3s4t5u6v8

INSERT INTO users (name, email, password, phone, caderninho_limit) VALUES
('Dona Marta de Sousa', 'marta@mateus.com.br', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '(98) 98888-1987', 800.00),
('Pedro Henrique de Sousa', 'pedro@mateus.com.br', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '(98) 99191-2026', 200.00);

-- Catálogo de Produtos das 5 Categorias Oficiais
INSERT INTO products (name, description, category, price, stock_quantity, image_url, version) VALUES
-- Hortifrúti
('Banana Prata Selecionada (kg)', 'Bananas doces e frescas, selecionadas do produtor rural da região.', 'hortifruti', 5.99, 50, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80', 0),
('Tomate Longa Vida (kg)', 'Tomates firmes e vermelhos, ideais para saladas e molhos artesanais.', 'hortifruti', 7.49, 40, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80', 0),
('Maçã Fuji Nacional (kg)', 'Maçãs crocantes e suculentas, perfeitas para o lanche da tarde.', 'hortifruti', 8.90, 35, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80', 0),
('Alface Americana Hidropônica (un)', 'Folhas frescas, crocantes e limpas, cultivadas com água tratada.', 'hortifruti', 3.49, 25, 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&auto=format&fit=crop&q=80', 0),

-- Açougue
('Picanha Bovina Resfriada (kg)', 'Corte nobre com capa de gordura uniforme, maciez inigualável.', 'acougue', 59.90, 15, 'https://images.unsplash.com/photo-1558030006-450675393462?w=500&auto=format&fit=crop&q=80', 0),
('Peito de Frango Desossado (kg)', 'Filés limpos e sem pele, perfeitos para grelhados saudáveis.', 'acougue', 19.99, 45, 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=80', 0),
('Carne Moída Patinho Fresco (kg)', 'Carne magra de primeira, moída na hora no balcão do açougue.', 'acougue', 36.50, 30, 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500&auto=format&fit=crop&q=80', 0),

-- Padaria
('Pão Francês Tradicional (kg)', 'Crocante por fora e macio por dentro, assado a cada hora.', 'padaria', 12.90, 60, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80', 0),
('Bolo Caseiro de Cenoura com Chocolate (un)', 'Receita tradicional fofinha com generosa cobertura de brigadeiro.', 'padaria', 16.00, 20, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80', 0),
('Queijo Mussarela Fatiado (200g)', 'Fatias finas e sabor suave, indispensável no café da manhã.', 'padaria', 11.80, 50, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80', 0),

-- Mercearia
('Arroz Branco Tipo 1 (5kg)', 'Grãos nobres selecionados, soltinho e de alto rendimento.', 'mercearia', 26.90, 80, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80', 0),
('Feijão Carioca Novo (1kg)', 'Grãos novos que cozinham rápido, caldo grosso e saboroso.', 'mercearia', 7.89, 70, 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500&auto=format&fit=crop&q=80', 0),
('Café Torrado e Moído Tradicional (500g)', 'Aroma marcante e sabor encorpado para começar bem o dia.', 'mercearia', 17.50, 65, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=80', 0),
('Óleo de Soja Refinado (900ml)', 'Puro e cristalino, essencial para o preparo de refeições diárias.', 'mercearia', 6.49, 90, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80', 0),

-- Limpeza
('Detergente Líquido Neutro (500ml)', 'Máximo rendimento e alto poder desengordurante, suave nas mãos.', 'limpeza', 2.39, 100, 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80', 0),
('Sabão em Pó Concentrado (1.6kg)', 'Limpeza profunda com perfume duradouro que protege as cores.', 'limpeza', 18.90, 40, 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&auto=format&fit=crop&q=80', 0),
('Desinfetante Lavanda Floral (1L)', 'Elimina germes e bactérias deixando a casa com frescor prolongado.', 'limpeza', 5.99, 55, 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=80', 0);
