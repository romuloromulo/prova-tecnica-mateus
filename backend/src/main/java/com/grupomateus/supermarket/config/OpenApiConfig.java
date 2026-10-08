package com.grupomateus.supermarket.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Supermercado 'Você no Coração da Gente' - API")
                        .version("1.0.0")
                        .description("API RESTful desenvolvida com Spring Boot 3 e Java 21 para o desafio técnico do Grupo Mateus. " +
                                "Gerencia catálogo de produtos, controle de estoque com concorrência otimista, carrinho de compras e checkout com Caderninho.")
                        .contact(new Contact()
                                .name("Grupo Mateus - Desafio Técnico")
                                .url("https://www.grupomateus.com.br")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
