package com.sbc.sbc_calculator_backend.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SbcCalculatorService {


    public int calculateSquadRating(List<Integer> ratings) {
        if (ratings == null || ratings.isEmpty() || ratings.size() > 11) {
            throw new IllegalArgumentException("O elenco deve conter entre 1 e 11 jogadores.");
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
}