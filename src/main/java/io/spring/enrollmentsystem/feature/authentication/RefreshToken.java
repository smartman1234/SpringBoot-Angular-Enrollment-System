package io.spring.enrollmentsystem.feature.authentication;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

@RedisHash("RefreshToken")
@Getter @ToString @AllArgsConstructor
public class RefreshToken {

    @Id
    private final String jti;

    @Indexed
    private final String userId;

    @TimeToLive
    private final Long timeToLive;
}
