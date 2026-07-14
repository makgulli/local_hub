import { defineStore } from 'pinia'
import { loadAllItems, searchItems } from '@/services/dataService'
import { DEFAULT_ORIGIN, estimateTravelCost } from '@/services/payPlannerService'

const LAST_DESTINATION_KEY = 'localhub:payplanner:lastDestination'

export const usePayPlannerStore = defineStore('payPlanner', {
  state: () => ({
    isOpen: false,
    origin: null, // { lat, lon, label }
    originStatus: 'idle', // 'idle' | 'loading' | 'granted' | 'denied' | 'unsupported'
    allItems: [],
    itemsLoaded: false,
    keyword: '',
    candidates: [],
    destination: null, // 선택된 목적지 아이템
    result: null, // estimateTravelCost() 결과
  }),
  actions: {
    toggle() {
      this.isOpen = !this.isOpen
      if (this.isOpen) this.init()
    },

    /** 배너를 열 때 최초 1회: 위치 요청 + 데이터 로드 + 마지막 목적지 복원 */
    async init() {
      if (!this.origin) await this.requestLocation()
      if (!this.itemsLoaded) await this.loadItems()
      this.restoreLastDestination()
    },

    /** 브라우저 Geolocation API로 현재 위치 확보, 거부/미지원 시 기본 위치 사용 */
    requestLocation() {
      this.originStatus = 'loading'
      return new Promise((resolve) => {
        if (!('geolocation' in navigator)) {
          this.origin = DEFAULT_ORIGIN
          this.originStatus = 'unsupported'
          resolve()
          return
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.origin = {
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
              label: '현재 위치',
            }
            this.originStatus = 'granted'
            this.recalculate()
            resolve()
          },
          () => {
            this.origin = DEFAULT_ORIGIN
            this.originStatus = 'denied'
            resolve()
          },
          { timeout: 5000 }
        )
      })
    },

    useDefaultOrigin() {
      this.origin = DEFAULT_ORIGIN
      this.originStatus = 'denied'
      this.recalculate()
    },

    async loadItems() {
      this.allItems = await loadAllItems()
      this.itemsLoaded = true
      this.candidates = this.allItems.filter((i) => i.lat && i.lng).slice(0, 8)
    },

    setKeyword(keyword) {
      this.keyword = keyword
      if (!keyword.trim()) {
        this.candidates = this.allItems.filter((i) => i.lat && i.lng).slice(0, 8)
        return
      }
      this.candidates = searchItems(
        this.allItems.filter((i) => i.lat && i.lng),
        keyword,
        8
      )
    },

    selectDestination(item) {
      this.destination = item
      localStorage.setItem(LAST_DESTINATION_KEY, JSON.stringify(item))
      this.recalculate()
    },

    restoreLastDestination() {
      if (this.destination) return
      try {
        const raw = localStorage.getItem(LAST_DESTINATION_KEY)
        if (raw) {
          this.destination = JSON.parse(raw)
          this.recalculate()
        }
      } catch {
        // 저장된 값이 손상된 경우 무시
      }
    },

    recalculate() {
      if (!this.origin || !this.destination?.lat || !this.destination?.lng) {
        this.result = null
        return
      }
      this.result = estimateTravelCost(this.origin, {
        lat: this.destination.lat,
        lon: this.destination.lng,
      })
    },
  },
})
