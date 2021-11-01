package io.spring.enrollmentsystem.common.configuration;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import lombok.NonNull;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class LoginFailAttemptCache {
    private final int MAX_ATTEMPT;
    private final LoadingCache<String, Integer> attemptsCache;

    public LoginFailAttemptCache(SystemProperties systemProperties) {
        this.MAX_ATTEMPT = systemProperties.getLoginAttemptLimit();

        this.attemptsCache = CacheBuilder
                .newBuilder()
                .expireAfterWrite(1, TimeUnit.DAYS)
                .build(new CacheLoader<>() {
                    @Override
                    public Integer load(@NonNull String key) {
                        return 0;
                    }
                });
    }

    public int getMaxAttempt() {
        return MAX_ATTEMPT;
    }

    public LoadingCache<String, Integer> getAttemptsCache() {
        return attemptsCache;
    }
}
