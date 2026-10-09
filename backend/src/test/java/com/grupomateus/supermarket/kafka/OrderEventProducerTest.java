package com.grupomateus.supermarket.kafka;

import com.grupomateus.supermarket.event.OrderItemEvent;
import com.grupomateus.supermarket.event.OrderPlacedEvent;
import com.grupomateus.supermarket.model.PaymentMethod;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.TopicPartition;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderEventProducerTest {

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private OrderEventProducer orderEventProducer;

    private OrderPlacedEvent event;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(orderEventProducer, "orderPlacedTopic", "supermarket.orders.placed");

        OrderItemEvent item = new OrderItemEvent(
                1L, "Arroz Branco 5kg", 2, new BigDecimal("25.00"), new BigDecimal("50.00")
        );

        event = new OrderPlacedEvent(
                100L,
                "PED-20261009-0001",
                1L,
                "Dona Marta",
                "marta@mateus.com",
                new BigDecimal("50.00"),
                PaymentMethod.CADERNINHO,
                "Rua do Sol, 123",
                List.of(item),
                LocalDateTime.now()
        );
    }

    @Test
    @DisplayName("Deve publicar evento de pedido no tópico do Kafka com sucesso")
    void testPublishOrderPlacedSuccess() {
        RecordMetadata metadata = new RecordMetadata(
                new TopicPartition("supermarket.orders.placed", 0), 0, 0, 0, 0, 0
        );
        SendResult<String, Object> sendResult = new SendResult<>(null, metadata);
        CompletableFuture<SendResult<String, Object>> future = CompletableFuture.completedFuture(sendResult);

        when(kafkaTemplate.send(eq("supermarket.orders.placed"), eq("PED-20261009-0001"), any(OrderPlacedEvent.class)))
                .thenReturn(future);

        assertDoesNotThrow(() -> orderEventProducer.publishOrderPlaced(event));

        verify(kafkaTemplate, times(1))
                .send(eq("supermarket.orders.placed"), eq("PED-20261009-0001"), eq(event));
    }

    @Test
    @DisplayName("Não deve lançar exceção se o broker do Kafka falhar ao enviar (resiliência)")
    void testPublishOrderPlacedBrokerFailureGraceful() {
        when(kafkaTemplate.send(any(), any(), any()))
                .thenThrow(new RuntimeException("Broker de Kafka indisponível"));

        assertDoesNotThrow(() -> orderEventProducer.publishOrderPlaced(event));

        verify(kafkaTemplate, times(1)).send(any(), any(), any());
    }
}
