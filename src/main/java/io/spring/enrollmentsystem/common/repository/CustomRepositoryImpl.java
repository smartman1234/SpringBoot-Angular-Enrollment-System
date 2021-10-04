package io.spring.enrollmentsystem.common.repository;

import io.spring.enrollmentsystem.common.annotation.QuerySelectHint;
import io.spring.enrollmentsystem.feature.section.Section_;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.lang.Nullable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.persistence.NonUniqueResultException;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.From;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.ListJoin;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Selection;
import javax.persistence.metamodel.ListAttribute;
import javax.validation.ValidationException;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import static io.spring.enrollmentsystem.common.constant.SpecsConstant.KEY_SEPARATOR;
import static io.spring.enrollmentsystem.common.constant.SpecsConstant.KEY_SEPARATOR_REGEX;
import static org.springframework.data.jpa.repository.query.QueryUtils.toOrders;

/**
 * Custom repository implementation that extends SimpleJpaRepository class
 * This repository implementation allows DTO projection and JPA specification to work together
 * DTO projection works with the help of annotation @QuerySelectHint and Java reflection
 * This repository implementation is registered in @Configuration class by bean annotation
 * // @EnableJpaRepositories(repositoryBaseClass = CustomRepositoryImpl.class)
 *
 * @param <T>  - the type of the entity to handle
 * @param <ID> - the type of the entity's identifier
 */
public class CustomRepositoryImpl<T, ID> extends SimpleJpaRepository<T, ID> implements CustomRepository<T, ID> {

    private static final Logger log = LoggerFactory.getLogger(CustomRepository.class);

    private final EntityManager entityManager;

    public CustomRepositoryImpl(JpaEntityInformation<T, ?> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);
        this.entityManager = entityManager;
    }

    @Override
    @Transactional(readOnly = true)
    public <S> Optional<S> findById(Class<S> type, ID id) {
        TypedQuery<S> typedQuery = getQuery(type,
                                            (root, query, builder) -> builder.equal(root.get("id"), id),
                                            getDomainClass(),
                                            Sort.unsorted());

        List<S> results = typedQuery.getResultList();
        if (results.size() > 1) {
            throw new NonUniqueResultException();
        } else {
            return results.stream().findFirst();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public <S> Page<S> findAll(Class<S> type, @Nullable Specification<T> spec, Pageable pageable) {
        TypedQuery<S> query = getQuery(type, spec, pageable);
        return isUnpaged(pageable) ? new PageImpl<>(query.getResultList())
                : readExtraPage(query, getDomainClass(), pageable, spec);
    }

    @Override
    @Transactional(readOnly = true)
    public <S> Slice<S> findAllSlice(Class<S> type, @Nullable Specification<T> spec, Pageable pageable) {
        TypedQuery<S> query = getQuery(type, spec, pageable);
        return isUnpaged(pageable) ? new SliceImpl<>(query.getResultList())
                : readSlice(query, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public <S> List<S> findAll(Class<S> type, @Nullable Specification<T> spec) {
        return getQuery(type, spec, Sort.unsorted()).getResultList();
    }

    protected <S> Slice<S> readSlice(TypedQuery<S> query, Pageable pageable) {
        int pageSize = 0;


        if (pageable.isPaged()) {
            pageSize = pageable.getPageSize();
            query.setFirstResult((int) pageable.getOffset());
            query.setMaxResults(pageSize + 1);
        }

        List<S> resultList = query.getResultList();

        boolean hasNext = pageable.isPaged() && resultList.size() > pageSize;
        return new SliceImpl<>(hasNext ? resultList.subList(0, pageSize) : resultList, pageable, hasNext);
    }

    protected <S, U extends T> Page<S> readExtraPage(TypedQuery<S> query, final Class<U> domainClass,
                                                     Pageable pageable, @Nullable Specification<U> spec) {
        if (pageable.isPaged()) {
            query.setFirstResult((int) pageable.getOffset());
            query.setMaxResults(pageable.getPageSize());
        }

        return PageableExecutionUtils.getPage(query.getResultList(), pageable,
                                              () -> executeCountQuery(getCountQuery(spec, domainClass)));
    }

    protected <S> TypedQuery<S> getQuery(Class<S> type, @Nullable Specification<T> spec, Pageable pageable) {
        Sort sort = pageable.isPaged() ? pageable.getSort() : Sort.unsorted();
        return getQuery(type, spec, getDomainClass(), sort);
    }

    protected <S> TypedQuery<S> getQuery(Class<S> type, @Nullable Specification<T> spec, Sort sort) {
        return getQuery(type, spec, getDomainClass(), sort);
    }

    @SuppressWarnings("unchecked cast")
    protected <S, U extends T> TypedQuery<S> getQuery(Class<S> type,
                                                      @Nullable Specification<U> spec,
                                                      Class<U> domainClass,
                                                      Sort sort) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<S> query = builder.createQuery(type);
        Root<U> root = applySpecificationToCriteria(spec, domainClass, query);

        if (type.equals(root.getJavaType())) {
            query.select((Root<S>) root);
        } else {
            List<String> fieldNameList = getClassFieldNames(type);

            if (!qualifiedClass(type, fieldNameList.size())) {
                log.error("Parsing path/expression error for " + type + "!");
                throw new ValidationException("Parsing path/expression error for " + type + "!");
            }

            List<Selection<?>> listOfSelection = new ArrayList<>();
            for (String fieldName : fieldNameList) {
                listOfSelection.add(findExpression(root, fieldName, JoinType.INNER));
            }

            query.select(builder.construct(
                    type, listOfSelection.toArray(new Selection<?>[0])
            ));
        }

        if (sort.isSorted()) {
            query.orderBy(toOrders(sort, root, builder));
        }

        return applyRepositoryMethodMetadata(entityManager.createQuery(query));
    }

    private <S> boolean qualifiedClass(Class<S> clazz, int classFieldSize) {
        for (Constructor<?> constructor : clazz.getDeclaredConstructors()) {
            if (constructor.getParameterCount() == classFieldSize) {
                return true;
            }
        }
        return false;
    }

    private <S> List<String> getClassFieldNames(Class<S> clazz) {
        List<String> fieldNameList = new ArrayList<>();

        for (Field field : clazz.getDeclaredFields()) {
            if (field.trySetAccessible()) {
                if (field.isAnnotationPresent(QuerySelectHint.class)) {
                    fieldNameList.add(field.getAnnotation(QuerySelectHint.class).value());
                } else {
                    String fieldName = field.getName();
                    if (fieldName.endsWith("Id") && field.getType().equals(UUID.class)) {
                        String[] fieldTokens = fieldName.split("(?=\\p{Upper})");
                        fieldName = String.join(KEY_SEPARATOR, fieldTokens).toLowerCase();
                    }

                    fieldNameList.add(fieldName);
//                    fieldNameList.add(field.getName());
                }
            } else {
                log.error("Parsing path/expression error for " + clazz + "!");
                throw new ValidationException("Parsing path/expression error for " + clazz + "!");
            }
        }
        return fieldNameList;
    }

    private <U extends T> Expression<?> findExpression(Root<U> root, String key, JoinType joinType) {
        if (key == null || root == null) {
            log.error("Parsing path/expression error!");
            throw new ValidationException("Parsing path/expression error!");
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
            log.error(String.valueOf(ex));
//            throw new ValidationException(ex + " - " + root.getJavaType());
            throw ex;
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

    private <S, U extends T> Root<U> applySpecificationToCriteria(@Nullable Specification<U> spec,
                                                                  Class<U> domainClass,
                                                                  CriteriaQuery<S> query) {
        Assert.notNull(domainClass, "Domain class must not be null!");
        Assert.notNull(query, "CriteriaQuery must not be null!");

        Root<U> root = query.from(domainClass);

        if (spec == null) {
            return root;
        }


        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        Predicate predicate = spec.toPredicate(root, query, builder);

        if (predicate != null) {
            query.where(predicate);
        }

        return root;
    }

    private <S> TypedQuery<S> applyRepositoryMethodMetadata(TypedQuery<S> query) {

        if (getRepositoryMethodMetadata() == null) {
            return query;
        }

        LockModeType type = getRepositoryMethodMetadata().getLockModeType();
        TypedQuery<S> toReturn = type == null ? query : query.setLockMode(type);

        applyQueryHints(toReturn);

        return toReturn;
    }

    private static long executeCountQuery(TypedQuery<Long> query) {

        Assert.notNull(query, "TypedQuery must not be null!");

        List<Long> totals = query.getResultList();
        long total = 0L;

        for (Long element : totals) {
            total += element == null ? 0 : element;
        }

        return total;
    }

    private void applyQueryHints(Query query) {
        getQueryHints().withFetchGraphs(entityManager).forEach(query::setHint);
    }

    private static boolean isUnpaged(Pageable pageable) {
        return pageable.isUnpaged();
    }
}
