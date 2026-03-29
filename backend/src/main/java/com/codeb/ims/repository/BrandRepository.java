package com.codeb.ims.repository;

import com.codeb.ims.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    List<Brand> findAllByIsActiveTrue();
    List<Brand> findAllByIsActiveTrueAndChain_ChainId(Long chainId);
    List<Brand> findAllByIsActiveTrueAndChain_Group_GroupId(Long groupId);
    Optional<Brand> findByBrandIdAndIsActiveTrue(Long brandId);
    long countByIsActiveTrue();
    boolean existsByChain_ChainIdAndIsActiveTrue(Long chainId);
}