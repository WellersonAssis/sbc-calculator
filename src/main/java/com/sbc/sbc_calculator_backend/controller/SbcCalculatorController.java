package com.sbc.sbc_calculator_backend.controller;

import com.sbc.sbc_calculator_backend.dto.SquadRequestDto;
import com.sbc.sbc_calculator_backend.service.SbcCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sbc")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SbcCalculatorController {

    private final SbcCalculatorService calculatorService;

    @PostMapping("/calculate")
    public ResponseEntity<Integer> calculateRating(@RequestBody SquadRequestDto request) {
        int result = calculatorService.calculateSquadRating(request.getRatings());
        return ResponseEntity.ok(result);
    }
}