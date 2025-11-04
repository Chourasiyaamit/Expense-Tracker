Expense Tracker

Overview

The Expense Tracker is a responsive web application that helps users efficiently manage their personal finances.
It allows users to record their income and expenses, categorize them, and visualize spending through an interactive pie chart.

This project uses HTML, CSS, and JavaScript with Local Storage for persistent data management — no backend required.

Features

-Add New Transactions

• Enter Date, Description, Category, Type (Income/Expense), and Amount.

• Automatically updates totals and chart.

-Edit or Delete Transactions

• Modify existing records anytime.

• Delete individual transactions with a confirmation modal.

-Summary Dashboard

• Displays Total Income, Total Expenses, and Current Balance.

• Values update dynamically with each change.

-Pie Chart Visualization

• Interactive chart shows expense distribution by category (Food, Transport, Shopping, Utilities, Other).

-Search / Filter Transactions

• Search by description, category, type, or date in real time.

-Data Persistence (Local Storage)

• Transactions remain saved even after refreshing or closing the browser.

-Export & Import Data

• Export data as a JSON file (includes metadata like author, date, etc.).

• Import the file later to restore or merge data.

-Responsive Design

• Fully optimized for desktop, tablet, and mobile devices.
-------------------------------------------------------------------------------
How to Use

Open the App

Visit the live demo or open index.html in your browser.

-Add a Transaction

1• Fill in Date, Description, Category, Type, and Amount.

2• Click Add Transaction.

3• The transaction will appear in the list below.

-Edit or Delete

• Click the Edit icon to modify a transaction.

• Click the Delete icon to remove one (confirmation modal will appear).

-View Summary

• The top section shows updated Balance, Income, and Expenses.

• The Pie Chart updates automatically for all expense categories.

-Export / Import

• Click Export to download your data as transactions_backup_YYYY-MM-DD.json.

• Click Import to upload a .json file and restore previous data.

-Clear All Transactions

• Click Clear All Transactions.

• Confirm the action in the pop-up modal.
---------------------------------------------------------------------------------------
-Code Structure

Expense-Tracker/
│
├── index.html        → Main HTML structure (layout, modals, section containers)
├── style.css         → Styling, layout, responsiveness, and color scheme
├── script.js         → Core functionality and logic (transactions, charts, modals)
└── README.md         → Documentation file
----------------------------------------------------------------------------------------

JavaScript Overview

1. Data Handling

All transactions are stored as objects in an array:

{ id, date, description, category, amount, type }


Saved persistently in localStorage via:

localStorage.setItem('transactions', JSON.stringify(transactions));

2. Rendering & Updating

Functions:

• renderTransactions() → Displays transactions dynamically.

• updateSummary() → Calculates total income, expenses, and balance.

• updateChart() → Updates pie chart visualization.

3. User Interaction

• Add, edit, and delete handled via forms and icons.

• Custom confirmation modals for critical actions.

• Popup notifications (showPopup()) provide instant user feedback.

4. Export / Import Logic

• Export: Converts data (with metadata) into JSON for download.

• Import: Reads .json file, merges transactions, and re-renders UI.

5. Responsiveness

• CSS media queries adapt layout for smaller screens.

• Horizontal scroll added for transaction list on mobile.

--------------------------------------------------------------------------------------

Tech Stack

Technology	                Purpose

HTML5	                    Structure of the app
CSS3 (Flexbox + Grid)	    Styling and responsive layout
JavaScript (ES6)	        Core logic and data handling
Chart.js	                Pie chart visualization
Local Storage API	        Persistent data management
Font Awesome	            Icons for UI clarity

Author

Amit Chourasiya
Email: chourasiyaamit2002@gmail.com

GitHub: https://github.com/Chourasiyaamit

© 2025 Amit Chourasiya. All rights reserved.
Unauthorized copying or reproduction of this project is strictly prohibited.
