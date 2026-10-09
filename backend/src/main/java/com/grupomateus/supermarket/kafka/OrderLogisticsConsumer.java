package com.grupomateus.supermarket.kafka;

import com.grupomateus.supermarket.event.OrderPlacedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Consumidor Kafka responsável pela integração com o sistema de WMS e Logística de Loja.
 * Pertence ao Consumer Group 'supermarket-logistics-group'.
 */
@Component
@Slf4j
public class OrderLogisticsConsumer {

    @KafkaListener(
            topics = "${app.kafka.topics.order-placed:supermarket.orders.placed}",
            groupId = "supermarket-logistics-group"
    )
    public void handleOrderLogisticsFulfillment(OrderPlacedEvent event) {
        log.info("================================================================================");
        log.info("[KAFKA CONSUMER: LOGÍSTICA & WMS] Novo pedido liberado para separação física!");
        log.info("  -> Pedido: {}", event.orderNumber());
        log.info("  -> Destino: {}", event.deliveryAddress());
        log.info("  -> Status de Expedição: AGUARDANDO_COLETA_SEPARADOR");
        log.info("================================================================================");
    }
}
