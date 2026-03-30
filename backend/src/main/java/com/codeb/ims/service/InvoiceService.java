package com.codeb.ims.service;

import com.codeb.ims.dto.*;
import com.codeb.ims.entity.Estimate;
import com.codeb.ims.entity.Invoice;
import com.codeb.ims.repository.EstimateRepository;
import com.codeb.ims.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final EstimateRepository estimateRepository;

    public InvoiceService(InvoiceRepository invoiceRepository, EstimateRepository estimateRepository) {
        this.invoiceRepository = invoiceRepository;
        this.estimateRepository = estimateRepository;
    }

    // ================= GET ALL =================
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ================= SEARCH =================
    public List<InvoiceResponse> searchInvoices(String query) {
        return invoiceRepository.searchInvoices(query == null ? "" : query)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ================= GET BY ID =================
    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        return toResponse(invoice);
    }

    // ================= PREFILL FROM ESTIMATE =================
    public InvoiceResponse getEstimateForInvoice(Long estimatedId) {

        Estimate estimate = estimateRepository.findById(estimatedId)
                .orElseThrow(() -> new RuntimeException("Estimate not found"));

        if (estimate.getChain() == null) {
            throw new RuntimeException("Chain data missing in estimate");
        }

        return InvoiceResponse.builder()
                .estimatedId(estimate.getEstimatedId())
                .chainId(estimate.getChain().getChainId())
                .companyName(estimate.getChain().getCompanyName())
                .gstnNo(estimate.getChain().getGstnNo())
                .groupName(estimate.getGroupName())
                .serviceDetails(estimate.getService())
                .qty(estimate.getQty())
                .costPerQty(estimate.getCostPerUnit())
                .amountPayable(estimate.getTotalCost())
                .amountPaid(0f)
                .balance(estimate.getTotalCost())
                .dateOfService(estimate.getDeliveryDate())
                .deliveryDetails(estimate.getDeliveryDetails())
                .build();
    }

    // ================= CREATE =================
    public InvoiceResponse generateInvoice(InvoiceRequest req) {

        if (req.getEstimatedId() == null) {
            throw new RuntimeException("Estimate ID is required");
        }

        Estimate estimate = estimateRepository.findById(req.getEstimatedId())
                .orElseThrow(() -> new RuntimeException("Estimate not found"));

        int invoiceNo = generateUniqueInvoiceNo();

        float total = estimate.getTotalCost() != null ? estimate.getTotalCost() : 0f;
        float paid = req.getAmountPaid() != null ? req.getAmountPaid() : total;

        if (paid > total) {
            throw new RuntimeException("Amount paid cannot exceed total");
        }

        float balance = total - paid;

        Invoice invoice = new Invoice();
        invoice.setInvoiceNo(invoiceNo);
        invoice.setEstimate(estimate);
        invoice.setChain(estimate.getChain());
        invoice.setServiceDetails(estimate.getService());
        invoice.setQty(estimate.getQty());
        invoice.setCostPerQty(estimate.getCostPerUnit());
        invoice.setAmountPayable(total);
        invoice.setAmountPaid(paid);
        invoice.setBalance(balance);
        invoice.setDateOfPayment(
                req.getDateOfPayment() != null ? req.getDateOfPayment() : LocalDateTime.now()
        );
        invoice.setDateOfService(estimate.getDeliveryDate());
        invoice.setDeliveryDetails(estimate.getDeliveryDetails());
        invoice.setEmailId(req.getEmailId());

        return toResponse(invoiceRepository.save(invoice));
    }

    // ================= UPDATE =================
    public InvoiceResponse updateInvoice(Long id, InvoiceUpdateRequest req) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (req.getEmailId() != null) {
            invoice.setEmailId(req.getEmailId());
        }

        return toResponse(invoiceRepository.save(invoice));
    }

    // ================= DELETE =================
    public String deleteInvoice(Long id) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoiceRepository.delete(invoice);
        return "Invoice deleted successfully";
    }

    // ================= COUNT =================
    public long getTotalInvoices() {
        return invoiceRepository.count();
    }

    // ================= UNIQUE NUMBER =================
    private int generateUniqueInvoiceNo() {
        Random random = new Random();
        int no;

        do {
            no = 1000 + random.nextInt(9000);
        } while (invoiceRepository.findByInvoiceNo(no).isPresent());

        return no;
    }

    // ================= MAPPER =================
    private InvoiceResponse toResponse(Invoice inv) {
        return InvoiceResponse.builder()
                .id(inv.getId())
                .invoiceNo(inv.getInvoiceNo())
                .estimatedId(inv.getEstimate() != null ? inv.getEstimate().getEstimatedId() : null)
                .chainId(inv.getChain() != null ? inv.getChain().getChainId() : null)
                .companyName(inv.getChain() != null ? inv.getChain().getCompanyName() : "-")
                .gstnNo(inv.getChain() != null ? inv.getChain().getGstnNo() : "-")
                .groupName(inv.getEstimate() != null ? inv.getEstimate().getGroupName() : "-")
                .serviceDetails(inv.getServiceDetails())
                .qty(inv.getQty())
                .costPerQty(inv.getCostPerQty())
                .amountPayable(inv.getAmountPayable())
                .amountPaid(inv.getAmountPaid())
                .balance(inv.getBalance())
                .dateOfPayment(inv.getDateOfPayment())
                .dateOfService(inv.getDateOfService())
                .deliveryDetails(inv.getDeliveryDetails())
                .emailId(inv.getEmailId())
                .createdAt(inv.getCreatedAt())
                .build();
    }
}