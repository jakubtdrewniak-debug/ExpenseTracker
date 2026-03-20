package com.jakub.expensetracker.controller;

import com.jakub.expensetracker.model.Expense;
import com.jakub.expensetracker.model.ExpenseCategory;
import com.jakub.expensetracker.repository.ExpenseRepository;
import com.jakub.expensetracker.service.ExpenseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:5173/")
public class ExpenseController {

    private static final Logger log = LoggerFactory.getLogger(ExpenseController.class);
    private final ExpenseRepository expenseRepository;
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseRepository expenseRepository, ExpenseService expenseService) {
        this.expenseRepository = expenseRepository;
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        log.info("GET request to list expenses called");
        return expenseRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Expense> getExpense(@PathVariable Long id) {
        log.info("GET request to find a single hero by ID called");
        return expenseRepository.findById(id);
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        log.info("POST method to create an Expense object called");
        return expenseRepository.save(expense);
    }

    @PostMapping("/bulk")
    public List<Expense> createMultipleExpenses(@RequestBody List<Expense> expenses) {
        log.info("POST method to create multiple Expense objects at once called");
        return expenseRepository.saveAll(expenses);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        log.info("DELETE method by ID called");
        expenseRepository.deleteById(id);
        log.info("Expense object deleted");
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense updatedExpense) {
        log.info("PUT method called to update id");

        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
        log.info("Expense exists");
        existingExpense.setDescription(updatedExpense.getDescription());
        existingExpense.setAmount(updatedExpense.getAmount());
        existingExpense.setCategory(updatedExpense.getCategory());
        existingExpense.setDate(updatedExpense.getDate());
        log.info("New values set for object");

        return expenseRepository.save(existingExpense);
    }

    @GetMapping("/total/{year}/{month}")
    public BigDecimal getMonthlyTotal(@PathVariable int year, @PathVariable int month) {
        log.info("GET total for all expenses, service method called");
        return expenseService.calculateMonthlyTotal(month, year);
    }

    @GetMapping("/category/{category}")
    public List<Expense> expensesByCategory(@PathVariable ExpenseCategory category) {
        log.info("GET all Expense objects per Category");
        return expenseRepository.findByCategory(category);

    }

    @GetMapping("/category/{category}/total")
    public BigDecimal categoryTotal(@PathVariable ExpenseCategory category) {
        log.info("GET method to get total per category, service is called");
        return expenseService.expenseByCategory(category);
    }
}
