package com.grupomateus.supermarket.controller;

import com.grupomateus.supermarket.dto.AuthResponse;
import com.grupomateus.supermarket.dto.LoginRequest;
import com.grupomateus.supermarket.dto.RegisterRequest;
import com.grupomateus.supermarket.dto.UserProfileResponse;
import com.grupomateus.supermarket.model.User;
import com.grupomateus.supermarket.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Endpoints de cadastro, login e perfil do cliente")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Cadastrar novo cliente", description = "Cria um novo usuário e devolve o token JWT com limite inicial no Caderninho.")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Autenticar cliente", description = "Autentica usuário via e-mail e senha e retorna o token JWT.")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Consultar perfil autenticado", description = "Retorna os dados do cliente logado, incluindo o limite atual do Caderninho.")
    public ResponseEntity<UserProfileResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        UserProfileResponse profile = authService.getCurrentUserProfile(user.getEmail());
        return ResponseEntity.ok(profile);
    }
}
