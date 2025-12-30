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

async function syncProductsFromSeed() {
  const existing = await getDocs(productsCollection)
  const existingProducts = new Map(existing.docs.map((document) => [document.id, document.data()]))

  const operations = seedProducts.map((product) => {
    const basePayload = existingProducts.has(product.id)
      ? product
      : { ...product, createdAt: serverTimestamp() }

    return setDoc(doc(productsCollection, product.id), basePayload, { merge: true })
  })

  await Promise.all(operations)
}

export async function fetchProducts() {
  await syncProductsFromSeed()
  const snapshot = await getDocs(productsCollection)
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }))
}

export async function fetchProductById(productId) {
  await syncProductsFromSeed()
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
