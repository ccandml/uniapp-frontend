import type { AddressItem } from '@/types/address'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddressStore = defineStore('addressStore', () => {
  const addressSelectedItem = ref<AddressItem>()

  const selectAddress = (val: AddressItem) => {
    addressSelectedItem.value = val
  }
  return {
    addressSelectedItem,
    selectAddress,
  }
})
