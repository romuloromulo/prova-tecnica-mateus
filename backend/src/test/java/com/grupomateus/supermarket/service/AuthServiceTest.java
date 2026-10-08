package com.grupomateus.supermarket.service;

import com.grupomateus.supermarket.dto.AuthResponse;
import com.grupomateus.supermarket.dto.LoginRequest;
import com.grupomateus.supermarket.dto.RegisterRequest;
import com.grupomateus.supermarket.exception.DuplicateEmailException;
import com.grupomateus.supermarket.model.User;
import com.grupomateus.supermarket.repository.UserRepository;
import com.grupomateus.supermarket.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .name("Dona Marta")
                .email("marta@mateus.com")
                .password("encoded_pass")
                .caderninhoLimit(new BigDecimal("800.00"))
                .build();
    }

    @Test
    @DisplayName("Deve registrar novo usuário com sucesso e codificar a senha")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("Dona Marta", "marta@mateus.com", "123456", "98988887777");

        when(userRepository.existsByEmail("marta@mateus.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(tokenProvider.generateToken(any(User.class))).thenReturn("jwt_mock_token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt_mock_token", response.token());
        assertEquals("marta@mateus.com", response.email());
        assertEquals(new BigDecimal("800.00"), response.caderninhoLimit());
        verify(passwordEncoder, times(1)).encode("123456");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Deve lançar DuplicateEmailException se e-mail já estiver cadastrado")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest("Dona Marta", "marta@mateus.com", "123456", null);

        when(userRepository.existsByEmail("marta@mateus.com")).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> {
            authService.register(request);
        });

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve realizar login com credenciais válidas e retornar token JWT")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("marta@mateus.com", "123456");
        Authentication auth = mock(Authentication.class);

        when(auth.getPrincipal()).thenReturn(user);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(user)).thenReturn("jwt_login_token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt_login_token", response.token());
        assertEquals(user.getId(), response.userId());
    }
}
