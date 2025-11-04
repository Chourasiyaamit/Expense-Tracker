// --------------------- EXPENSE TRACKER FULL FUNCTIONALITY -----------------------------

// ----------------------------- Get Elements -----------------------------
const form = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const ctx = document.getElementById('expenseChart');

// -------- Load existing transactions from localStorage ---------
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// ----------------------------- Chart Setup -----------------------------
const categories = ['Food', 'Transport', 'Shopping', 'Utilities', 'Other'];
const colors = ['#4caf50', '#2196f3', '#f44336', '#ff9800', '#9c27b0'];

let expenseChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: categories,
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: colors,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          boxWidth: 18,
          boxHeight: 18,
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 16, family: 'Poppins' },
          color: '#333'
        }
      }
    }
  }
});

// ----------------------------- Format Date to DD/MM/YYYY  -----------------------------
function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

// ----------------------------- Format Currency with ₹ and Commas -----------------------------
function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ----------------------------- Custom Date Input Formatting -----------------------------
const dateInput = document.getElementById('date');

dateInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, ''); 
  if (value.length > 2 && value.length <= 4)
    value = value.slice(0, 2) + '/' + value.slice(2);
  else if (value.length > 4)
    value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
  e.target.value = value;
});

// ----------------------------- Add New Transaction -----------------------------
form.addEventListener('submit', e => {
  e.preventDefault();

  const dateInputValue = form.date.value;
  const [day, month, year] = dateInputValue.split('/');
  const date = `${year}-${month}-${day}`; // convert back to YYYY-MM-DD for saving
  const description = form.description.value.trim();
  const category = form.category.value;
  const amount = parseFloat(form.amount.value);
  const type = form.type.value;

  if (!date || !description || !category || !amount || !type) return;

  const transaction = {
    id: Date.now(),
    date,
    description,
    category,
    amount,
    type
  };

  transactions.push(transaction);
  saveTransactions();
  renderTransactions();
  updateSummary();
  updateChart();
  form.reset();
  showPopup('Transaction added successfully!');
});

// ----------------------------- Render Transactions in List -----------------------------
function renderTransactions() {
  transactionList.innerHTML = '';

  transactions.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${formatDate(t.date)}</span>
      <span>${t.description}</span>
      <span class="category-tag">${t.category}</span>
      <span class="${t.type === 'income' ? 'income-type' : 'expense-type'}">${t.type}</span>
      <span class="amount">${formatCurrency(t.amount)}</span>
      <div class="actions">
      <i class="fa-solid fa-pen" onclick="editTransaction(${t.id})"></i>
      <i class="fa-solid fa-trash" onclick="deleteTransaction(${t.id})"></i>
      </div>
    `;
    transactionList.appendChild(li);
  });
}

// ----------------------------- Delete Transaction (Custom Modal) -----------------------------
let transactionToDelete = null; 

function deleteTransaction(id) {
  transactionToDelete = id; 
  document.getElementById('deleteModal').style.display = 'flex';
}

// ----------------------------- Update Totals -----------------------------
function updateSummary() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  incomeEl.textContent = formatCurrency(income);
  expenseEl.textContent = formatCurrency(expense);
  balanceEl.textContent = formatCurrency(balance);
}

// ----------------------------- Save to Local Storage -----------------------------
function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ----------------------------- Popup Message Function -----------------------------
function showPopup(message, type = 'success') {
  const popup = document.getElementById('popup');
  popup.textContent = message;
  popup.className = 'popup'; // reset
  if (type === 'error') popup.classList.add('error');
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('show');
  }, 2000);  
}

// ----------------------------- Update Pie Chart -----------------------------
function updateChart() {
  const totals = [0, 0, 0, 0, 0];
  transactions.forEach(t => {
    if (t.type === 'expense') {
      const index = categories.indexOf(t.category);
      if (index !== -1) totals[index] += t.amount;
    }
  });

  expenseChart.data.datasets[0].data = totals;
  expenseChart.update();
}

// ----------------------------- Search / Filter Transactions -----------------------------
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  filterTransactions(query);
});

function filterTransactions(query) {
  transactionList.innerHTML = '';

  const filtered = transactions.filter(t => {
    return (
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.type.toLowerCase().includes(query) ||
      formatDate(t.date).includes(query)
    );
  });

  if (filtered.length === 0) {
    transactionList.innerHTML = `<li style="text-align:center; padding:10px; color:#888;">No matching transactions found</li>`;
    return;
  }

  filtered.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${formatDate(t.date)}</span>
      <span>${t.description}</span>
      <span class="category-tag">${t.category}</span>
      <span class="${t.type === 'income' ? 'income-type' : 'expense-type'}">${t.type}</span>
      <span class="amount">${formatCurrency(t.amount)}</span>
      <div class="actions">
        <i class="fa-solid fa-pen" onclick="editTransaction(${t.id})"></i>
        <i class="fa-solid fa-trash" onclick="deleteTransaction(${t.id})"></i>
      </div>
    `;
    transactionList.appendChild(li);
  });
}

// ----------------------------- Initial Render -----------------------------
renderTransactions();
updateSummary();
updateChart();

// ----------------------------- Modal Handling (Clear, Delete, Edit) -----------------------------
// ---------------------------- Clear All Transactions Modal --------------------------------
const clearBtn = document.getElementById('clearAllBtn');
const confirmModal = document.getElementById('confirmModal');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

// Show the modal
clearBtn.addEventListener('click', () => {
  confirmModal.style.display = 'flex';
});

// Confirm clear
confirmYes.addEventListener('click', () => {
  transactions = [];
  saveTransactions();
  renderTransactions();
  updateSummary();
  updateChart();
  showPopup('All transactions cleared!', 'error');

  // Hide modal smoothly
  confirmModal.style.opacity = '0';
  setTimeout(() => {
    confirmModal.style.display = 'none';
    confirmModal.style.opacity = '1';
  }, 300);
});

// Cancel clear
confirmNo.addEventListener('click', () => {
  confirmModal.style.opacity = '0';
  setTimeout(() => {
    confirmModal.style.display = 'none';
    confirmModal.style.opacity = '1';
  }, 300);
});

// ----------------------------- Delete Transaction Confirmation -----------------------------
const deleteModal = document.getElementById('deleteModal');
const deleteYes = document.getElementById('deleteYes');
const deleteNo = document.getElementById('deleteNo');

// Confirm delete
deleteYes.addEventListener('click', () => {
  if (transactionToDelete !== null) {
    transactions = transactions.filter(t => t.id !== transactionToDelete);
    saveTransactions();
    renderTransactions();
    updateSummary();
    updateChart();
    showPopup('Transaction deleted successfully!', 'error');
    transactionToDelete = null;
  }

  deleteModal.style.opacity = '0';
  setTimeout(() => {
    deleteModal.style.display = 'none';
    deleteModal.style.opacity = '1';
  }, 300);
});

// Cancel delete
deleteNo.addEventListener('click', () => {
  deleteModal.style.opacity = '0';
  setTimeout(() => {
    deleteModal.style.display = 'none';
    deleteModal.style.opacity = '1';
  }, 300);
  transactionToDelete = null;
});

// ----------------------------- Edit Transaction Functionality -----------------------------
function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return;

  // Fill modal inputs
  document.getElementById('editId').value = transaction.id;
  document.getElementById('editDate').value = formatDate(transaction.date);
  document.getElementById('editDescription').value = transaction.description;
  document.getElementById('editCategory').value = transaction.category;
  document.getElementById('editAmount').value = transaction.amount;
  document.getElementById('editType').value = transaction.type;

  // Show modal
  document.getElementById('editModal').style.display = 'flex';
}

// Handle Edit Save
document.getElementById('editForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const id = Number(document.getElementById('editId').value);
  const date = document.getElementById('editDate').value;
  const [day, month, year] = date.split('/');
  const formattedDate = `${year}-${month}-${day}`;

  const updatedTransaction = {
    id,
    date: formattedDate,
    description: document.getElementById('editDescription').value.trim(),
    category: document.getElementById('editCategory').value,
    amount: parseFloat(document.getElementById('editAmount').value),
    type: document.getElementById('editType').value
  };

  // Replace old transaction with updated one
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) transactions[index] = updatedTransaction;

  saveTransactions();
  renderTransactions();
  updateSummary();
  updateChart();
  showPopup('Transaction updated successfully!');
  document.getElementById('editModal').style.display = 'none';
});

// Cancel edit
document.getElementById('editCancel').addEventListener('click', () => {
  document.getElementById('editModal').style.display = 'none';
});

// ----------------------------- EXPORT & IMPORT TRANSACTIONS -----------------------------
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');

// --- Export Transactions ---
exportBtn.addEventListener('click', () => {
  if (transactions.length === 0) {
    showPopup('No transactions to export!', 'error');
    return;
  }

  const dataStr = JSON.stringify(transactions, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `transactions_backup_${date}.json`;
  link.click();

  URL.revokeObjectURL(url);
  showPopup('Transactions exported successfully!');
});

// --- Import Transactions ---
importBtn.addEventListener('click', () => {
  importFile.click(); // open file picker
});

importFile.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);

      if (!Array.isArray(importedData)) {
        showPopup('Invalid file format!', 'error');
        return;
      }

      // Merge imported data with existing transactions
      transactions = [...transactions, ...importedData];
      saveTransactions();
      renderTransactions();
      updateSummary();
      updateChart();
      showPopup('Transactions imported successfully!');
    } catch (err) {
      showPopup('Error importing file!', 'error');
    }
  };
  reader.readAsText(file);

  // reset file input for future imports
  importFile.value = '';
});
