"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/lib/products"

export default function EmployeeInventoryPage() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    setProducts(getProducts())
  }, [])

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">Inventory</h1>
        <p className="mt-2 text-slate-300">
          View available stock items
        </p>
      </div>

      <div className="space-y-4 rounded-xl bg-slate-800 p-6">
        {products.length === 0 ? (
          <p className="text-slate-400">No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="rounded-lg border border-slate-700 p-4">
              <p className="font-semibold text-white">{product.productName}</p>
              <p className="mt-1 text-sm text-slate-300">
                Category: {product.category}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Company: {product.companyName}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Power Rating: {product.powerRating || "-"}
              </p>
              <p className="mt-1 text-sm font-semibold text-emerald-400">
                Stock Left: {product.stock}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}