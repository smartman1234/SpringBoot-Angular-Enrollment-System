package io.spring.enrollmentsystem.common.security;

import io.spring.enrollmentsystem.common.configuration.SystemProperties;
import io.spring.enrollmentsystem.feature.authentication.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@EnableWebSecurity
@EnableGlobalMethodSecurity(
        securedEnabled = true, // @Secured enabled
        jsr250Enabled = true,  // @RolesAllowed enabled
        prePostEnabled = true  // @PreAuthorized and @PostAuthorized enabled
)
@RequiredArgsConstructor
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final CustomUserDetailsService customUserDetailsService;
    private final Http401UnauthorizedEntryPoint http401UnauthorizedEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final PasswordEncoder passwordEncoder;
    private final SystemProperties systemProperties;

    /**
     * The custom security filter JwtAuthenticationFilter is marked as @Component which means
     * it automatically registered as a spring filter by default behavior. The custom filter is
     * also added manually to the filter chains in the HttpSecurity config below. Therefore,
     * JwtAuthenticationFilter is registered twice and it will be invoked twice for every request.
     * This FilterRegistrationBean will disable default registration for JwtAuthenticationFilter.
     *
     * @return FilterRegistrationBean
     */
    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> filterRegistrationBean() {
        FilterRegistrationBean<JwtAuthenticationFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(jwtAuthenticationFilter);
        registrationBean.setEnabled(false);
        return registrationBean;
    }

    // Expose authentication manager bean for manual authentication
    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    // register custom UserDetailsService and PasswordEncoder
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder);
    }

    // configure to ignore specific endpoints (not used in production)
    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
                .mvcMatchers(systemProperties.getWebIgnoreEndpoints());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        // Set Content Security Policy to allow only particular script source(s) and resources
        http.headers().contentSecurityPolicy("script-src 'self'");

        // Enable CORS and enable CSRF token requirement for every request
        http.cors().and()
                .csrf()
                // set cookie csrf as csrf token repository instead of the default using SessionId
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());

        // require TLS for all requests
        if (systemProperties.isTls()) {
            http.requiresChannel().anyRequest().requiresSecure();
        }

        // Allow only same origin in a frame (default: deny, other option are allow-from and sameOrigin)
        // Used only for h2-console
//        http.headers().frameOptions().sameOrigin();

        // Set session management to stateless
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // Set Http 401 "unauthorized" entry point
        http.exceptionHandling().authenticationEntryPoint(http401UnauthorizedEntryPoint);
        // Set custom access denied handler instead of the default 403 "access denied" entry point
        http.exceptionHandling().accessDeniedHandler(customAccessDeniedHandler);

        // Disable form login and http basic
        http.formLogin().disable();
        http.httpBasic().disable();

        // Add JWT filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        // @formatter:on
    }
}
