package com.sbc.sbc_calculator_backend.controller;

import com.sbc.sbc_calculator_backend.service.SbcCalculatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sbc")

public class SbcCalculatorController {

    private final SbcCalculatorService calculatorService;

    public SbcCalculatorController(SbcCalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }

    @GetMapping("/combinations/{targetRating}")
    public ResponseEntity<List<Map<String, Object>>> getCombinations(
            @PathVariable int targetRating,
            @RequestParam(required = false) List<Integer> exclude
    ) {
        return ResponseEntity.ok(calculatorService.getCombinationsForRating(targetRating, exclude));
    }
}