package io.spring.enrollmentsystem.configuration;

import com.google.common.base.CaseFormat;
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
public class PageableSortNamingFilter extends OncePerRequestFilter {

    private static final String SORT_PARAM_KEY = "sort";

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getParameter("sort") == null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String sortParamValue = request.getParameter(SORT_PARAM_KEY);

        if (!sortParamValue.contains("-") && !sortParamValue.contains("_")) {
            filterChain.doFilter(request, response);
            return;
        }

        Map<String, String[]> formattedParams = new ConcurrentHashMap<>();

        for (String param : request.getParameterMap().keySet()) {
            formattedParams.put(param, request.getParameterValues(param));
        }

        String formattedSortParamValue = sortParamValue;

        if (sortParamValue.contains("-")) {
            formattedSortParamValue = CaseFormat.LOWER_HYPHEN.to(CaseFormat.LOWER_CAMEL, sortParamValue);
        } else if(sortParamValue.contains("_")) {
            formattedSortParamValue = CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, sortParamValue);
        }

        formattedParams.put(SORT_PARAM_KEY, new String[]{formattedSortParamValue});

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
