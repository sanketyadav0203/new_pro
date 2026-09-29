const form = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");
const balanceElement = document.getElementById("balance");
const transactionList = document.getElementById("transactionList");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(amount);
}

function updateSummary() {
    const income = transactions
        .filter(transaction => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const expense = transactions
        .filter(transaction => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = income - expense;

    incomeElement.textContent = formatCurrency(income);
    expenseElement.textContent = formatCurrency(expense);
    balanceElement.textContent = formatCurrency(balance);

    balanceElement.style.color = balance >= 0 ? "#16a34a" : "#dc2626";
}

function displayTransactions() {
    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        transactionList.innerHTML =
            '<p class="empty">No transactions yet.</p>';
        return;
    }

    transactions.forEach(transaction => {
        const transactionElement = document.createElement("div");

        transactionElement.className =
            `transaction ${transaction.type}`;

        const sign = transaction.type === "income" ? "+" : "-";

        transactionElement.innerHTML = `
            <div class="transaction-info">
                <h3>${escapeHTML(transaction.description)}</h3>
                <small>${escapeHTML(transaction.category)}</small>
            </div>

            <div class="transaction-right">
                <span class="${
                    transaction.type === "income"
                        ? "income-amount"
                        : "expense-amount"
                }">
                    ${sign}${formatCurrency(transaction.amount)}
                </span>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                >
                    Delete
                </button>
            </div>
        `;

        transactionList.appendChild(transactionElement);
    });
}

function addTransaction(event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

    if (!description || amount <= 0) {
        alert("Please enter valid transaction details.");
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
        type,
        category
    };

    transactions.push(transaction);

    saveTransactions();
    updateSummary();
    displayTransactions();

    form.reset();
}

function deleteTransaction(id) {
    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveTransactions();
    updateSummary();
    displayTransactions();
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

form.addEventListener("submit", addTransaction);

updateSummary();
displayTransactions();
