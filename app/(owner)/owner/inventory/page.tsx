"use client"

import { useEffect, useState } from "react"
import { addProduct, getLowStockProducts, getProducts } from "@/lib/products"

export default function InventoryPage() {
  const [category, setCategory] = useState("")
  const [productName, setProductName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [powerRating, setPowerRating] = useState("")
  const [stock, setStock] = useState("")
  const [unitPrice, setUnitPrice] = useState("")
  const [lowStockAlert, setLowStockAlert] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])

  const loadData = () => {
    setProducts(getProducts())
    setLowStockProducts(getLowStockProducts())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddProduct = () => {
    if (!category.trim()) {
      alert("Enter product category")
      return
    }

    if (!productName.trim()) {
      alert("Enter product name")
      return
    }

    if (!companyName.trim()) {
      alert("Enter company name")
      return
    }

    const newProduct = {
      id: Date.now().toString(),
      category: category.trim(),
      productName: productName.trim(),
      companyName: companyName.trim(),
      powerRating: powerRating.trim(),
      stock: Number(stock) || 0,
      unitPrice: Number(unitPrice) || 0,
      lowStockAlert: Number(lowStockAlert) || 0,
    }

    addProduct(newProduct)

    setCategory("")
    setProductName("")
    setCompanyName("")
    setPowerRating("")
    setStock("")
    setUnitPrice("")
    setLowStockAlert("")
    loadData()
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">Inventory</h1>
        <p className="mt-2 text-slate-300">
          Manage stock, company name and power rating.
        </p>
      </div>

      <div className="space-y-4 rounded-xl bg-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">Add Product</h2>

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category, example: Solar Panel, Battery, Wire, Structure"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company Name"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          value={powerRating}
          onChange={(e) => setPowerRating(e.target.value)}
          placeholder="Power Rating"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock Quantity"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          type="number"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          placeholder="Unit Price"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          type="number"
          value={lowStockAlert}
          onChange={(e) => setLowStockAlert(e.target.value)}
          placeholder="Low Stock Alert"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <button
          onClick={handleAddProduct}
          className="rounded-md bg-green-500 px-5 py-3 font-semibold text-white"
        >
          Add Product
        </button>
      </div>

      <div className="space-y-4 rounded-xl bg-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">Low Stock Alerts</h2>

        {lowStockProducts.length === 0 ? (
          <p className="text-slate-400">No low stock alerts.</p>
        ) : (
          lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border border-red-500/40 p-4"
            >
              <p className="font-semibold text-white">{product.productName}</p>
              <p className="mt-1 text-sm text-slate-300">
                Category: {product.category || "-"}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Company: {product.companyName}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Power Rating: {product.powerRating || "-"}
              </p>
              <p className="mt-1 text-sm text-red-400">
                Stock: {product.stock}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="space-y-4 rounded-xl bg-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">Product List</h2>

        {products.length === 0 ? (
          <p className="text-slate-400">No products added yet.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border border-slate-700 p-4"
            >
              <p className="font-semibold text-white">{product.productName}</p>
              <p className="mt-1 text-sm text-slate-300">
                Category: {product.category || "-"}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Company: {product.companyName}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Power Rating: {product.powerRating || "-"}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Stock: {product.stock}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Unit Price: ₹{product.unitPrice}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Low Alert: {product.lowStockAlert}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}