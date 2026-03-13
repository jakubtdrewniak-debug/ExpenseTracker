package com.jakub.expensetracker.controller;

import com.jakub.expensetracker.model.Expense;
import com.jakub.expensetracker.model.ExpenseCategory;
import com.jakub.expensetracker.repository.ExpenseRepository;
import com.jakub.expensetracker.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseRepository expenseRepository, ExpenseService expenseService) {
        this.expenseRepository = expenseRepository;
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Expense> getExpense(@PathVariable Long id) {
        return expenseRepository.findById(id);
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        return expenseRepository.save(expense);
    }

    @PostMapping("/bulk")
    public List<Expense> createMultipleExpenses(@RequestBody List<Expense> expenses) {
        return expenseRepository.saveAll(expenses);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense updatedExpense) {

        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));

        existingExpense.setDescription(updatedExpense.getDescription());
        existingExpense.setAmount(updatedExpense.getAmount());
        existingExpense.setCategory(updatedExpense.getCategory());
        existingExpense.setDate(updatedExpense.getDate());

        return expenseRepository.save(existingExpense);
    }

    @GetMapping("/total/{year}/{month}")
    public BigDecimal getMonthlyTotal(@PathVariable int year, @PathVariable int month) {
        return expenseService.calculateMonthlyTotal(month, year);
    }

    @GetMapping("/category/{category}")
    public List<Expense> expensesByCategory(@PathVariable ExpenseCategory category){
        return expenseRepository.findByCategory(category);

    }

    @GetMapping("/category/{category}/total")
    public BigDecimal categoryTotal(@PathVariable ExpenseCategory category) {
        return expenseService.expenseByCategory(category);
    }
}
