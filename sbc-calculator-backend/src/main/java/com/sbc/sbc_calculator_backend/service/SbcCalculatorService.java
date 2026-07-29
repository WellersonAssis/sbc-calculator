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
        double sum = 0;
        for (int r : ratings) sum += r;
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

    public List<Map<String, Object>> getCombinationsForRating(int target, List<Integer> exclude) {
        List<Map<String, Object>> combinations = new ArrayList<>();

        List<Integer> allowed = new ArrayList<>();
        for (int i = target + 5; i >= target - 5; i--) {
            if (exclude == null || !exclude.contains(i)) {
                allowed.add(i);
            }
        }

        if (allowed.isEmpty()) return combinations;

        List<Integer> combo1 = buildDynamicCombo(allowed, target, 1, 2);
        if (combo1 != null) {
            combinations.add(Map.of("title", "1 Carta Alta", "ratings", combo1));
        }

        List<Integer> combo2 = buildDynamicCombo(allowed, target, 2, 2);
        if (combo2 != null && !containsCombo(combinations, combo2)) {
            combinations.add(Map.of("title", "2 Cartas Altas", "ratings", combo2));
        }

        List<Integer> combo3 = buildDynamicCombo(allowed, target, 3, 1);
        if (combo3 != null && !containsCombo(combinations, combo3)) {
            combinations.add(Map.of("title", "Equilibrada", "ratings", combo3));
        }

        List<Integer> combo4 = buildDynamicCombo(allowed, target, 0, 0);
        if (combo4 != null && !containsCombo(combinations, combo4)) {
            combinations.add(Map.of("title", "Econômica/Uniforme", "ratings", combo4));
        }

        return combinations;
    }

    private boolean containsCombo(List<Map<String, Object>> combinations, List<Integer> newCombo) {
        for (Map<String, Object> map : combinations) {
            if (map.get("ratings").equals(newCombo)) return true;
        }
        return false;
    }

    private List<Integer> buildDynamicCombo(List<Integer> allowed, int target, int numHighCards, int minHighOffset) {
        List<Integer> squad = new ArrayList<>();

        int baseCard = allowed.get(0);
        int minDiff = Integer.MAX_VALUE;
        for (int a : allowed) {
            if (Math.abs(a - target) < minDiff) {
                minDiff = Math.abs(a - target);
                baseCard = a;
            }
        }

        int highCard = baseCard;
        for (int a : allowed) {
            if (a >= target + minHighOffset) {
                highCard = a;
                break;
            }
        }

        for (int i = 0; i < 11; i++) {
            squad.add(i < numHighCards ? highCard : baseCard);
        }

        int currentScore = calculateSquadRating(squad);
        int iterations = 0;

        while (currentScore != target && iterations < 1000) {
            Collections.sort(squad);

            if (currentScore < target) {
                boolean upgraded = false;
                for (int i = 0; i < 11; i++) {
                    int next = getNextHigher(allowed, squad.get(i));
                    if (next != -1) {
                        squad.set(i, next);
                        upgraded = true;
                        break;
                    }
                }
                if (!upgraded) return null;
            } else {
                boolean downgraded = false;
                for (int i = 10; i >= 0; i--) {
                    int next = getNextLower(allowed, squad.get(i));
                    if (next != -1) {
                        squad.set(i, next);
                        downgraded = true;
                        break;
                    }
                }
                if (!downgraded) return null;
            }
            currentScore = calculateSquadRating(squad);
            iterations++;
        }

        if (currentScore == target) {
            squad.sort(Collections.reverseOrder());
            return squad;
        }
        return null;
    }

    private int getNextHigher(List<Integer> allowed, int current) {
        int min = Integer.MAX_VALUE;
        for (int a : allowed) {
            if (a > current && a < min) {
                min = a;
            }
        }
        return min == Integer.MAX_VALUE ? -1 : min;
    }

    private int getNextLower(List<Integer> allowed, int current) {
        int max = Integer.MIN_VALUE;
        for (int a : allowed) {
            if (a < current && a > max) {
                max = a;
            }
        }
        return max == Integer.MIN_VALUE ? -1 : max;
    }
}