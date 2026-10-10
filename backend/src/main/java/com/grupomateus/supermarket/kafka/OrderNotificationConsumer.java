package com.grupomateus.supermarket.kafka;

import com.grupomateus.supermarket.event.OrderPlacedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
@Component
@Slf4j
public class OrderNotificationConsumer {

    @KafkaListener(
            topics = "${app.kafka.topics.order-placed:supermarket.orders.placed}",
            groupId = "supermarket-notifications-group"
    )
    public void handleOrderPlacedNotification(OrderPlacedEvent event) {
        log.info("================================================================================");
        log.info("[KAFKA CONSUMER: NOTIFICAÇÃO AO CLIENTE] Mensagem recebida!");
        log.info("  -> Pedido: {}", event.orderNumber());
        log.info("  -> Cliente: {} <{}>", event.customerName(), event.customerEmail());
        log.info("  -> Valor Total: R$ {} | Pagamento: {}", event.totalAmount(), event.paymentMethod());
        log.info("  -> Endereço de Entrega: {}", event.deliveryAddress());
        log.info("  -> Itens adquiridos: {} item(ns)", event.items() != null ? event.items().size() : 0);
        log.info("  -> [SIMULAÇÃO DE DISPARO]: Notificação enviada com sucesso para {}", event.customerEmail());
        log.info("================================================================================");
    }
}
