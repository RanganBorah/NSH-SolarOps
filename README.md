# NSH SolarOps

NSH SolarOps is a solar business operations web application built for managing the daily workflow of **Nagaon Solar House**. The app helps owners and employees manage employees, attendance, inventory, customers, quotations, tax invoices, retail sales, printable sales bills, and reports from one dashboard.

## Project Overview

This project was created as a business management system for a solar products and services company. It includes separate owner and employee workflows so that business operations can be managed in an organized way.

The system is currently built using local browser storage for data handling, making it suitable for testing, demonstration, and initial deployment. A database such as Supabase can be integrated later for real multi-user production use.

## Features

### Owner Panel

- Owner dashboard
- Employee management
- Attendance tracking
- Customer management
- Project management
- Inventory management
- Quotation management
- Tax invoice management
- Sales tracking
- Work board
- Reports overview

### Employee Panel

- Employee dashboard
- Customer entry and search
- Inventory stock view
- Quotation generation
- Sales entry
- Multi-product sales billing
- Product-wise warranty entry
- Printable customer sales bill

### Inventory Module

- Add products manually
- Manual product category entry
- Company name
- Product name
- Power rating
- Stock quantity
- Unit price
- Low stock alert
- Stock reduction after sales

### Sales Module

- Search customer by name
- Add new customer during sale
- Search products by category, company, product name, or power rating
- Add multiple products in one sale
- Product-wise quantity
- Product-wise warranty duration
- Warranty in months or years
- Automatic total amount calculation
- Paid amount and balance calculation
- Payment status: paid, partial, unpaid
- Automatic stock reduction
- Printable customer sales bill

### Quotation Module

- Owner and employee quotation generation
- Add multiple quotation items
- Quantity, unit, rate, and total calculation
- Automatic subtotal
- Automatic round-off
- Amount in words
- Professional quotation print layout
- PDF/print support

### Tax Invoice Module

- Tax invoice creation
- Item-wise invoice details
- GST calculation support
- Printable invoice view

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- LocalStorage
- Lucide React Icons
- Vercel deployment ready

## Folder Structure

```text
nsh-solarops/
├── app/
│   ├── (owner)/
│   │   └── owner/
│   │       ├── dashboard/
│   │       ├── employees/
│   │       ├── attendance/
│   │       ├── customers/
│   │       ├── inventory/
│   │       ├── projects/
│   │       ├── quotations/
│   │       ├── invoices/
│   │       ├── sales/
│   │       ├── work/
│   │       └── reports/
│   ├── (employee)/
│   │   └── employee/
│   │       ├── dashboard/
│   │       ├── customers/
│   │       ├── inventory/
│   │       ├── projects/
│   │       ├── quotations/
│   │       ├── invoices/
│   │       └── sales/
│   └── login/
├── components/
├── lib/
├── public/
├── types/
├── package.json
└── README.md
