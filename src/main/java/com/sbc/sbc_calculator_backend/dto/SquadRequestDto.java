package com.sbc.sbc_calculator_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class SquadRequestDto {
    private List<Integer> ratings;
}