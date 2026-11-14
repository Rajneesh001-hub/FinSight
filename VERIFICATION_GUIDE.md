# FinSight Feature Verification Guide

## Prerequisites
- Backend running on `http://localhost:5001`
- Frontend running on `http://localhost:3001`
- Browser console open (F12)

## Verification Checklist

### 1. Transactions Page (/transactions)
**Endpoint:** http://localhost:3001/src/pages/Transactions

#### Single Delete
- [ ] Click three-dot menu on any transaction
- [ ] Click "Delete"
- [ ] Confirmation dialog appears
- [ ] Click "Confirm Delete"
- [ ] Transaction removed from list
- [ ] Success message appears: "Transaction deleted successfully!"
- [ ] No console errors

#### Bulk Delete
- [ ] Check 3+ transaction checkboxes
- [ ] Click "Delete Selected" button
- [ ] Confirmation dialog shows count: "Delete X transactions?"
- [ ] Click "Confirm Delete"
- [ ] All selected transactions removed
- [ ] Success message: "X transactions deleted successfully!"
- [ ] Checkboxes uncheck

#### Checkbox Selection
- [ ] Click checkbox on transaction row - row highlights
- [ ] Click "Select All" checkbox - all rows check and highlight
- [ ] Click "Select All" again - all uncheck
- [ ] Check some, click "Deselect All" - all uncheck
- [ ] UI is responsive, no lag

#### Error Handling
- [ ] Stop backend server
- [ ] Try to delete transaction
- [ ] Error message appears: "Failed to delete transaction"
- [ ] Transaction remains in list
- [ ] Start backend again

### 2. Dashboard Page (/dashboard)

#### Add Transaction Button
- [ ] Click "Add Transaction" button
- [ ] Modal opens with form fields: Date, Description, Amount, Category, Account
- [ ] Form has "Save" and "Cancel" buttons
- [ ] Cancel closes modal

#### Add Transaction Form
- [ ] Leave Description empty, click Save
- [ ] Validation error appears: "Description is required"
- [ ] Leave Amount empty, click Save
- [ ] Validation error: "Amount is required"
- [ ] Fill form: Date, Description "Test", Amount "100", Category "Shopping"
- [ ] Click Save
- [ ] Modal closes
- [ ] Success message: "Transaction added successfully!"
- [ ] New transaction appears in Recent Transactions list

#### Export Button
- [ ] Click "Export to CSV"
- [ ] CSV file downloads as "finsight-transactions.csv"
- [ ] File contains headers: Date, Description, Amount, Category, Account
- [ ] File contains transaction data

#### Error Handling
- [ ] Stop backend
- [ ] Try to add transaction
- [ ] Error message: "Failed to add transaction"
- [ ] Modal stays open
- [ ] Try to export
- [ ] Error appears
- [ ] Start backend again

### 3. Goals Page (/goals)

#### Add Money Modal
- [ ] Click "Add Money" on any goal card
- [ ] Modal opens with Amount field
- [ ] Modal has "Save" and "Cancel" buttons
- [ ] Leave amount empty, click Save
- [ ] Validation error: "Amount is required"
- [ ] Enter "5000", click Save
- [ ] Modal closes
- [ ] Success message: "Money added successfully!"
- [ ] Goal's "Saved" amount increases
- [ ] Progress bar updates

#### Edit Goal Modal
- [ ] Click "Edit Goal" button on any goal
- [ ] Modal opens with pre-filled data:
  - Goal name
  - Target amount
  - Current saved amount
  - Target date
- [ ] Modify target amount to higher value
- [ ] Click Save
- [ ] Modal closes
- [ ] Success message: "Goal updated successfully!"
- [ ] Goal card reflects new target
- [ ] Progress bar recalculates

#### Delete Goal
- [ ] Click "Delete" icon on goal card
- [ ] Confirmation dialog: "Delete this goal?"
- [ ] Click Confirm
- [ ] Goal removed from list
- [ ] Success message: "Goal deleted successfully!"
- [ ] No console errors

#### Error Handling
- [ ] Stop backend
- [ ] Try Add Money - error appears
- [ ] Try Edit Goal - error appears
- [ ] Try Delete - error appears
- [ ] Start backend

### 4. Budgets Page (/budgets)

#### Create New Budget
- [ ] Click "Create Budget" button
- [ ] Modal opens with fields: Category, Limit, Alert Threshold
- [ ] Fill form with valid data
- [ ] Click "Create"
- [ ] Modal closes
- [ ] Success message: "Budget created successfully!"
- [ ] New budget appears in list

#### Edit Budget
- [ ] Click "Edit" button on budget
- [ ] Modal opens with current values pre-filled
- [ ] Modify values
- [ ] Click "Save"
- [ ] Modal closes
- [ ] Success message: "Budget updated successfully!"
- [ ] List updates with new values

#### Delete Budget
- [ ] Click "Delete" icon
- [ ] Confirmation: "Delete this budget?"
- [ ] Click Confirm
- [ ] Budget removed
- [ ] Success message: "Budget deleted successfully!"

#### Loading States
- [ ] All buttons show "Saving..." or loading indicator during operations
- [ ] Buttons disabled while loading
- [ ] No double-click issues

#### Error Handling
- [ ] Stop backend
- [ ] Try operations
- [ ] Error messages appear
- [ ] Buttons return to normal state

### 5. Import/Export Page (/import-export)

#### Export CSV
- [ ] Click "Export to CSV"
- [ ] CSV file downloads
- [ ] Filename: "finsight-transactions.csv"
- [ ] File format correct

#### Import File
- [ ] Click "Choose File" button
- [ ] File dialog opens
- [ ] Select a CSV file with transactions
- [ ] Click "Import"
- [ ] Loading indicator shows
- [ ] Success message: "Import successful! X transactions added."
- [ ] Transactions appear in list

#### React Select Warning
- [ ] Open browser console (F12)
- [ ] Look at Console tab
- [ ] No warning about "selected prop on <option>"
- [ ] No errors about React Select

#### Error Cases
- [ ] Try to import invalid CSV
- [ ] Error message appears with details
- [ ] Try to import without selecting file
- [ ] Error: "Please select a file"

### 6. General UI/UX

#### Toast Messages
- [ ] All success messages appear in green toast at bottom-right
- [ ] All error messages appear in red toast
- [ ] Messages auto-dismiss after 3 seconds
- [ ] Multiple messages queue properly

#### Loading States
- [ ] During API calls, relevant buttons show loading icon
- [ ] Buttons are disabled during loading
- [ ] No UI jumps or glitches

#### Console Quality
- [ ] No Uncaught errors
- [ ] No "Failed to fetch" errors when backend is running
- [ ] No "undefined" reference errors
- [ ] No React warnings about keys or props
- [ ] No TypeScript/ESLint warnings

#### Browser Responsiveness
- [ ] All pages work on desktop (1440px+)
- [ ] Forms are accessible and keyboard-navigable
- [ ] Modals are properly centered
- [ ] No layout shifts

## Test Execution Order

1. Start both servers (Backend: 5001, Frontend: 3001)
2. Open http://localhost:3001 in browser
3. Open DevTools console (F12)
4. Visit each page in order: Dashboard → Transactions → Goals → Budgets → Import/Export
5. Test features on each page
6. Verify no console errors
7. Stop backend and test error handling
8. Start backend and verify recovery

## Issues Found

- [ ] No issues found - all features working
- [ ] Issues (list below):

## Sign-Off

Tester: _______________
Date: _______________
Status: ☐ PASS ☐ FAIL

Notes:
_____________________________________________________________________________
