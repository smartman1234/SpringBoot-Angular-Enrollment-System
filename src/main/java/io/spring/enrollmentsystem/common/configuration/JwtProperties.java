package io.spring.enrollmentsystem.common.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter @Setter
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secretKey;
    private Long accessExpirationTime;
    private Long refreshExpirationTime;
    private String tokenHeader;
    private String tokenPrefix;
    private String tokenType;
    private String tokenIssuer;
    private String tokenAudience;
    private String accessCookieName;
    private String refreshCookieName;
    private String refreshCookieUrl;
}
