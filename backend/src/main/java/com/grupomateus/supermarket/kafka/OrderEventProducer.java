package com.grupomateus.supermarket.kafka;

import com.grupomateus.supermarket.event.OrderPlacedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topics.order-placed:supermarket.orders.placed}")
    private String orderPlacedTopic;

    public void publishOrderPlaced(OrderPlacedEvent event) {
        log.info("Publicando evento no Kafka [Tópico: {}] | Pedido: {} | Cliente: {}",
                orderPlacedTopic, event.orderNumber(), event.customerName());

        try {
            kafkaTemplate.send(orderPlacedTopic, event.orderNumber(), event)
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            log.error("Erro ao entregar evento no Kafka para o pedido {}", event.orderNumber(), ex);
                        } else {
                            log.info("Evento entregue com sucesso no Kafka [Tópico: {}, Partição: {}, Offset: {}] para o pedido {}",
                                    result.getRecordMetadata().topic(),
                                    result.getRecordMetadata().partition(),
                                    result.getRecordMetadata().offset(),
                                    event.orderNumber());
                        }
                    });
        } catch (Exception e) {
            log.error("Falha ao submeter mensagem ao broker Kafka para o pedido {}", event.orderNumber(), e);
        }
    }
}
