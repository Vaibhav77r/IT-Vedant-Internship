package com.codeb.ims.repository;

import com.codeb.ims.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findAllByIsActiveTrue();
    List<Zone> findAllByIsActiveTrueAndBrand_BrandId(Long brandId);
    List<Zone> findAllByIsActiveTrueAndBrand_Chain_ChainId(Long chainId);
    List<Zone> findAllByIsActiveTrueAndBrand_Chain_Group_GroupId(Long groupId);
    Optional<Zone> findByZoneIdAndIsActiveTrue(Long zoneId);
    long countByIsActiveTrue();
    boolean existsByBrand_BrandIdAndIsActiveTrue(Long brandId);
}