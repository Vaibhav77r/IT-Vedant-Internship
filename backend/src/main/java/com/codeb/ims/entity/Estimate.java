package com.codeb.ims.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "estimates")
public class Estimate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long estimatedId;

    // Relationship with Chain
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chain_id", nullable = false)
    private Chain chain;

    @Column(nullable = false, length = 50)
    private String groupName;

    @Column(nullable = false, length = 50)
    private String brandName;

    @Column(nullable = false, length = 50)
    private String zoneName;

    @Column(nullable = false, length = 100)
    private String service;

    @Column(nullable = false)
    private Integer qty;

    @Column(nullable = false)
    private Float costPerUnit;

    @Column(nullable = false)
    private Float totalCost;

    @Column(nullable = false)
    private LocalDate deliveryDate;

    @Column(length = 100)
    private String deliveryDetails;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // ===================== CONSTRUCTORS =====================

    public Estimate() {
    }

    public Estimate(Long estimatedId, Chain chain, String groupName, String brandName,
                    String zoneName, String service, Integer qty, Float costPerUnit,
                    Float totalCost, LocalDate deliveryDate, String deliveryDetails,
                    LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.estimatedId = estimatedId;
        this.chain = chain;
        this.groupName = groupName;
        this.brandName = brandName;
        this.zoneName = zoneName;
        this.service = service;
        this.qty = qty;
        this.costPerUnit = costPerUnit;
        this.totalCost = totalCost;
        this.deliveryDate = deliveryDate;
        this.deliveryDetails = deliveryDetails;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ===================== GETTERS =====================

    public Long getEstimatedId() {
        return estimatedId;
    }

    public Chain getChain() {
        return chain;
    }

    public String getGroupName() {
        return groupName;
    }

    public String getBrandName() {
        return brandName;
    }

    public String getZoneName() {
        return zoneName;
    }

    public String getService() {
        return service;
    }

    public Integer getQty() {
        return qty;
    }

    public Float getCostPerUnit() {
        return costPerUnit;
    }

    public Float getTotalCost() {
        return totalCost;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public String getDeliveryDetails() {
        return deliveryDetails;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // ===================== SETTERS =====================

    public void setEstimatedId(Long estimatedId) {
        this.estimatedId = estimatedId;
    }

    public void setChain(Chain chain) {
        this.chain = chain;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public void setZoneName(String zoneName) {
        this.zoneName = zoneName;
    }

    public void setService(String service) {
        this.service = service;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public void setCostPerUnit(Float costPerUnit) {
        this.costPerUnit = costPerUnit;
    }

    public void setTotalCost(Float totalCost) {
        this.totalCost = totalCost;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public void setDeliveryDetails(String deliveryDetails) {
        this.deliveryDetails = deliveryDetails;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}