package com.sbc.sbc_calculator_backend.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SbcCalculatorService {

    public int calculateSquadRating(List<Integer> ratings) {
        if (ratings == null || ratings.isEmpty() || ratings.size() > 11) {
            throw new IllegalArgumentException("Squad size must be between 1 and 11 players.");
        }

        int squadSize = ratings.size();
        double sum = ratings.stream().mapToInt(Integer::intValue).sum();
        double rawAverage = sum / (double) squadSize;

        double excess = 0.0;
        for (int rating : ratings) {
            if (rating > rawAverage) {
                excess += (rating - rawAverage);
            }
        }

        double finalScore = rawAverage + (excess / (double) squadSize);
        return (int) Math.floor(finalScore);
    }

    public List<Map<String, Object>> getCombinationsForRating(int target) {
        List<Map<String, Object>> combinations = new ArrayList<>();

        // Modelo 1: 1 Carta Alta + Médias/Baixas
        combinations.add(Map.of(
                "title", "1 Carta Alta + Cartas Baixas",
                "ratings", List.of(target + 2, target + 1, target + 1, target, target, target - 1, target - 1, target - 1, target - 1, target - 2, target - 2)
        ));

        // Modelo 2: 2 Cartas Altas
        combinations.add(Map.of(
                "title", "2 Cartas Altas + Economia",
                "ratings", List.of(target + 2, target + 2, target, target, target - 1, target - 1, target - 1, target - 1, target - 1, target - 2, target - 2)
        ));

        // Modelo 3: Equilibrada
        combinations.add(Map.of(
                "title", "Equilibrada (3 Cartas T+1)",
                "ratings", List.of(target + 1, target + 1, target + 1, target, target, target - 1, target - 1, target - 1, target - 2, target - 2, target - 2)
        ));

        // Modelo 4: Todas da mesma nota
        combinations.add(Map.of(
                "title", "Uniforme",
                "ratings", Collections.nCopies(11, target)
        ));

        return combinations;
    }
}