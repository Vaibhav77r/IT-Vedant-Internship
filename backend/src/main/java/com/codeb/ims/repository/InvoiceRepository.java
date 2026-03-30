package com.codeb.ims.repository;

import com.codeb.ims.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNo(Integer invoiceNo);
    boolean existsByEstimate_EstimatedId(Long estimatedId);

    @Query("SELECT i FROM Invoice i WHERE " +
           "CAST(i.invoiceNo AS string) LIKE %:search% OR " +
           "CAST(i.estimate.estimatedId AS string) LIKE %:search% OR " +
           "CAST(i.chain.chainId AS string) LIKE %:search% OR " +
           "LOWER(i.chain.companyName) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Invoice> searchInvoices(@Param("search") String search);

    long count();
}