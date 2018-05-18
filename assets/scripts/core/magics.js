let baseURL = 'http://localhost:3000/'
const base = (baseURL || '').replace(/\/$/, '')

global.asset = function asset(pathname) {
  return base + pathname
}

const THRESHOLD = 768
global.IS_MOBILE = function isMobile(){
  let width = $(window).width()
  let height = $(window).height()
  let min = Math.min(width, height)
  let isIPad = navigator.userAgent.match(/i(Phone|Pod|Pad)/i) != null
  return min <= THRESHOLD || isIPad
}

global.convertPercentageToString = function convertPercentageToString(value, decimals = 2) {
	let f = parseFloat(value)
	if(isNaN(f))
		return 0
	return (f * 100).toFixed(decimals)
}