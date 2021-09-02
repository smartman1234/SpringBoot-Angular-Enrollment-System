package io.spring.enrollmentsystem.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.core.jackson.ModelResolver;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.customizers.OpenApiCustomiser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@RequiredArgsConstructor
public class OpenApiConfiguration {

    private final JwtProperties jwtProperties;
    private final SystemProperties systemProperties;

    // Springdoc bean configuration
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                              .title("Enrollment System API")
                              .version(systemProperties.getCurrentVersion()).description("Course enrollment system.")
                              .license(new License().name("GNU GPLv3").url(
                                      "https://www.gnu.org/licenses/gpl-3.0.txt")))
                .addServersItem(new Server().description("Development Server").url(systemProperties.getUrls()[0]))
                .components(new Components().addSecuritySchemes("cookieAuth",
                                                                new SecurityScheme()
                                                                        .type(SecurityScheme.Type.APIKEY)
                                                                        .in(SecurityScheme.In.COOKIE)
                                                                        .name(jwtProperties.getAccessCookieName())))
                .addSecurityItem(new SecurityRequirement().addList("cookieAuth"));
    }

    @Bean
    public OpenApiCustomiser requestBodySchemaForPatchDocument() {
        return openApi -> openApi.getPaths().values().stream()
                .filter(pathItem -> pathItem.getPatch() != null)
                .flatMap(pathItem -> pathItem.readOperations().stream())
                .filter(operation -> operation.getRequestBody() != null
                        && operation.getRequestBody().getContent().containsKey("application/merge-patch+json"))
                .forEach(operation -> operation.getRequestBody()
                        .required(false)
                        .getContent()
                        .replace("application/merge-patch+json", new MediaType()
                                .schema(new Schema<>()
                                                .$ref("#/components/schemas/"
                                                              + operation.getOperationId().replaceFirst(
                                                        "patch", "")
                                                              + "Dto_Update"))));
    }

    @Bean
    @Profile("dev")
    public OpenApiCustomiser loginRequestExample() {
        return openApi -> openApi.getPaths().values().stream()
                .flatMap(pathItem -> pathItem.readOperations().stream())
                .filter(operation -> operation.getOperationId().equals("login"))
                .forEach(operation -> operation.getRequestBody()
                        .getContent()
                        .get("application/json")
                        .addExamples("", new Example()
                                .value("{\n  \"username\": \"" + systemProperties.getAdminUserName() + "\",\n"
                                               + "  \"password\": \"" + systemProperties.getAdminPassword() + "\"\n}")));
    }

    // configuration for Springdoc to pickup Spring ObjectMapper (in case of changing property naming strategy)
    @Bean
    public ModelResolver modelResolver(ObjectMapper objectMapper) {
        return new ModelResolver(objectMapper);
    }
}
