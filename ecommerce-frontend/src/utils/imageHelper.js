/**
 * Dynamic product image helper to supply premium hand-picked images for
 * standard products and dynamic LoremFlickr category fallbacks for new products.
 */
export const getProductImage = (product) => {
  if (!product) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60'
  
  if (product.image && product.image.startsWith('http')) {
    return product.image
  }

  const name = (product.name || '').toLowerCase()

  // Hand-picked premium Unsplash photos matching database seeds
  if (name.includes('iphone')) {
    return 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=60'
  }
  if (name.includes('samsung') || name.includes('galaxy') || name.includes('s25')) {
    return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=60'
  }
  if (name.includes('sony') || name.includes('wh-1000') || name.includes('headphone') || name.includes('xm5')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60'
  }
  if (name.includes('airdopes') || name.includes('earbud') || name.includes('boat')) {
    return 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=60'
  }
  if (name.includes('mouse') || name.includes('logitech') || name.includes('mx master')) {
    return 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60'
  }
  if (name.includes('laptop') || name.includes('dell') || name.includes('inspiron')) {
    return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=60'
  }

  // Dynamic fallback using LoremFlickr with category filter + stable ID lock
  const categoryParam = encodeURIComponent(product.category || 'product')
  const idLock = product._id ? product._id.slice(-6) : '1'
  return `https://loremflickr.com/600/600/${categoryParam}?lock=${idLock}`
}
