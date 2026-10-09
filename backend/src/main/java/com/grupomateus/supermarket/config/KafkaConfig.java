package com.grupomateus.supermarket.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Value("${app.kafka.topics.order-placed:supermarket.orders.placed}")
    private String orderPlacedTopic;

    /**
     * Declaração do tópico Kafka para criação automática pelo broker caso não exista.
     * Configurado com 3 partições para permitir consumo concorrente escalável por múltiplos nós.
     */
    @Bean
    public NewTopic orderPlacedTopic() {
        return TopicBuilder.name(orderPlacedTopic)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
