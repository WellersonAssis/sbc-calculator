package com.sbc.sbc_calculator_backend.controller;

import com.sbc.sbc_calculator_backend.dto.SquadRequestDto;
import com.sbc.sbc_calculator_backend.service.SbcCalculatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sbc")
@CrossOrigin(origins = "*")
public class SbcCalculatorController {

    private final SbcCalculatorService calculatorService;

    // Construtor injetando apenas o serviço de cálculos
    public SbcCalculatorController(SbcCalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<Integer> calculateRating(@RequestBody SquadRequestDto request) {
        int result = calculatorService.calculateSquadRating(request.getRatings());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/combinations/{targetRating}")
    public ResponseEntity<List<Map<String, Object>>> getCombinations(@PathVariable int targetRating) {
        return ResponseEntity.ok(calculatorService.getCombinationsForRating(targetRating));
    }
}