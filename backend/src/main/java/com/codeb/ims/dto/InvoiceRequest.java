package com.codeb.ims.dto;

import java.time.LocalDateTime;

public class InvoiceRequest {
    private Long estimatedId;
    private Float amountPaid;
    private LocalDateTime dateOfPayment;
    private String emailId;

    public Long getEstimatedId() { return estimatedId; }
    public void setEstimatedId(Long v) { this.estimatedId = v; }
    public Float getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Float v) { this.amountPaid = v; }
    public LocalDateTime getDateOfPayment() { return dateOfPayment; }
    public void setDateOfPayment(LocalDateTime v) { this.dateOfPayment = v; }
    public String getEmailId() { return emailId; }
    public void setEmailId(String v) { this.emailId = v; }
}