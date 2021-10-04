package io.spring.enrollmentsystem.common.constant;

import java.util.Set;
import java.util.regex.Pattern;

public final class SpecsConstant {
    public static final String EQUALS = "eq";
    public static final String EQUALS_IGNORE_CASE = "eqIc";
    public static final String NOT_EQUAL = "neq";
    public static final String NOT_EQUAL_IGNORE_CASE = "neqIc";
    public static final String LIKE = "like";
    public static final String LIKE_IGNORE_CASE = "likeIc";
    public static final String STARTS_WITH = "sw";
    public static final String STARTS_WITH_IGNORE_CASE = "swIc";
    public static final String ENDS_WITH = "ew";
    public static final String ENDS_WITH_IGNORE_CASE = "ewIc";
    public static final String IN = "in";
    public static final String IN_IGNORE_CASE = "inIc";
    public static final String NOT_IN = "ni";
    public static final String NOT_IN_IGNORE_CASE = "niIc";
    public static final String GREATER_THAN = "gt";
    public static final String LESS_THAN = "lt";
    public static final String GREATER_THAN_OR_EQUAL = "gte";
    public static final String LESS_THAN_OR_EQUAL = "lte";
    public static final Set<String> OPERATORS = Set.of(EQUALS, EQUALS_IGNORE_CASE, NOT_EQUAL, NOT_EQUAL_IGNORE_CASE,
                                                       LIKE, LIKE_IGNORE_CASE, STARTS_WITH, STARTS_WITH_IGNORE_CASE,
                                                       ENDS_WITH, ENDS_WITH_IGNORE_CASE, IN, IN_IGNORE_CASE,
                                                       NOT_IN, NOT_IN_IGNORE_CASE, GREATER_THAN, LESS_THAN,
                                                       GREATER_THAN_OR_EQUAL, LESS_THAN_OR_EQUAL);
    public static final String SPECIAL_FILTER_KEY = "specialFilter";
    public static final String IN_SEPARATOR = ",";
    public static final String KEY_SEPARATOR = ".";
    public static final String AND_SEPARATOR = "[and]";
    public static final String AND_SEPARATOR_GROUP = "[[and]]";
    public static final String OR_SEPARATOR = "[or]";
    public static final String OR_SEPARATOR_GROUP = "[[or]]";
    public static final String IN_SEPARATOR_REGEX = Pattern.quote(IN_SEPARATOR);
    public static final String KEY_SEPARATOR_REGEX = Pattern.quote(KEY_SEPARATOR);
    public static final String AND_REGEX = Pattern.quote(AND_SEPARATOR);
    public static final String AND_GROUP_REGEX = Pattern.quote(AND_SEPARATOR_GROUP);
    public static final String OR_REGEX = Pattern.quote(OR_SEPARATOR);
    public static final String OR_GROUP_REGEX = Pattern.quote(OR_SEPARATOR_GROUP);
    public static final String[] PAGEABLE_PARAMS = {"sort", "size", "page"};
}
