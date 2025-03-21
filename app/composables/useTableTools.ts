export function useTableTools() {
  function createColumns(data: [] | object, addColumns?: { key: string, label: string }[], options?: { key: string, sortable?: boolean, direction?: string }[]) {
    if (Array.isArray(data)) {
      const columns = ref<any>([])
      if (data[0]) {
        columns.value = Object.keys(data[0]).map(key => {
          return {
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            sortable: options?.find(option => option.key === key)?.sortable || false,
            direction: options?.find(option => option.key === key)?.direction || '',
          }
        })
      }

      if (addColumns) {
        columns.value.push(...addColumns)
      }

      return columns.value

    } else {
      return data
    }
  }

  return {
    createColumns
  }
}
