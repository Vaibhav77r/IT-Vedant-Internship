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

    public Estimate() {}

    public Long getEstimatedId() { return estimatedId; }
    public void setEstimatedId(Long estimatedId) { this.estimatedId = estimatedId; }
    public Chain getChain() { return chain; }
    public void setChain(Chain chain) { this.chain = chain; }
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }
    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
    public Float getCostPerUnit() { return costPerUnit; }
    public void setCostPerUnit(Float costPerUnit) { this.costPerUnit = costPerUnit; }
    public Float getTotalCost() { return totalCost; }
    public void setTotalCost(Float totalCost) { this.totalCost = totalCost; }
    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }
    public String getDeliveryDetails() { return deliveryDetails; }
    public void setDeliveryDetails(String deliveryDetails) { this.deliveryDetails = deliveryDetails; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}