export const conditionLabel = (value: string): string => {
  const labels: Record<string, string> = {
    new: 'New',
    like_new: 'Like New',
    good: 'Good',
    fair: 'Fair',
  }
  return labels[value] || value
}

export const conditionColor = (value: string): string => {
  const colors: Record<string, string> = {
    new: 'text-emerald-700 bg-emerald-50',
    like_new: 'text-emerald-700 bg-emerald-50',
    good: 'text-amber-700 bg-amber-50',
    fair: 'text-orange-700 bg-orange-50',
  }
  return colors[value] || 'text-gray-700 bg-gray-100'
}
