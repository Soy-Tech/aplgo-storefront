import { medusa } from "./client"

export async function getProduct(handle: string) {
  const { products } = await medusa.store.product.list({
    handle: [handle],
    fields: "*variants,*variants.prices,*collection,+metadata",
  } as Parameters<typeof medusa.store.product.list>[0])
  const product = products[0]
  if (!product) throw new Error(`Product not found: ${handle}`)
  return product
}

export async function listProducts(collectionId?: string) {
  const query = collectionId
    ? { collection_id: [collectionId], fields: "*variants,*variants.prices,*collection,+metadata" }
    : { fields: "*variants,*variants.prices,*collection,+metadata" }

  const { products } = await medusa.store.product.list(query as Parameters<typeof medusa.store.product.list>[0])
  return products
}

export async function listCollections() {
  const { collections } = await medusa.store.collection.list()
  return collections
}

export async function getCollection(handle: string) {
  const { collections } = await medusa.store.collection.list({
    handle: [handle],
  } as Parameters<typeof medusa.store.collection.list>[0])
  return collections[0] ?? null
}
