export const formatPrice = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) return 'N/A'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (Number.isNaN(num)) return 'N/A'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
}

export const formatDate = (value: string | undefined | null): string => {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
