import { Product } from "@/types/product"

const STORAGE_KEY = "nsh_products"

export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const addProduct = (product: Product) => {
  if (typeof window === "undefined") return
  const products = getProducts()
  products.push(product)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export const updateProduct = (updatedProduct: Product) => {
  if (typeof window === "undefined") return
  const products = getProducts().map((product) =>
    product.id === updatedProduct.id ? updatedProduct : product
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export const reduceProductStock = (productId: string, quantity: number) => {
  if (typeof window === "undefined") return
  const products = getProducts().map((product) =>
    product.id === productId
      ? { ...product, stock: Math.max(0, product.stock - quantity) }
      : product
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export const increaseProductStock = (productId: string, quantity: number) => {
  if (typeof window === "undefined") return
  const products = getProducts().map((product) =>
    product.id === productId
      ? { ...product, stock: product.stock + quantity }
      : product
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export const getLowStockProducts = () => {
  return getProducts().filter((product) => product.stock <= product.lowStockAlert)
}