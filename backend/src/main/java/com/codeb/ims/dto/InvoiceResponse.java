package com.codeb.ims.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class InvoiceResponse {
    private Long id;
    private Integer invoiceNo;
    private Long estimatedId;
    private Long chainId;
    private String companyName;
    private String gstnNo;
    private String groupName;
    private String serviceDetails;
    private Integer qty;
    private Float costPerQty;
    private Float amountPayable;
    private Float amountPaid;
    private Float balance;
    private LocalDateTime dateOfPayment;
    private LocalDate dateOfService;
    private String deliveryDetails;
    private String emailId;
    private LocalDateTime createdAt;

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private Integer invoiceNo; private Long estimatedId;
        private Long chainId; private String companyName; private String gstnNo;
        private String groupName; private String serviceDetails; private Integer qty;
        private Float costPerQty; private Float amountPayable; private Float amountPaid;
        private Float balance; private LocalDateTime dateOfPayment; private LocalDate dateOfService;
        private String deliveryDetails; private String emailId; private LocalDateTime createdAt;

        public Builder id(Long v) { id=v; return this; }
        public Builder invoiceNo(Integer v) { invoiceNo=v; return this; }
        public Builder estimatedId(Long v) { estimatedId=v; return this; }
        public Builder chainId(Long v) { chainId=v; return this; }
        public Builder companyName(String v) { companyName=v; return this; }
        public Builder gstnNo(String v) { gstnNo=v; return this; }
        public Builder groupName(String v) { groupName=v; return this; }
        public Builder serviceDetails(String v) { serviceDetails=v; return this; }
        public Builder qty(Integer v) { qty=v; return this; }
        public Builder costPerQty(Float v) { costPerQty=v; return this; }
        public Builder amountPayable(Float v) { amountPayable=v; return this; }
        public Builder amountPaid(Float v) { amountPaid=v; return this; }
        public Builder balance(Float v) { balance=v; return this; }
        public Builder dateOfPayment(LocalDateTime v) { dateOfPayment=v; return this; }
        public Builder dateOfService(LocalDate v) { dateOfService=v; return this; }
        public Builder deliveryDetails(String v) { deliveryDetails=v; return this; }
        public Builder emailId(String v) { emailId=v; return this; }
        public Builder createdAt(LocalDateTime v) { createdAt=v; return this; }
        public InvoiceResponse build() {
            InvoiceResponse r = new InvoiceResponse();
            r.id=id; r.invoiceNo=invoiceNo; r.estimatedId=estimatedId;
            r.chainId=chainId; r.companyName=companyName; r.gstnNo=gstnNo;
            r.groupName=groupName; r.serviceDetails=serviceDetails; r.qty=qty;
            r.costPerQty=costPerQty; r.amountPayable=amountPayable; r.amountPaid=amountPaid;
            r.balance=balance; r.dateOfPayment=dateOfPayment; r.dateOfService=dateOfService;
            r.deliveryDetails=deliveryDetails; r.emailId=emailId; r.createdAt=createdAt;
            return r;
        }
    }

    public Long getId() { return id; }
    public Integer getInvoiceNo() { return invoiceNo; }
    public Long getEstimatedId() { return estimatedId; }
    public Long getChainId() { return chainId; }
    public String getCompanyName() { return companyName; }
    public String getGstnNo() { return gstnNo; }
    public String getGroupName() { return groupName; }
    public String getServiceDetails() { return serviceDetails; }
    public Integer getQty() { return qty; }
    public Float getCostPerQty() { return costPerQty; }
    public Float getAmountPayable() { return amountPayable; }
    public Float getAmountPaid() { return amountPaid; }
    public Float getBalance() { return balance; }
    public LocalDateTime getDateOfPayment() { return dateOfPayment; }
    public LocalDate getDateOfService() { return dateOfService; }
    public String getDeliveryDetails() { return deliveryDetails; }
    public String getEmailId() { return emailId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}