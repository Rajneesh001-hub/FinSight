# FinSight - Personal Finance Dashboard

A modern, responsive personal finance dashboard built with React, Tailwind CSS, and Vite. Designed specifically for Indian users to track spending, budgets, and financial goals.

## Features

✨ **Dashboard Overview** - Summary cards showing total balance, income, expenses, and savings with trend indicators

📊 **Spending Visualization** - Interactive donut chart showing spending breakdown by category

📈 **Income vs Expenses** - 6-month bar chart comparison showing financial trends

💰 **Budget Tracking** - Monthly budget progress bars with color-coded status (green/amber/red)

🎯 **Financial Goals** - Track progress toward financial milestones with visual progress indicators

📋 **Transaction History** - Searchable, filterable table of recent transactions with full details

🔐 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 with Functional Components & Hooks
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data**: Mock data (easily extendable with real API)

## Color Scheme

- **Primary Teal**: `#2F6F63` - Trust and stability
- **Accent Mint**: `#9BE7D3` - Highlight and active states
- **Page Background**: `#F6F7F9` - Off-white for comfort
- **Card Background**: `#FFFFFF` - Clean white
- **Status Colors**: Green (income/positive), Red (expenses/over-budget), Amber (warnings)

## Project Structure

```
src/
├── components/        # Reusable React components
│   ├── Sidebar.jsx
│   ├── TopBar.jsx
│   ├── DashboardHeader.jsx
│   ├── SummaryCard.jsx
│   ├── ChartComponents.jsx
│   ├── BudgetSection.jsx
│   ├── GoalsSection.jsx
│   └── TransactionsTable.jsx
├── pages/            # Page components
│   └── Dashboard.jsx
├── data/             # Mock data and constants
│   └── mockData.js
├── utils/            # Utility functions
│   └── formatting.js
├── styles/           # Global styles
│   └── globals.css
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features Explained

### Summary Cards
Four summary cards display key financial metrics:
- **Total Balance**: Overall account balance with monthly change
- **Income**: Monthly income with trend
- **Expenses**: Monthly spending with trend
- **Savings Retained**: Net savings with trend

### Spending by Category
Interactive donut chart showing spending breakdown:
- Rent, Food, Shopping, Transport, Bills, Other
- Color-coded segments with legend
- Total outflow and category percentages

### Income vs Expenses
6-month trailing bar chart:
- Compares income (dark teal) vs expenses (light teal)
- Shows financial trends and patterns
- Hover for exact amounts

### Monthly Budgets
Progress-based budget tracking:
- Green: On track (under limit)
- Amber: Near limit (90%+)
- Red: Over budget
- Shows amount spent, limit, and remaining

### Financial Goals
Visual progress toward goals:
- Emergency Reserve, Workstation, Travel, etc.
- Shows saved amount, target, and due date
- Percentage funded indicator

### Recent Transactions
Searchable transaction table with:
- Date, description, category, account, amount
- Category tags with color coding
- Search and filter capabilities
- CSV export option

## Formatting

### Indian Currency Format
All amounts display in Indian Rupee format:
- ₹8,42,850 (not ₹842,850)
- ₹1,25,000 (not ₹125,000)
- Proper comma placement per Indian number system

### Date Format
- October 24, 2026 (short format)
- Used throughout for consistency

## Accessibility

✅ WCAG 2.1 AA compliant
- Strong text contrast ratios
- Keyboard navigation support
- Semantic HTML structure
- ARIA labels where needed
- Focus indicators for all interactive elements

## Responsive Design

- **Desktop** (1200px+): Full multi-column layout
- **Tablet** (768px-1199px): Optimized 2-column sections
- **Mobile** (<768px): Single column with collapsible sidebar

## Future Enhancements

- Backend API integration
- User authentication & authorization
- Real bank account connections
- Advanced reporting and analytics
- Transaction categorization
- Recurring transaction detection
- Budget alerts and notifications
- Mobile app (React Native)
- Dark mode theme

## Contributing

Contributions welcome! Please follow the existing code style and structure.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For questions or issues, please create an issue in the repository or contact the development team.

---

**Built with ❤️ for Indian entrepreneurs and individuals managing their finances.**
