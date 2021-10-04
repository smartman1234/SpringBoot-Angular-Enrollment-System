package io.spring.enrollmentsystem.common.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Getter @Setter
@Configuration
@ConfigurationProperties(prefix = "system")
public class SystemProperties {
    private String[] urls;
    private boolean tls;
    private String currentVersion;
    private String[] webIgnoreEndpoints = new String[0];
    private Set<String> publicEndpoints;
    private String adminUserName;
    private String adminPassword;
    private String testPassword;
    private Boolean cookieSecure;
    private String cookieSameSite;
    private String namingStrategy;
}
