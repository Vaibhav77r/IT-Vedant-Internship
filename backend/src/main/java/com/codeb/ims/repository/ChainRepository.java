package com.codeb.ims.repository;

import com.codeb.ims.entity.Chain;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChainRepository extends JpaRepository<Chain, Long> {
    boolean existsByGstnNo(String gstnNo);
    boolean existsByGstnNoAndChainIdNot(String gstnNo, Long chainId);
    List<Chain> findAllByIsActiveTrue();
    List<Chain> findAllByIsActiveTrueAndGroup_GroupId(Long groupId);
    Optional<Chain> findByChainIdAndIsActiveTrue(Long chainId);
    long countByIsActiveTrue();
}