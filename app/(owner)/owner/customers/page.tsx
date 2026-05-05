"use client"

import { useEffect, useState } from "react"
import {
  createCustomerIfNotExists,
  getCustomers,
  searchCustomersByName,
} from "@/lib/customers"

export default function CustomersPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [customerType, setCustomerType] = useState<"retail" | "project" | "both">("retail")
  const [notes, setNotes] = useState("")
  const [customers, setCustomers] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState("")

  const loadCustomers = () => {
    setCustomers(getCustomers())
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleNameChange = (value: string) => {
    setName(value)
    setSelectedCustomerId("")

    if (value.trim()) {
      setSuggestions(searchCustomersByName(value))
    } else {
      setSuggestions([])
    }
  }

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomerId(customer.id)
    setName(customer.name)
    setPhone(customer.phone)
    setAddress(customer.address)
    setCustomerType(customer.customerType)
    setNotes(customer.notes)
    setSuggestions([])
  }

  const handleSaveCustomer = () => {
    if (!name.trim() || !phone.trim()) return

    createCustomerIfNotExists({
      name,
      phone,
      address,
      customerType,
      notes,
    })

    setName("")
    setPhone("")
    setAddress("")
    setCustomerType("retail")
    setNotes("")
    setSuggestions([])
    setSelectedCustomerId("")
    loadCustomers()
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="mt-2 text-slate-300">
          Search existing customer or create new customer
        </p>
      </div>

      <div className="rounded-xl bg-slate-800 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Customer Form</h2>

        <div className="space-y-2">
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Customer Name"
            className="w-full rounded-md bg-white px-4 py-3 text-black"
          />

          {suggestions.length > 0 && (
            <div className="rounded-md bg-white text-black shadow">
              {suggestions.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => handleSelectCustomer(customer)}
                  className="block w-full border-b px-4 py-3 text-left hover:bg-slate-100"
                >
                  {customer.name} - {customer.phone}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <select
          value={customerType}
          onChange={(e) =>
            setCustomerType(e.target.value as "retail" | "project" | "both")
          }
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        >
          <option value="retail">Retail</option>
          <option value="project">Project</option>
          <option value="both">Both</option>
        </select>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <button
          onClick={handleSaveCustomer}
          className="rounded-md bg-green-500 px-5 py-3 font-semibold text-white"
        >
          {selectedCustomerId ? "Use Selected Customer" : "Save Customer"}
        </button>
      </div>

      <div className="rounded-xl bg-slate-800 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Customer List</h2>

        {customers.length === 0 ? (
          <p className="text-slate-400">No customers added yet.</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="rounded-lg border border-slate-700 p-4">
              <p className="font-semibold text-white">{customer.name}</p>
              <p className="mt-1 text-sm text-slate-300">Phone: {customer.phone}</p>
              <p className="mt-1 text-sm text-slate-300">Address: {customer.address || "-"}</p>
              <p className="mt-1 text-sm text-slate-300">
                Type: {customer.customerType}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Notes: {customer.notes || "-"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}