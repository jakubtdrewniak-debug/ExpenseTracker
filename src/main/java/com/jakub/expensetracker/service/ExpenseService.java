package com.jakub.expensetracker.service;

import com.jakub.expensetracker.model.Expense;
import com.jakub.expensetracker.model.ExpenseCategory;
import com.jakub.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public BigDecimal calculateMonthlyTotal(int month, int year) {
        List<Expense> allExpenses = expenseRepository.findAll();

        BigDecimal total = BigDecimal.ZERO;

        for(Expense expense : allExpenses) {
            if (expense.getDate().getMonthValue() == month && expense.getDate().getYear() == year) {
                total = total.add(expense.getAmount());
            }
        }
        return total;
    }

    public BigDecimal expenseByCategory(ExpenseCategory category) {
        List<Expense> categoryExpenses = expenseRepository.findByCategory(category);
        BigDecimal total = BigDecimal.ZERO;
        for(Expense expense : categoryExpenses) {
            total = total.add(expense.getAmount());
        }
        return total;
    }
}
