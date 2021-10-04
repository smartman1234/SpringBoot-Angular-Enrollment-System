package io.spring.enrollmentsystem.common.service;

import com.google.common.base.CaseFormat;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.From;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static io.spring.enrollmentsystem.common.constant.SpecsConstant.AND_GROUP_REGEX;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.AND_REGEX;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.AND_SEPARATOR;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.ENDS_WITH;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.ENDS_WITH_IGNORE_CASE;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.EQUALS;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.EQUALS_IGNORE_CASE;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.GREATER_THAN;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.GREATER_THAN_OR_EQUAL;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.IN;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.IN_IGNORE_CASE;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.IN_SEPARATOR_REGEX;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.KEY_SEPARATOR_REGEX;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.LESS_THAN;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.LESS_THAN_OR_EQUAL;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.LIKE;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.LIKE_IGNORE_CASE;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.NOT_EQUAL;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.NOT_EQUAL_IGNORE_CASE;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.NOT_IN;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.NOT_IN_IGNORE_CASE;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.OPERATORS;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.OR_GROUP_REGEX;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.OR_REGEX;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.OR_SEPARATOR;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.PAGEABLE_PARAMS;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.SPECIAL_FILTER_KEY;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.STARTS_WITH;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.STARTS_WITH_IGNORE_CASE;

/**
 * Generic specification builder
 */
@Service
@Slf4j
public class SpecificationServiceImpl implements SpecificationService {

    @Override
    public <T> Specification<T> getSpecifications(MultiValueMap<String, String> parameters) {
        for (String paramKeys : PAGEABLE_PARAMS) {
            parameters.remove(paramKeys);
        }
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            for (Map.Entry<String, List<String>> entry : parameters.entrySet()) {
                if (entry.getKey().equals(SPECIAL_FILTER_KEY)) {
                    specialFilterQuery(root, builder, predicates, entry.getValue());
                    continue;
                }

                String[] keyOperatorTokens = entry.getKey().split("[\\[\\]]", 3);
                String operator = EQUALS;
                String key = keyOperatorTokens[0];
                if (keyOperatorTokens.length > 1 && OPERATORS.contains(keyOperatorTokens[1])) {
                    operator = keyOperatorTokens[1];
                }

                Expression<?> expression = findExpression(root, key, JoinType.INNER);
                if (expression == null) {
                    continue;
                }

                for (String entryValue : entry.getValue()) {
                    Predicate newPredicate = buildPredicate(builder, expression,
                                                            expression.getJavaType(),
                                                            operator, entryValue);

                    if (newPredicate != null) {
                        predicates.add(newPredicate);
                    }
                }
            }

            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private <T> void specialFilterQuery(Root<T> root, CriteriaBuilder builder,
                                        List<Predicate> predicates, List<String> listOfQuery) {
        for (String query : listOfQuery) {
            Predicate finalGroupQuery = null;
            for (String group : query.split("(?=" + AND_GROUP_REGEX + "|" + OR_GROUP_REGEX + ")")) {
                String[] groupTokens = group.split("(?<=" + AND_GROUP_REGEX + "|"
                                                           + OR_GROUP_REGEX + ")", 2);
                String groupOperator = "";
                if (groupTokens.length > 1) {
                    groupOperator = groupTokens[0];
                    group = groupTokens[1];
                } else {
                    group = groupTokens[0];
                }

                Predicate finalSubQuery = null;
                for (String subQuery : group.split("(?=" + AND_REGEX + "|" + OR_REGEX + ")")) {
                    String[] subParameter = subQuery.split("=", 2);
                    if (subParameter.length == 1) {
                        continue;
                    }
                    String[] subTokens = subParameter[0].split("(?<=" + AND_REGEX + "|" + OR_REGEX + ")", 2);
                    String subOperator = "";
                    String keyCompound = "";
                    if (subTokens.length > 1) {
                        subOperator = subTokens[0];
                        keyCompound = subTokens[1];
                    } else {
                        keyCompound = subTokens[0];
                    }

                    String[] keyOperatorTokens = keyCompound.split("[\\[\\]]", 3);
                    String operator = EQUALS;
                    String key = toLowerCamel(keyOperatorTokens[0]);
                    String value = subParameter[1];
                    if (keyOperatorTokens.length > 1 && OPERATORS.contains(keyOperatorTokens[1])) {
                        operator = keyOperatorTokens[1];
                    }

                    Expression<?> expression = findExpression(root, key, JoinType.INNER);
                    if (expression == null) {
                        continue;
                    }

                    Predicate currentSubQuery = buildPredicate(builder, expression,
                                                               expression.getJavaType(),
                                                               operator, value);

                    if (currentSubQuery == null) {
                        continue;
                    }

                    if (finalSubQuery != null) {
                        if (subOperator.equals(OR_SEPARATOR)) {
                            finalSubQuery = builder.or(finalSubQuery, currentSubQuery);
                        } else if (subOperator.equals(AND_SEPARATOR)) {
                            finalSubQuery = builder.and(finalSubQuery, currentSubQuery);
                        }
                    } else {
                        finalSubQuery = currentSubQuery;
                    }
                }

                if (finalSubQuery == null) {
                    continue;
                }

                if (finalGroupQuery != null) {
                    if (groupOperator.equals(AND_SEPARATOR)) {
                        finalGroupQuery = builder.and(finalGroupQuery, finalSubQuery);
                    } else if (groupOperator.equals(OR_SEPARATOR)) {
                        finalGroupQuery = builder.or(finalGroupQuery, finalSubQuery);
                    }
                } else {
                    finalGroupQuery = finalSubQuery;
                }
            }

            if (finalGroupQuery != null) {
                predicates.add(finalGroupQuery);
            }
        }
    }

    @SuppressWarnings("unchecked cast")
    private Predicate buildPredicate(CriteriaBuilder builder, Expression<?> expression,
                                     Class<?> type, String operator, String value) {
        switch (operator) {
            case EQUALS:
                return builder.equal(expression, parseToType(type, value));
            case EQUALS_IGNORE_CASE:
                return builder.equal(builder.lower(expression.as(String.class)),
                                     value.toLowerCase());
            case NOT_EQUAL:
                return builder.notEqual(expression, parseToType(type, value));
            case NOT_EQUAL_IGNORE_CASE:
                return builder.notEqual(builder.lower(expression.as(String.class)),
                                        value.toLowerCase());
            case LIKE:
                return builder.like(expression.as(String.class), "%" + value + "%");
            case LIKE_IGNORE_CASE:
                return builder.like(builder.lower(expression.as(String.class)),
                                    "%" + value.toLowerCase() + "%");
            case STARTS_WITH:
                return builder.like(expression.as(String.class), value + "%");
            case STARTS_WITH_IGNORE_CASE:
                return builder.like(builder.lower(expression.as(String.class)),
                                    value.toLowerCase() + "%");
            case ENDS_WITH:
                return builder.like(expression.as(String.class), "%" + value);
            case ENDS_WITH_IGNORE_CASE:
                return builder.like(builder.lower(expression.as(String.class)),
                                    "%" + value.toLowerCase());
            case IN:
                return expression.in(parseToType(type, value.split(IN_SEPARATOR_REGEX)));
            case IN_IGNORE_CASE:
                return builder.lower(expression.as(String.class))
                        .in(castToLowerCaseList(value.split(IN_SEPARATOR_REGEX)));
            case NOT_IN:
                return builder.not(expression.in(parseToType(type, value.split(IN_SEPARATOR_REGEX))));
            case NOT_IN_IGNORE_CASE:
                return builder.not(builder.lower(expression.as(String.class))
                                           .in(castToLowerCaseList(value.split(IN_SEPARATOR_REGEX))));
            case GREATER_THAN:
                if (Number.class.isAssignableFrom(type)) {
                    return builder.gt((Expression<Number>) expression,
                                      (Number) parseToType(type, value));
                } else if (LocalTime.class.isAssignableFrom(type)) {
                    return builder.greaterThan(expression.as(LocalTime.class),
                                               (LocalTime) parseToType(type, value));
                } else if (LocalDate.class.isAssignableFrom(type)) {
                    return builder.greaterThan(expression.as(LocalDate.class),
                                               (LocalDate) parseToType(type, value));
                }
            case LESS_THAN:
                if (Number.class.isAssignableFrom(type)) {
                    return builder.lt((Expression<Number>) expression,
                                      (Number) parseToType(type, value));
                } else if (LocalTime.class.isAssignableFrom(type)) {
                    return builder.lessThan(expression.as(LocalTime.class),
                                            (LocalTime) parseToType(type, value));
                } else if (LocalDate.class.isAssignableFrom(type)) {
                    return builder.lessThan(expression.as(LocalDate.class),
                                            (LocalDate) parseToType(type, value));
                }
            case GREATER_THAN_OR_EQUAL:
                if (Number.class.isAssignableFrom(type)) {
                    return builder.ge((Expression<Number>) expression,
                                      (Number) parseToType(type, value));
                } else if (LocalTime.class.isAssignableFrom(type)) {
                    return builder.greaterThanOrEqualTo(expression.as(LocalTime.class),
                                                        (LocalTime) parseToType(type, value));
                } else if (LocalDate.class.isAssignableFrom(type)) {
                    return builder.greaterThanOrEqualTo(expression.as(LocalDate.class),
                                                        (LocalDate) parseToType(type, value));
                }
            case LESS_THAN_OR_EQUAL:
                if (Number.class.isAssignableFrom(type)) {
                    return builder.le((Expression<Number>) expression,
                                      (Number) parseToType(type, value));
                } else if (LocalTime.class.isAssignableFrom(type)) {
                    return builder.lessThanOrEqualTo(expression.as(LocalTime.class),
                                                     (LocalTime) parseToType(type, value));
                } else if (LocalDate.class.isAssignableFrom(type)) {
                    return builder.lessThanOrEqualTo(expression.as(LocalDate.class),
                                                     (LocalDate) parseToType(type, value));
                }
            default:
                return null;
        }
    }

    private Object parseToType(Class<?> type, String value) {
        try {
            if (String.class.isAssignableFrom(type)) {
                return value;
            } else if (Integer.class.isAssignableFrom(type)) {
                return Integer.parseInt(value);
            } else if (Long.class.isAssignableFrom(type)) {
                return Long.parseLong(value);
            } else if (LocalTime.class.isAssignableFrom(type)) {
                return LocalTime.parse(value, DateTimeFormatter.ofPattern("H:m[:s]"));
            } else if (Boolean.class.isAssignableFrom(type)) {
                return Boolean.parseBoolean(value);
            } else if (LocalDate.class.isAssignableFrom(type)) {
                return LocalDate.parse(value, DateTimeFormatter.ofPattern("yyyy-M-d"));
            } else if (UUID.class.isAssignableFrom(type)) {
                return UUID.fromString(value);
            } else if (Double.class.isAssignableFrom(type)) {
                return Double.parseDouble(value);
            } else if (Float.class.isAssignableFrom(type)) {
                return Float.parseFloat(value);
            } else if (Short.class.isAssignableFrom(type)) {
                return Short.parseShort(value);
            }
        } catch (NumberFormatException | DateTimeParseException | NullPointerException ex) {
            log.error(ex.toString());
            return null;
        }

        log.error("Unsupported query type " + type + " for value " + value);
        return null;
    }

    private List<Object> parseToType(Class<?> type, String[] values) {
        List<Object> lists = new ArrayList<>();
        for (String value : values) {
            lists.add(parseToType(type, value));
        }
        return lists;
    }

    private static List<String> castToLowerCaseList(String[] values) {
        List<String> lists = new ArrayList<>();
        for (String value : values) {
            lists.add(value.toLowerCase());
        }
        return lists;
    }

    private <T> Expression<?> findExpression(Root<T> root, String key, JoinType joinType) {
        if (key == null || root == null) {
            return null;
        }

        String[] keys = key.split(KEY_SEPARATOR_REGEX);
        try {
            if (keys.length > 1) {
                Join<?, ?> join = getOrCreateJoin(root, keys[0], joinType);
                for (int i = 1; i < keys.length - 1; i++) {
                    join = getOrCreateJoin(join, keys[i], joinType);
                }
                return join.get(keys[keys.length - 1]);
            }

            return root.get(keys[keys.length - 1]);

        } catch (IllegalArgumentException | IllegalStateException ex) {
            log.error(ex.toString());
            return null;
        }
    }

    private Join<?, ?> getOrCreateJoin(From<?, ?> from, String attribute, JoinType joinType) {
        for (Join<?, ?> join : from.getJoins()) {
            if (join.getAttribute().getName().equals(attribute)
                    && join.getJoinType().equals(joinType)) {
                return join;
            }
        }

        return from.join(attribute, joinType);
    }

    private String toLowerCamel(String value) {
        if (value.contains("-")) {
            return CaseFormat.LOWER_HYPHEN.to(CaseFormat.LOWER_CAMEL, value);
        } else if (value.contains("_")) {
            return CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, value);
        }
        return value;
    }
}
