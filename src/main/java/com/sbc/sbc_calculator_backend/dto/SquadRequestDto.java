package com.sbc.sbc_calculator_backend.dto;

import java.util.List;

public class SquadRequestDto {
    private List<Integer> ratings;

    public SquadRequestDto() {
    }

    public SquadRequestDto(List<Integer> ratings) {
        this.ratings = ratings;
    }

    public List<Integer> getRatings() {
        return ratings;
    }

    public void setRatings(List<Integer> ratings) {
        this.ratings = ratings;
    }
}