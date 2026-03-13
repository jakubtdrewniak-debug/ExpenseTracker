package com.jakub.expensetracker.repository;

import com.jakub.expensetracker.model.Expense;
import com.jakub.expensetracker.model.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository  extends JpaRepository<Expense, Long> {
    List<Expense> findByCategory(ExpenseCategory category);
}
