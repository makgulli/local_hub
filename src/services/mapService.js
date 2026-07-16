const KAKAO_SCRIPT_ID = 'kakao-map-script'

let kakaoMapPromise = null

export function loadKakaoMapSdk(appKey) {
  if (!appKey) {
    return Promise.reject(
      new Error('카카오 지도 API 키가 설정되지 않았습니다. 환경 변수에 VITE_KAKAO_MAP_APP_KEY 를 추가해 주세요.')
    )
  }

  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao.maps)
  }

  if (kakaoMapPromise) {
    return kakaoMapPromise
  }

  kakaoMapPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(KAKAO_SCRIPT_ID)
    if (existingScript) {
      existingScript.addEventListener(
        'load',
        () => {
          window.kakao.maps.load(() => resolve(window.kakao.maps))
        },
        { once: true }
      )
      existingScript.addEventListener(
        'error',
        () => {
          reject(new Error('카카오 지도 스크립트를 로드하지 못했습니다.'))
        },
        { once: true }
      )
      return
    }

    const script = document.createElement('script')
    script.id = KAKAO_SCRIPT_ID
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&libraries=services&autoload=false`
    script.async = true

    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao.maps))
    }

    script.onerror = () => {
      reject(new Error('카카오 지도 스크립트를 로드하지 못했습니다.'))
    }

    document.head.appendChild(script)
  })

  return kakaoMapPromise
}