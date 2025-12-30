import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { products as seedProducts } from './products'

const PRODUCTS_COLLECTION = 'productos'
const SALES_COLLECTION = 'ventas'

const productsCollection = collection(db, PRODUCTS_COLLECTION)
const salesCollection = collection(db, SALES_COLLECTION)

async function seedProductsIfEmpty() {
  const existing = await getDocs(productsCollection)

  if (!existing.empty) return

  const operations = seedProducts.map((product) =>
    setDoc(doc(productsCollection, product.id), {
      ...product,
      createdAt: serverTimestamp(),
    }),
  )

  await Promise.all(operations)
}

export async function fetchProducts() {
  await seedProductsIfEmpty()
  const snapshot = await getDocs(productsCollection)
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }))
}

export async function fetchProductById(productId) {
  await seedProductsIfEmpty()
  const reference = doc(productsCollection, productId)
  const snapshot = await getDoc(reference)

  if (!snapshot.exists()) return null

  return { id: snapshot.id, ...snapshot.data() }
}

export async function registerSale({ items, totalItems, totalPrice, buyer }) {
  const payload = {
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
    })),
    totalItems,
    totalPrice,
    buyer: buyer || { origin: 'online' },
    createdAt: serverTimestamp(),
  }

  const reference = await addDoc(salesCollection, payload)
  return reference.id
}
