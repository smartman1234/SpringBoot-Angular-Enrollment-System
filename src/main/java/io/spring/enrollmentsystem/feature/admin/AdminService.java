package io.spring.enrollmentsystem.feature.admin;

import io.spring.enrollmentsystem.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    @Transactional(readOnly = true)
    public Admin getAdminById(UUID adminId) {
        return adminRepository.findById(adminId).orElseThrow(
                () -> new ResourceNotFoundException(Admin.class, adminId));
    }
}
