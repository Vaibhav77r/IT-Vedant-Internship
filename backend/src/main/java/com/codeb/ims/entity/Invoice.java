package com.codeb.ims.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Integer invoiceNo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estimated_id", nullable = false)
    private Estimate estimate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chain_id", nullable = false)
    private Chain chain;

    @Column(nullable = false, length = 50)
    private String serviceDetails;

    @Column(nullable = false)
    private Integer qty;

    @Column(nullable = false)
    private Float costPerQty;

    @Column(nullable = false)
    private Float amountPayable;

    @Column(nullable = false)
    private Float amountPaid;

    @Column(nullable = false)
    private Float balance;

    private LocalDateTime dateOfPayment;

    @Column(nullable = false)
    private LocalDate dateOfService;

    @Column(length = 100)
    private String deliveryDetails;

    @Column(length = 50)
    private String emailId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Invoice() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getInvoiceNo() { return invoiceNo; }
    public void setInvoiceNo(Integer invoiceNo) { this.invoiceNo = invoiceNo; }
    public Estimate getEstimate() { return estimate; }
    public void setEstimate(Estimate estimate) { this.estimate = estimate; }
    public Chain getChain() { return chain; }
    public void setChain(Chain chain) { this.chain = chain; }
    public String getServiceDetails() { return serviceDetails; }
    public void setServiceDetails(String serviceDetails) { this.serviceDetails = serviceDetails; }
    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
    public Float getCostPerQty() { return costPerQty; }
    public void setCostPerQty(Float costPerQty) { this.costPerQty = costPerQty; }
    public Float getAmountPayable() { return amountPayable; }
    public void setAmountPayable(Float amountPayable) { this.amountPayable = amountPayable; }
    public Float getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Float amountPaid) { this.amountPaid = amountPaid; }
    public Float getBalance() { return balance; }
    public void setBalance(Float balance) { this.balance = balance; }
    public LocalDateTime getDateOfPayment() { return dateOfPayment; }
    public void setDateOfPayment(LocalDateTime dateOfPayment) { this.dateOfPayment = dateOfPayment; }
    public LocalDate getDateOfService() { return dateOfService; }
    public void setDateOfService(LocalDate dateOfService) { this.dateOfService = dateOfService; }
    public String getDeliveryDetails() { return deliveryDetails; }
    public void setDeliveryDetails(String deliveryDetails) { this.deliveryDetails = deliveryDetails; }
    public String getEmailId() { return emailId; }
    public void setEmailId(String emailId) { this.emailId = emailId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}