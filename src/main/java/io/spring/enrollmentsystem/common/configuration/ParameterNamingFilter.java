package io.spring.enrollmentsystem.common.configuration;

import com.google.common.base.CaseFormat;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
@RequiredArgsConstructor
public class ParameterNamingFilter extends OncePerRequestFilter {

    private static final String SORT_PARAM_KEY = "sort";

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getParameterMap().isEmpty();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        Map<String, String[]> formattedParams = new ConcurrentHashMap<>();

        for (String paramKey : request.getParameterMap().keySet()) {
            String[] paramValues = request.getParameterValues(paramKey);
            if (paramKey.contains("-")) {
                paramKey = CaseFormat.LOWER_HYPHEN.to(CaseFormat.LOWER_CAMEL, paramKey);
            } else if (paramKey.contains("_")) {
                paramKey = CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, paramKey);
            }
            formattedParams.put(paramKey, paramValues);
        }

        String[] sortParamValues = formattedParams.get(SORT_PARAM_KEY);

        if (sortParamValues != null && sortParamValues.length > 0) {
            for (int i = 0; i < sortParamValues.length; i++) {
                if (sortParamValues[i].contains("-")) {
                    sortParamValues[i] = CaseFormat.LOWER_HYPHEN.to(CaseFormat.LOWER_CAMEL, sortParamValues[i]);
                } else if (sortParamValues[i].contains("_")) {
                    sortParamValues[i] = CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, sortParamValues[i]);
                }
            }
            formattedParams.put(SORT_PARAM_KEY, sortParamValues);
        }

        filterChain.doFilter(new HttpServletRequestWrapper(request) {
            @Override
            public String getParameter(String name) {
                return formattedParams.containsKey(name) ? formattedParams.get(name)[0] : null;
            }

            @Override
            public Enumeration<String> getParameterNames() {
                return Collections.enumeration(formattedParams.keySet());
            }

            @Override
            public String[] getParameterValues(String name) {
                return formattedParams.get(name);
            }

            @Override
            public Map<String, String[]> getParameterMap() {
                return formattedParams;
            }
        }, response);
    }
}
