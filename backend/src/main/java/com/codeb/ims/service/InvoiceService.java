package com.codeb.ims.service;

import com.codeb.ims.dto.InvoiceRequest;
import com.codeb.ims.dto.InvoiceResponse;
import com.codeb.ims.dto.InvoiceUpdateRequest;
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

    // Get all invoices
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Search invoices
    public List<InvoiceResponse> searchInvoices(String query) {
        return invoiceRepository.searchInvoices(query)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Get single invoice
    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        return toResponse(invoice);
    }

    // Get invoice prefill data from estimate
    public InvoiceResponse getEstimateForInvoice(Long estimatedId) {
        Estimate estimate = estimateRepository.findById(estimatedId)
                .orElseThrow(() -> new RuntimeException("Estimate not found"));

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

    // Generate invoice
    public InvoiceResponse generateInvoice(InvoiceRequest req) {
        Estimate estimate = estimateRepository.findById(req.getEstimatedId())
                .orElseThrow(() -> new RuntimeException("Estimate not found"));

        // Generate unique 4-digit invoice number
        int invoiceNo = generateUniqueInvoiceNo();

        float amountPaid = req.getAmountPaid() != null ? req.getAmountPaid() : estimate.getTotalCost();
        float balance = estimate.getTotalCost() - amountPaid;

        Invoice invoice = new Invoice();
        invoice.setInvoiceNo(invoiceNo);
        invoice.setEstimate(estimate);
        invoice.setChain(estimate.getChain());
        invoice.setServiceDetails(estimate.getService());
        invoice.setQty(estimate.getQty());
        invoice.setCostPerQty(estimate.getCostPerUnit());
        invoice.setAmountPayable(estimate.getTotalCost());
        invoice.setAmountPaid(amountPaid);
        invoice.setBalance(balance);
        invoice.setDateOfPayment(req.getDateOfPayment() != null ? req.getDateOfPayment() : LocalDateTime.now());
        invoice.setDateOfService(estimate.getDeliveryDate());
        invoice.setDeliveryDetails(estimate.getDeliveryDetails());
        invoice.setEmailId(req.getEmailId());

        return toResponse(invoiceRepository.save(invoice));
    }

    // Update email only
    public InvoiceResponse updateInvoice(Long id, InvoiceUpdateRequest req) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        invoice.setEmailId(req.getEmailId());
        return toResponse(invoiceRepository.save(invoice));
    }

    // Delete invoice
    public String deleteInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        invoiceRepository.delete(invoice);
        return "Invoice deleted successfully";
    }

    // Total count
    public long getTotalInvoices() {
        return invoiceRepository.count();
    }

    // Generate unique 4-digit invoice number
    private int generateUniqueInvoiceNo() {
        Random random = new Random();
        int no;
        do {
            no = 1000 + random.nextInt(9000);
        } while (invoiceRepository.findByInvoiceNo(no).isPresent());
        return no;
    }

    // Helper
    private InvoiceResponse toResponse(Invoice inv) {
        return InvoiceResponse.builder()
                .id(inv.getId())
                .invoiceNo(inv.getInvoiceNo())
                .estimatedId(inv.getEstimate().getEstimatedId())
                .chainId(inv.getChain().getChainId())
                .companyName(inv.getChain().getCompanyName())
                .gstnNo(inv.getChain().getGstnNo())
                .groupName(inv.getEstimate().getGroupName())
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