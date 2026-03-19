package com.jakub.expensetracker.service;

import com.jakub.expensetracker.ExpensetrackerApplication;
import com.jakub.expensetracker.model.Expense;
import com.jakub.expensetracker.model.ExpenseCategory;
import com.jakub.expensetracker.repository.ExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    private static final Logger log = LoggerFactory.getLogger(ExpenseService.class);


    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public BigDecimal calculateMonthlyTotal(int month, int year) {
        log.info("calculateMonthlyTotal method called by the controller.");
        List<Expense> allExpenses = expenseRepository.findAll();

        BigDecimal total = BigDecimal.ZERO;

        for (Expense expense : allExpenses) {
            if (expense.getDate().getMonthValue() == month && expense.getDate().getYear() == year) {
                total = total.add(expense.getAmount());
            }
        }
        log.info("Total amount calculated.");
        return total;
    }

    public BigDecimal expenseByCategory(ExpenseCategory category) {
        log.info("expenseByCategory method called");
        List<Expense> categoryExpenses = expenseRepository.findByCategory(category);
        BigDecimal total = BigDecimal.ZERO;
        for (Expense expense : categoryExpenses) {
            total = total.add(expense.getAmount());
        }
        log.info("Total amount by category calculated.");
        return total;
    }
}
