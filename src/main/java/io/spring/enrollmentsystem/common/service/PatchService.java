package io.spring.enrollmentsystem.common.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatchException;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.ValidationException;

@Service
@RequiredArgsConstructor @Slf4j
@Validated
public class PatchService {

    private final ObjectMapper objectMapper;

    public <T> T mergePatch(JsonMergePatch mergePatch, T targetBean,
                            Class<T> beanClass) throws JsonPatchException {
        return mergePatch(mergePatch, targetBean, beanClass, null);
    }

    @Valid
    public <T> T mergePatch(JsonMergePatch mergePatch, T targetBean,
                            Class<T> beanClass, Class<?> viewClass) {
        try {
            JsonMergePatch validatedMergePatch = validateMergePatch(mergePatch, targetBean, beanClass, viewClass);

            // Convert the Java bean to a JSON document
            JsonNode target = objectMapper.convertValue(targetBean, JsonNode.class);

            // Apply the JSON Merge Patch to the JSON document
            JsonNode patched = validatedMergePatch.apply(target);

            // Convert the JSON document to a Java bean and return it
            return objectMapper.convertValue(patched, beanClass);
        } catch (JsonPatchException ex) {
            throw new ValidationException(ex.getMessage());
        }
    }

    private <T> JsonMergePatch validateMergePatch(JsonMergePatch mergePatch,
                                                  T targetBean,
                                                  Class<T> beanClass,
                                                  Class<?> viewClass) throws JsonPatchException {
        if (viewClass != null) {
            ObjectMapper objectMapperWithJsonView = objectMapper.copy();
            objectMapperWithJsonView
                    .setConfig(objectMapperWithJsonView
                                       .getDeserializationConfig()
                                       .withView(viewClass))
                    .setConfig(objectMapperWithJsonView
                                       .getSerializationConfig()
                                       .withView(viewClass));

            JsonNode targetJsonView = objectMapperWithJsonView.convertValue(targetBean, JsonNode.class);
            JsonNode targetJsonViewWithFullPatch = mergePatch.apply(targetJsonView);
            T transientBean = objectMapperWithJsonView.convertValue(targetJsonViewWithFullPatch, beanClass);
            JsonNode filteredPatch = objectMapperWithJsonView.convertValue(transientBean, JsonNode.class);

            return JsonMergePatch.fromJson(filteredPatch);
        } else {
            return mergePatch;
        }
    }
}
