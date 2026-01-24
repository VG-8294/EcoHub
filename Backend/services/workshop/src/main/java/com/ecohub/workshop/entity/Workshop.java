package com.ecohub.workshop.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "workshops")
public class Workshop {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workshopId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private LocalDateTime workshopDateTime;

    @Column(nullable = false)
    private String mode; // ONLINE / OFFLINE

    private String location; // null if ONLINE

    @Column(nullable = false)
    private Integer rewardCoinValue;

	public Long getWorkshopId() {
		return workshopId;
	}

	public void setWorkshopId(Long workshopId) {
		this.workshopId = workshopId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDateTime getWorkshopDateTime() {
		return workshopDateTime;
	}

	public void setWorkshopDateTime(LocalDateTime workshopDateTime) {
		this.workshopDateTime = workshopDateTime;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public Integer getRewardCoinValue() {
		return rewardCoinValue;
	}

	public void setRewardCoinValue(Integer rewardCoinValue) {
		this.rewardCoinValue = rewardCoinValue;
	}
    
    
}
