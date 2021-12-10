package io.spring.enrollmentsystem.common.configuration;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.module.SimpleModule;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.spring.enrollmentsystem.common.repository.CustomRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.UUID;

@Configuration
@EnableJpaAuditing
@EnableJpaRepositories(
        repositoryBaseClass = CustomRepositoryImpl.class,
        basePackages = {"io.spring.enrollmentsystem.feature", "io.spring.enrollmentsystem.common.repository"}
)
@EnableRedisRepositories(basePackages = {"io.spring.enrollmentsystem.feature.authentication"})
@RequiredArgsConstructor
public class BeansConfiguration {

    private final JwtProperties jwtProperties;
    private final SystemProperties systemProperties;

    // configuration for custom pagination serialization to apply @JsonView from controller
    @Bean
    public Module paginationWithJsonViewModule() {
        SimpleModule module = new SimpleModule();
        module.addSerializer(Page.class, new CustomPageSerializer());
        module.addSerializer(Slice.class, new CustomSliceSerializer());
        return module;
    }

    // configuration for redis template
    @Bean
    public RedisTemplate<?, ?> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<byte[], byte[]> template = new RedisTemplate<>();
        connectionFactory.getConnection().flushDb();
        template.setConnectionFactory(connectionFactory);
        return template;
    }


    // configure auditor provider for auditing classes
    @Bean
    public AuditorAware<UUID> auditorProvider() {
        return new CustomAuditorAware();
    }

    // Set password encoding schema
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Argon2PasswordEncoder();
    }

    // Set Jwt builder with signing key and algorithm
    @Bean
    public JwtBuilder jwtBuilder() {
        SecretKey key = Keys.hmacShaKeyFor(Base64.getUrlDecoder().decode(jwtProperties.getSecretKey()));
        return Jwts.builder().signWith(key, SignatureAlgorithm.HS256);
    }

    // Set Jwt parser with signing key
    @Bean
    public JwtParser jwtParser() {
        SecretKey key = Keys.hmacShaKeyFor(Base64.getUrlDecoder().decode(jwtProperties.getSecretKey()));
        return Jwts.parserBuilder().setSigningKey(key).build();
    }

    // configure CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(systemProperties.getUrls()));
        configuration.setAllowedMethods(Arrays.asList("HEAD", "OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Collections.singletonList("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
