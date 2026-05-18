"use client"

import { useEffect, useState } from "react"
import {
  createCustomerIfNotExists,
  getCustomers,
  searchCustomersByName,
} from "@/lib/customers"
import { getProducts, reduceProductStock } from "@/lib/products"
import { addSale, getSalesByEmployee } from "@/lib/sales"
import { printSaleBill } from "@/lib/sale-bill-print"
import { Sale, SaleItem, WarrantyUnit } from "@/types/sale"

type CustomerRecord = {
  id: string
  name: string
  phone: string
  address: string
  customerType?: string
  notes?: string
}

type ProductRecord = {
  id: string
  category?: string
  productName: string
  companyName: string
  powerRating: string
  stock: number
  unitPrice: number
}

const createBlankItem = (): SaleItem => ({
  id: `item-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  productId: "",
  productName: "",
  companyName: "",
  powerRating: "",
  quantity: 1,
  unitPrice: 0,
  totalAmount: 0,
  warrantyDuration: 0,
  warrantyUnit: "months",
  warrantyStartDate: "",
  warrantyExpiryDate: "",
})

export default function EmployeeSalesPage() {
  const [mounted, setMounted] = useState(false)

  const [employeeId, setEmployeeId] = useState("")
  const [employeeName, setEmployeeName] = useState("")

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [customerNotes, setCustomerNotes] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState("")

  const [saleItems, setSaleItems] = useState<SaleItem[]>([
    {
      id: "item-1",
      productId: "",
      productName: "",
      companyName: "",
      powerRating: "",
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
      warrantyDuration: 0,
      warrantyUnit: "months",
      warrantyStartDate: "",
      warrantyExpiryDate: "",
    },
  ])

  const [paidAmount, setPaidAmount] = useState("")
  const [soldDate, setSoldDate] = useState("")

  const [customers, setCustomers] = useState<CustomerRecord[]>([])
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [suggestions, setSuggestions] = useState<CustomerRecord[]>([])
  const [productSearch, setProductSearch] = useState<Record<string, string>>({})

  const loadData = (empId: string) => {
    setCustomers(getCustomers())
    setProducts(getProducts())
    setSales(getSalesByEmployee(empId))
  }

  useEffect(() => {
    setMounted(true)

    const today = new Date().toISOString().split("T")[0]
    setSoldDate(today)

    const rawUser = localStorage.getItem("nsh_user")
    if (!rawUser) return

    const user = JSON.parse(rawUser)
    const currentEmployeeId = user.employeeId || ""
    const currentEmployeeName = user.name || ""

    setEmployeeId(currentEmployeeId)
    setEmployeeName(currentEmployeeName)

    if (currentEmployeeId) {
      loadData(currentEmployeeId)
    }
  }, [])

  const totalAmount = saleItems.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  )
  const parsedPaidAmount = Number(paidAmount) || 0
  const balanceAmount = Math.max(0, totalAmount - parsedPaidAmount)

  const paymentStatus: "paid" | "partial" | "unpaid" =
    parsedPaidAmount <= 0 ? "unpaid" : balanceAmount === 0 ? "paid" : "partial"

  const calculateWarrantyExpiry = (
    startDate: string,
    duration: number,
    unit: WarrantyUnit
  ) => {
    if (!startDate) return ""

    const date = new Date(`${startDate}T00:00:00`)

    if (unit === "years") {
      date.setFullYear(date.getFullYear() + duration)
    } else {
      date.setMonth(date.getMonth() + duration)
    }

    return date.toISOString().split("T")[0]
  }

  const getProductMatches = (itemId: string) => {
    const searchValue = (productSearch[itemId] || "").toLowerCase().trim()

    if (!searchValue) return []

    return products
      .filter((product) => {
        const text = `${product.category || ""} ${product.productName || ""} ${
          product.companyName || ""
        } ${product.powerRating || ""}`.toLowerCase()

        return text.includes(searchValue)
      })
      .slice(0, 8)
  }

  const handleCustomerNameChange = (value: string) => {
    setCustomerName(value)
    setSelectedCustomerId("")

    if (value.trim()) {
      setSuggestions(searchCustomersByName(value))
    } else {
      setSuggestions([])
    }
  }

  const handleSelectCustomer = (customer: CustomerRecord) => {
    setSelectedCustomerId(customer.id)
    setCustomerName(customer.name)
    setCustomerPhone(customer.phone)
    setCustomerAddress(customer.address || "")
    setCustomerNotes(customer.notes || "")
    setSuggestions([])
  }

  const handleAddItem = () => {
    setSaleItems((prev) => [...prev, createBlankItem()])
  }

  const handleRemoveItem = (id: string) => {
    setSaleItems((prev) =>
      prev.length === 1 ? prev : prev.filter((item) => item.id !== id)
    )

    setProductSearch((prev) => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
  }

  const handleProductChange = (itemId: string, productId: string) => {
    const product = products.find((p) => p.id === productId)

    setSaleItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item

        if (!product) {
          return {
            ...item,
            productId: "",
            productName: "",
            companyName: "",
            powerRating: "",
            unitPrice: 0,
            totalAmount: 0,
          }
        }

        return {
          ...item,
          productId: product.id,
          productName: product.productName,
          companyName: product.companyName,
          powerRating: product.powerRating || "",
          unitPrice: Number(product.unitPrice || 0),
          totalAmount: Number(item.quantity || 0) * Number(product.unitPrice || 0),
        }
      })
    )

    if (product) {
      setProductSearch((prev) => ({
        ...prev,
        [itemId]: `${product.companyName} ${product.productName} ${
          product.powerRating || ""
        }`.trim(),
      }))
    }
  }

  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = Number(value) || 0

    setSaleItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              totalAmount: quantity * Number(item.unitPrice || 0),
            }
          : item
      )
    )
  }

  const handleWarrantyDurationChange = (itemId: string, value: string) => {
    const duration = Number(value) || 0

    setSaleItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              warrantyDuration: duration,
              warrantyStartDate: soldDate,
              warrantyExpiryDate: calculateWarrantyExpiry(
                soldDate,
                duration,
                item.warrantyUnit
              ),
            }
          : item
      )
    )
  }

  const handleWarrantyUnitChange = (itemId: string, unit: WarrantyUnit) => {
    setSaleItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              warrantyUnit: unit,
              warrantyStartDate: soldDate,
              warrantyExpiryDate: calculateWarrantyExpiry(
                soldDate,
                item.warrantyDuration,
                unit
              ),
            }
          : item
      )
    )
  }

  const handleSaleDateChange = (value: string) => {
    setSoldDate(value)

    setSaleItems((prev) =>
      prev.map((item) => ({
        ...item,
        warrantyStartDate: value,
        warrantyExpiryDate: calculateWarrantyExpiry(
          value,
          item.warrantyDuration,
          item.warrantyUnit
        ),
      }))
    )
  }

  const resetForm = () => {
    setCustomerName("")
    setCustomerPhone("")
    setCustomerAddress("")
    setCustomerNotes("")
    setSelectedCustomerId("")
    setSaleItems([
      {
        id: "item-1",
        productId: "",
        productName: "",
        companyName: "",
        powerRating: "",
        quantity: 1,
        unitPrice: 0,
        totalAmount: 0,
        warrantyDuration: 0,
        warrantyUnit: "months",
        warrantyStartDate: "",
        warrantyExpiryDate: "",
      },
    ])
    setPaidAmount("")
    setSuggestions([])
    setProductSearch({})
    setSoldDate(new Date().toISOString().split("T")[0])
  }

  const handleCreateSale = () => {
    if (!employeeId) {
      alert("Employee login not found")
      return
    }

    if (!customerName.trim()) {
      alert("Enter customer name")
      return
    }

    if (!customerPhone.trim()) {
      alert("Enter customer phone number")
      return
    }

    if (saleItems.some((item) => !item.productId)) {
      alert("Select product for every item")
      return
    }

    if (saleItems.some((item) => item.quantity <= 0)) {
      alert("Quantity must be greater than 0 for every item")
      return
    }

    const requestedByProduct = saleItems.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.productId] = (acc[item.productId] || 0) + item.quantity
        return acc
      },
      {}
    )

    for (const productId of Object.keys(requestedByProduct)) {
      const product = products.find((p) => p.id === productId)

      if (!product) {
        alert("Product not found")
        return
      }

      if (requestedByProduct[productId] > product.stock) {
        alert(`Only ${product.stock} stock available for ${product.productName}`)
        return
      }
    }

    if (parsedPaidAmount < 0) {
      alert("Paid amount cannot be negative")
      return
    }

    if (parsedPaidAmount > totalAmount) {
      alert("Paid amount cannot be more than total amount")
      return
    }

    const existingCustomer =
      selectedCustomerId &&
      customers.find((customer) => customer.id === selectedCustomerId)

    const customer = existingCustomer
      ? existingCustomer
      : createCustomerIfNotExists({
          name: customerName.trim(),
          phone: customerPhone.trim(),
          address: customerAddress.trim(),
          customerType: "retail",
          notes: customerNotes.trim(),
        })

    const finalItems = saleItems.map((item) => ({
      ...item,
      warrantyStartDate: soldDate,
      warrantyExpiryDate: calculateWarrantyExpiry(
        soldDate,
        item.warrantyDuration,
        item.warrantyUnit
      ),
    }))

    const newSale: Sale = {
      id: `${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      items: finalItems,
      totalAmount,
      paidAmount: parsedPaidAmount,
      balanceAmount,
      paymentStatus,
      soldByEmployeeId: employeeId,
      soldByEmployeeName: employeeName,
      soldDate,
    }

    addSale(newSale)

    finalItems.forEach((item) => {
      reduceProductStock(item.productId, item.quantity)
    })

    resetForm()
    loadData(employeeId)
  }

  const totalPaid = sales.reduce(
    (sum, sale) => sum + Number(sale.paidAmount || 0),
    0
  )
  const totalBalance = sales.reduce(
    (sum, sale) => sum + Number(sale.balanceAmount || 0),
    0
  )

  const getDisplayItems = (sale: Sale): SaleItem[] => {
    if (sale.items && sale.items.length > 0) return sale.items

    return [
      {
        id: sale.productId || sale.id,
        productId: sale.productId || "",
        productName: sale.productName || "",
        companyName: sale.companyName || "",
        powerRating: sale.powerRating || "",
        quantity: sale.quantity || 0,
        unitPrice: sale.unitPrice || 0,
        totalAmount: sale.totalAmount || 0,
        warrantyDuration: sale.warrantyDurationMonths || 0,
        warrantyUnit: "months",
        warrantyStartDate: sale.warrantyStartDate || sale.soldDate,
        warrantyExpiryDate: sale.warrantyExpiryDate || "",
      },
    ]
  }

  if (!mounted) return null

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold text-white">Retail Sales</h1>
        <p className="mt-2 text-slate-400">
          Create multi-product sales with separate warranty for every product.
        </p>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
          <p>
            Logged in as:{" "}
            <span className="font-semibold text-white">
              {employeeName || "-"} {employeeId ? `(${employeeId})` : ""}
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">My Sales</p>
          <p className="mt-2 text-2xl font-bold text-white">{sales.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Amount Collected</p>
          <p className="mt-2 text-2xl font-bold text-green-400">
            ₹{totalPaid.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Balance Pending</p>
          <p className="mt-2 text-2xl font-bold text-yellow-400">
            ₹{totalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">Customer Details</h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="relative">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Customer Name
            </label>
            <input
              value={customerName}
              onChange={(e) => handleCustomerNameChange(e.target.value)}
              placeholder="Search or enter customer name"
              className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
            />

            {suggestions.length > 0 && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl bg-white text-black shadow-xl">
                {suggestions.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => handleSelectCustomer(customer)}
                    className="block w-full border-b px-4 py-3 text-left hover:bg-slate-100"
                  >
                    <span className="font-semibold">{customer.name}</span>
                    <span className="ml-2 text-sm text-slate-600">
                      {customer.phone}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Phone Number
            </label>
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Customer phone number"
              className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Address
            </label>
            <input
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Customer address"
              className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Notes
            </label>
            <textarea
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="Optional notes"
              className="min-h-24 w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Sale Items</h2>
            <p className="mt-1 text-sm text-slate-400">
              Search product by category, company, product name or power rating.
            </p>
          </div>

          <button
            onClick={handleAddItem}
            className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {saleItems.map((item, index) => {
            const selectedProduct = products.find(
              (product) => product.id === item.productId
            )
            const matches = getProductMatches(item.id)

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-semibold text-white">
                    Product {index + 1}
                  </p>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-5 md:grid-cols-4">
                  <div className="relative md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Product
                    </label>
                    <input
                      value={productSearch[item.id] || ""}
                      onChange={(e) => {
                        setProductSearch((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))

                        setSaleItems((prev) =>
                          prev.map((saleItem) =>
                            saleItem.id === item.id
                              ? {
                                  ...saleItem,
                                  productId: "",
                                  productName: "",
                                  companyName: "",
                                  powerRating: "",
                                  unitPrice: 0,
                                  totalAmount: 0,
                                }
                              : saleItem
                          )
                        )
                      }}
                      placeholder="Search by category, company, product name or power rating"
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    />

                    {matches.length > 0 && !item.productId && (
                      <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl bg-white text-black shadow-xl">
                        {matches.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() =>
                              handleProductChange(item.id, product.id)
                            }
                            className="block w-full border-b px-4 py-3 text-left hover:bg-slate-100"
                          >
                            <div className="font-semibold">
                              {product.companyName} {product.productName}
                            </div>
                            <div className="mt-1 text-sm text-slate-600">
                              Category: {product.category || "-"} | Power:{" "}
                              {product.powerRating || "-"} | Stock:{" "}
                              {product.stock} | ₹{product.unitPrice}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Item Total
                    </label>
                    <div className="flex h-[48px] items-center rounded-xl border border-slate-800 bg-slate-900 px-4 font-bold text-green-400">
                      ₹{Number(item.totalAmount || 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Warranty Duration
                    </label>
                    <input
                      type="number"
                      value={item.warrantyDuration}
                      onChange={(e) =>
                        handleWarrantyDurationChange(item.id, e.target.value)
                      }
                      placeholder="Duration"
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Warranty Unit
                    </label>
                    <select
                      value={item.warrantyUnit}
                      onChange={(e) =>
                        handleWarrantyUnitChange(
                          item.id,
                          e.target.value as WarrantyUnit
                        )
                      }
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    >
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Warranty Expiry
                    </label>
                    <div className="flex h-[48px] items-center rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm font-semibold text-white">
                      {item.warrantyExpiryDate || "-"}
                    </div>
                  </div>
                </div>

                {selectedProduct && (
                  <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-5">
                    <p>Category: {selectedProduct.category || "-"}</p>
                    <p>Company: {selectedProduct.companyName}</p>
                    <p>Power: {selectedProduct.powerRating || "-"}</p>
                    <p>Stock: {selectedProduct.stock}</p>
                    <p>Unit Price: ₹{selectedProduct.unitPrice}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Paid Amount
            </label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              placeholder="Amount received"
              className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Sale Date
            </label>
            <input
              type="date"
              value={soldDate}
              onChange={(e) => handleSaleDateChange(e.target.value)}
              className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Total Amount</p>
            <p className="mt-2 text-xl font-bold text-white">
              ₹{totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Balance</p>
            <p className="mt-2 text-xl font-bold text-yellow-400">
              ₹{balanceAmount.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Payment Status</p>
            <p
              className={`mt-2 text-xl font-bold ${
                paymentStatus === "paid"
                  ? "text-green-400"
                  : paymentStatus === "partial"
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              {paymentStatus.toUpperCase()}
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateSale}
          className="mt-6 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
        >
          Save Sale
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">My Sales</h2>

        {sales.length === 0 ? (
          <p className="mt-4 text-slate-400">No sales added yet.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {sale.customerName}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Sale Date: {sale.soldDate}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => printSaleBill(sale)}
                      className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Print Bill
                    </button>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        sale.paymentStatus === "paid"
                          ? "bg-green-500/20 text-green-400"
                          : sale.paymentStatus === "partial"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {sale.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4">
                  {getDisplayItems(sale).map((item, index) => (
                    <div
                      key={item.id}
                      className="border-b border-slate-800 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-slate-300">
                          {index + 1}. {item.productName} | {item.companyName} |{" "}
                          {item.powerRating || "-"}
                        </p>
                        <p className="text-sm font-semibold text-white">
                          {item.quantity} × ₹{Number(item.unitPrice || 0).toFixed(2)} = ₹
                          {Number(item.totalAmount || 0).toFixed(2)}
                        </p>
                      </div>

                      <p className="mt-2 text-sm text-slate-400">
                        Warranty: {item.warrantyDuration} {item.warrantyUnit} |{" "}
                        Expiry: {item.warrantyExpiryDate || "-"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
                  <p>Total: ₹{Number(sale.totalAmount || 0).toFixed(2)}</p>
                  <p>Paid: ₹{Number(sale.paidAmount || 0).toFixed(2)}</p>
                  <p>Balance: ₹{Number(sale.balanceAmount || 0).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}