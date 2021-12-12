package io.spring.enrollmentsystem.common.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.CaseFormat;
import io.spring.enrollmentsystem.feature.building.Building_;
import io.spring.enrollmentsystem.feature.college.College_;
import io.spring.enrollmentsystem.feature.course.Course_;
import io.spring.enrollmentsystem.feature.department.Department_;
import io.spring.enrollmentsystem.feature.enrollment.Enrollment_;
import io.spring.enrollmentsystem.feature.instructor.Instructor_;
import io.spring.enrollmentsystem.feature.room.Room_;
import io.spring.enrollmentsystem.feature.section.SectionController;
import io.spring.enrollmentsystem.feature.section.Section_;
import io.spring.enrollmentsystem.feature.student.Student_;
import io.spring.enrollmentsystem.feature.subject.Subject_;
import io.spring.enrollmentsystem.feature.term.Term_;
import io.spring.enrollmentsystem.feature.user.User_;
import io.swagger.v3.core.converter.AnnotatedType;
import io.swagger.v3.core.converter.ModelConverters;
import io.swagger.v3.core.converter.ResolvedSchema;
import io.swagger.v3.core.jackson.ModelResolver;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.GroupedOpenApi;
import org.springdoc.core.customizers.OpenApiCustomiser;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static io.spring.enrollmentsystem.common.constant.SpecsConstant.EQUALS_IGNORE_CASE;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.GREATER_THAN;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.GREATER_THAN_OR_EQUAL;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.KEY_SEPARATOR;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.LESS_THAN;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.LESS_THAN_OR_EQUAL;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.LIKE_IGNORE_CASE;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.NOT_EQUAL_IGNORE_CASE;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.STARTS_WITH_IGNORE_CASE;

@Configuration
@RequiredArgsConstructor @Slf4j
public class OpenApiConfiguration {

    private final JwtProperties jwtProperties;
    private final SystemProperties systemProperties;
    private final ApplicationContext applicationContext;

    @Bean
    public GroupedOpenApi userApi() {
        String[] paths = {"/api/v1/**"};
        String[] pathsToExclude = {"/api/v1/admin/**"};

        GroupedOpenApi.Builder userApiBuilder = GroupedOpenApi.builder()
                .group("enrollmentsystem-user")
                .pathsToMatch(paths)
                .pathsToExclude(pathsToExclude)
                .addOpenApiCustomiser(requestBodySchemaForPatchDocument())
                .addOpenApiCustomiser(loginRequestExample())
                .addOpenApiCustomiser(sectionFilterParameters())
                .addOpenApiCustomiser(rapidocCollapseTagByDefault());

        if (applicationContext.containsBeanDefinition("parametersKebabCaseNamingStrategy")) {
            userApiBuilder
                    .addOpenApiCustomiser((OpenApiCustomiser) applicationContext
                            .getBean( "parametersKebabCaseNamingStrategy" ));
        }

        return userApiBuilder.build();
    }

    @Bean
    public GroupedOpenApi adminApi() {
        String[] paths = {"/api/v1/admin/**", "/api/v1/auth/**"};
        String[] packagesToScan = {};
        GroupedOpenApi.Builder adminApiBuilder = GroupedOpenApi.builder()
                .group("enrollmentsystem-admin")
                .pathsToMatch(paths)
                .packagesToScan(packagesToScan)
                .addOpenApiCustomiser(requestBodySchemaForPatchDocument())
                .addOpenApiCustomiser(loginRequestExample())
                .addOpenApiCustomiser(dynamicFilterParameters())
                .addOpenApiCustomiser(rapidocCollapseTagByDefault());

        if (applicationContext.containsBeanDefinition("parametersKebabCaseNamingStrategy")) {
            adminApiBuilder
                    .addOpenApiCustomiser((OpenApiCustomiser) applicationContext
                            .getBean( "parametersKebabCaseNamingStrategy" ));
        }

        return adminApiBuilder.build();
    }

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
                .components(new Components()
                                    .addSchemas("MeetingTimeStart",
                                                getSchemaWithDifferentDescription(LocalTime.class,
                                                                                  "08:00:00"))
                                    .addSchemas("MeetingTimeEnd",
                                                getSchemaWithDifferentDescription(LocalTime.class,
                                                                                  "08:50:00")))
                .addSecurityItem(new SecurityRequirement().addList("cookieAuth"));
    }

    @Bean
    public OpenApiCustomiser rapidocCollapseTagByDefault() {
        return openApi -> openApi.getTags().forEach(tag -> tag.addExtension("x-tag-expanded", false));
    }

    private Schema<?> getSchemaWithDifferentDescription(Class<?> className, String description) {
        ResolvedSchema resolvedSchema = ModelConverters.getInstance()
                .resolveAsResolvedSchema(new AnnotatedType(className).resolveAsRef(false));
        if (className.equals(LocalTime.class)) {
            return resolvedSchema.schema.example(LocalTime.parse(description));
        }
        return resolvedSchema.schema.description(description);
    }

    @Bean
    public OpenApiCustomiser requestBodySchemaForPatchDocument() {
        return openApi -> openApi.getPaths().values().stream()
                .filter(pathItem -> pathItem.getPatch() != null)
                .flatMap(pathItem -> pathItem.readOperations().stream())
                .filter(operation -> operation.getRequestBody() != null
                        && operation.getRequestBody().getContent().containsKey("application/merge-patch+json"))
                .forEach(operation -> {
                    String ref = "Dto_Update";
                    if (operation.getTags().get(0).toLowerCase().contains("admin")) {
                        ref = "Dto_AdminUpdate";
                    }
                    operation.getRequestBody()
                            .required(false)
                            .getContent()
                            .replace("application/merge-patch+json", new MediaType()
                                    .schema(new Schema<>()
                                                    .$ref("#/components/schemas/"
                                                                  + operation.getOperationId().replaceAll(
                                                            "patch|_\\d", "")
                                                                  + ref)));
                });
    }

    @Bean
    @ConditionalOnProperty(name = "spring.profiles.active", havingValue = "dev")
    public OpenApiCustomiser loginRequestExample() {
        return openApi -> openApi.getPaths().values().stream()
                .filter(pathItem -> pathItem.getPost() != null)
                .flatMap(pathItem -> pathItem.readOperations().stream())
                .filter(operation -> operation.getOperationId().equals("login"))
                .forEach(operation -> operation.getRequestBody()
                        .getContent()
                        .get("application/json")
                        .addExamples("", new Example()
                                .value("{\n  \"username\": \"" + systemProperties.getAdminUserName() + "1" + "\",\n"
                                               + "  \"password\": \"" + systemProperties.getAdminPassword() + "\"\n}")));
    }

    @Bean
    @ConditionalOnProperty(name = "spring.profiles.active", havingValue = "dev")
    public OpenApiCustomiser adminLoginRequestExample() {
        return openApi -> openApi.getPaths().values().stream()
                .filter(pathItem -> pathItem.getPost() != null)
                .flatMap(pathItem -> pathItem.readOperations().stream())
                .filter(operation -> operation.getOperationId().equals("adminLogin"))
                .forEach(operation -> operation.getRequestBody()
                        .getContent()
                        .get("application/json")
                        .addExamples("", new Example()
                                .value("{\n  \"username\": \"" + systemProperties.getAdminUserName() + "\",\n"
                                               + "  \"password\": \"" + systemProperties.getAdminPassword() + "\",\n"
                                               + "  \"secretKey\": \"" + systemProperties.getSecretKey() + "\"\n}")));
    }

    @Bean
    public OpenApiCustomiser sectionFilterParameters() {
        String in = ParameterIn.QUERY.toString();
        Schema<String> schema = new Schema<String>().type("string");
        String dot = KEY_SEPARATOR;

        List<Parameter> parameterList = new ArrayList<>();
        parameterList.add(new Parameter().in(in).required(true)
                                  .name(Section_.TERM + dot + Term_.TERM_NAME + "["
                                                + EQUALS_IGNORE_CASE + "]")
                                  .schema(new Schema<String>().type("string").example("spring semester 2022")));
        parameterList.add(new Parameter().in(in).required(true)
                                  .name(Section_.COURSE + dot + Course_.SUBJECT + dot + Subject_.SUBJECT_ACRONYM
                                                + "[" + EQUALS_IGNORE_CASE + "]")
                                  .schema(new Schema<String>().type("string").example("abm")));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.COURSE + dot + Course_.COURSE_NAME
                                                + "[" + LIKE_IGNORE_CASE + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.COURSE + dot + Course_.COURSE_CODE
                                                + "[" + LIKE_IGNORE_CASE + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.COURSE + dot + Course_.COURSE_NUMBER));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.COURSE + dot + Course_.COURSE_NUMBER
                                                + "[" + GREATER_THAN_OR_EQUAL + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.COURSE + dot + Course_.COURSE_NUMBER
                                                + "[" + LESS_THAN_OR_EQUAL + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.SECTION_STATUS
                                                + "[" + EQUALS_IGNORE_CASE + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.MEETING_TIME_START));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.MEETING_TIME_START
                                                + "[" + GREATER_THAN + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.MEETING_TIME_START
                                                + "[" + LESS_THAN + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.MEETING_TIME_START
                                                + "[" + GREATER_THAN_OR_EQUAL + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.MEETING_TIME_START
                                                + "[" + LESS_THAN_OR_EQUAL + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.MEETING_TIME_END));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.MEETING_TIME_END
                                                + "[" + GREATER_THAN + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.MEETING_TIME_END
                                                + "[" + LESS_THAN + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.MEETING_TIME_END
                                                + "[" + GREATER_THAN_OR_EQUAL + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.MEETING_TIME_END
                                                + "[" + LESS_THAN_OR_EQUAL + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.MEETING_DAYS
                                                + "[" + EQUALS_IGNORE_CASE + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.MEETING_DAYS
                                                + "[" + NOT_EQUAL_IGNORE_CASE + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.INSTRUCTOR + dot + Instructor_.USER + dot + User_.LAST_NAME
                                                + "[" + EQUALS_IGNORE_CASE + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.INSTRUCTOR + dot + Instructor_.USER + dot + User_.LAST_NAME
                                                + "[" + STARTS_WITH_IGNORE_CASE + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.INSTRUCTOR + dot + Instructor_.USER + dot + User_.LAST_NAME
                                                + "[" + LIKE_IGNORE_CASE + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.COURSE + dot + Course_.COURSE_UNIT));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.COURSE + dot + Course_.COURSE_UNIT
                                                + "[" + GREATER_THAN + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.COURSE + dot + Course_.COURSE_UNIT
                                                + "[" + LESS_THAN + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.COURSE + dot + Course_.COURSE_UNIT
                                                + "[" + GREATER_THAN_OR_EQUAL + "]"));
        parameterList.add(new Parameter().in(in).schema(schema).required(false)
                                  .name(Section_.COURSE + dot + Course_.COURSE_UNIT
                                                + "[" + LESS_THAN_OR_EQUAL + "]"));
        parameterList.add(new Parameter()
                                  .in(in)
                                  .schema(new Schema<>().type("object"))
                                  .required(false)
                                  .example("{\n  \n}")
                                  .name("parameters"));

        return openApi -> openApi.getPaths().forEach((key, value) -> {
            if (SectionController.FILTER_URLS.contains(key) && value.getGet() != null) {
                parameterList.forEach(value.getGet()::addParametersItem);
            }
        });
    }

    @Bean
    public OpenApiCustomiser dynamicFilterParameters() {
        final String adminUrl = "/api/v1/admin/";

        String in = ParameterIn.QUERY.toString();
        Schema<String> schema = new Schema<String>().type("string");
        String dot = KEY_SEPARATOR;

        Parameter object = new Parameter().in(in).schema(new Schema<>().type("object"))
                .required(false).example("{\n  \n}").name("parameters");

        Parameter subject = new Parameter().in(in).schema(schema).required(false)
                .name(Subject_.DEPARTMENT + dot + Department_.DEPARTMENT_NAME + "[" + EQUALS_IGNORE_CASE + "]")
                .example("Agribusiness and Food Industry Management/Agricultural Science");
        Parameter instructor = new Parameter().in(in).schema(schema).required(false)
                .name(Instructor_.DEPARTMENT + dot + Department_.DEPARTMENT_NAME + "[" + EQUALS_IGNORE_CASE + "]")
                .example("Agribusiness and Food Industry Management/Agricultural Science");
        Parameter section1 = new Parameter().in(in).schema(schema).required(false)
                .name(Section_.COURSE + dot + Course_.SUBJECT
                              + dot + Subject_.SUBJECT_ACRONYM
                              + "[" + EQUALS_IGNORE_CASE + "]")
                .example("abm");
        Parameter section2 = new Parameter().in(in).schema(schema).required(false)
                .name(Section_.TERM + dot + Term_.TERM_NAME + "[" + EQUALS_IGNORE_CASE + "]")
                .example("spring semester 2022");
        Parameter section3 = new Parameter().in(in).schema(schema).required(false)
                .name(Section_.ROOM + dot + Room_.ROOM_NUMBER)
                .example("3");
        Parameter section4 = new Parameter().in(in).schema(schema).required(false)
                .name(Section_.ROOM + dot + Room_.BUILDING + dot + Building_.BUILDING_NUMBER)
                .example("1");
        Parameter section5 = new Parameter().in(in).schema(schema).required(false)
                .name(Section_.INSTRUCTOR + dot + Instructor_.USER + dot
                              + User_.LAST_NAME + "[" + EQUALS_IGNORE_CASE + "]")
                .example("Hatchel");
        Parameter section6 = new Parameter().in(in).schema(schema).required(false)
                .name(Section_.INSTRUCTOR + dot + Instructor_.USER + dot
                              + User_.FIRST_NAME + "[" + EQUALS_IGNORE_CASE + "]")
                .example("Krik");
        Parameter student = new Parameter().in(in).schema(schema).required(false)
                .name(Student_.USER + dot + User_.USERNAME + "[" + EQUALS_IGNORE_CASE + "]")
                .example("nathanieldoak");
        Parameter course = new Parameter().in(in).schema(schema).required(false)
                .name(Course_.SUBJECT + dot + Subject_.SUBJECT_ACRONYM + "[" + EQUALS_IGNORE_CASE + "]")
                .example("abm");
        Parameter department = new Parameter().in(in).schema(schema).required(false)
                .name(Department_.COLLEGE + dot + College_.COLLEGE_NAME + "[" + EQUALS_IGNORE_CASE + "]")
                .example("College of Business Administration");
        Parameter room = new Parameter().in(in).schema(schema).required(false)
                .name(Room_.BUILDING + dot + Building_.BUILDING_NUMBER)
                .example("1");
        Parameter enrollment1 = new Parameter().in(in).schema(schema).required(false)
                .name(Enrollment_.STUDENT + dot + Student_.ID);
        Parameter enrollment2 = new Parameter().in(in).schema(schema).required(false)
                .name(Enrollment_.SECTION + dot + Section_.ID);
        Parameter enrollment3 = new Parameter().in(in).schema(schema).required(false)
                .name(Enrollment_.SECTION + dot + Section_.TERM + dot + Term_.TERM_NAME)
                .example("Spring Semester 2022");
        Parameter enrollment4 = new Parameter().in(in).schema(schema).required(false)
                .name(Enrollment_.STUDENT + dot + Student_.USER + dot + User_.FIRST_NAME)
                .example("Nathaniel");
        Parameter enrollment5 = new Parameter().in(in).schema(schema).required(false)
                .name(Enrollment_.STUDENT + dot + Student_.USER + dot + User_.LAST_NAME)
                .example("Doak");

        return openApi -> openApi.getPaths().forEach((key, value) -> {
            if (value.getGet() != null) {
                switch (key) {
                    case adminUrl + "subjects":
                    case "/api/v1/subjects":
                    case adminUrl + "subjects" + "/page":
                    case adminUrl + "subjects" + "/slice":
                        value.getGet().addParametersItem(subject);
                        value.getGet().addParametersItem(object);
                        break;
                    case adminUrl + "instructors":
                    case adminUrl + "instructors" + "/page":
                    case adminUrl + "instructors" + "/slice":
                        value.getGet().addParametersItem(instructor);
                        value.getGet().addParametersItem(object);
                        break;
                    case adminUrl + "sections":
                    case adminUrl + "sections" + "/page":
                    case adminUrl + "sections" + "/slice":
                        value.getGet().addParametersItem(section1);
                        value.getGet().addParametersItem(section2);
                        value.getGet().addParametersItem(section3);
                        value.getGet().addParametersItem(section4);
                        value.getGet().addParametersItem(section5);
                        value.getGet().addParametersItem(section6);
                        value.getGet().addParametersItem(object);
                        break;
                    case adminUrl + "students":
                    case adminUrl + "students" + "/page":
                    case adminUrl + "students" + "/slice":
                        value.getGet().addParametersItem(student);
                        value.getGet().addParametersItem(object);
                        break;
                    case adminUrl + "courses":
                    case adminUrl + "courses" + "/page":
                    case adminUrl + "courses" + "/slice":
                        value.getGet().addParametersItem(course);
                        value.getGet().addParametersItem(object);
                        break;
                    case adminUrl + "departments":
                    case adminUrl + "departments" + "/page":
                    case adminUrl + "departments" + "/slice":
                        value.getGet().addParametersItem(department);
                        value.getGet().addParametersItem(object);
                        break;
                    case adminUrl + "rooms":
                    case adminUrl + "rooms" + "/page":
                    case adminUrl + "rooms" + "/slice":
                        value.getGet().addParametersItem(room);
                        value.getGet().addParametersItem(object);
                        break;
                    case adminUrl + "enrollments":
                    case adminUrl + "enrollments" + "/page":
                    case adminUrl + "enrollments" + "/slice":
                        value.getGet().addParametersItem(enrollment1);
                        value.getGet().addParametersItem(enrollment2);
                        value.getGet().addParametersItem(enrollment3);
                        value.getGet().addParametersItem(enrollment4);
                        value.getGet().addParametersItem(enrollment5);
                        value.getGet().addParametersItem(object);
                        break;
                    case "/api/v1/students/{studentId}/sections":
                    case "/api/v1/students/{studentId}/sections/page":
                    case "/api/v1/students/{studentId}/sections/slice":
                        value.getGet().addParametersItem(enrollment3);
                        value.getGet().addParametersItem(object);
                        break;
                }
            }
        });
    }

    @Bean
    @ConditionalOnProperty(name = "spring.jackson.property-naming-strategy", havingValue = "KEBAB_CASE")
    public OpenApiCustomiser parametersKebabCaseNamingStrategy() {
        final String adminUrl = "/api/v1/admin/";
        Set<String> filter_urls = new HashSet<>(SectionController.FILTER_URLS);
        filter_urls.add(adminUrl + "sections");
        filter_urls.add(adminUrl + "sections/page");
        filter_urls.add(adminUrl + "sections/slice");
        filter_urls.add(adminUrl + "enrollments");
        filter_urls.add(adminUrl + "enrollments/page");
        filter_urls.add(adminUrl + "enrollments/slice");
        filter_urls.add(adminUrl + "departments");
        filter_urls.add(adminUrl + "departments/page");
        filter_urls.add(adminUrl + "departments/slice");
        filter_urls.add(adminUrl + "rooms");
        filter_urls.add(adminUrl + "rooms/page");
        filter_urls.add(adminUrl + "rooms/slice");
        filter_urls.add(adminUrl + "instructors");
        filter_urls.add(adminUrl + "instructors/page");
        filter_urls.add(adminUrl + "instructors/slice");
        filter_urls.add(adminUrl + "subjects");
        filter_urls.add(adminUrl + "subjects/page");
        filter_urls.add(adminUrl + "subjects/slice");
        filter_urls.add(adminUrl + "courses");
        filter_urls.add(adminUrl + "courses/page");
        filter_urls.add(adminUrl + "courses/slice");

        return openApi -> openApi.getPaths().entrySet().stream()
                .filter(entry -> filter_urls.contains(entry.getKey()))
                .flatMap(entry -> entry.getValue().readOperations().stream())
                .filter(operation -> operation.getParameters() != null)
                .flatMap(operation -> operation.getParameters().stream())
                .filter(parameter -> parameter.getName() != null)
                .forEach(parameter ->
                                 parameter.setName(
                                         CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_HYPHEN, parameter.getName()))
                );
    }


    // configuration for Springdoc to pickup Spring ObjectMapper (in case of changing property naming strategy)
    @Bean
    public ModelResolver modelResolver(ObjectMapper objectMapper) {
        return new ModelResolver(objectMapper);
    }
}
