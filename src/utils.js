const eachNum = (start, end, str) => {
  const back = []
  for (let i = start; i <= end; i++) {
    back.push({
      value: i,
      label: `${i}${str}`,
    })
  }
  return back
}

export const dayOfWeekList = [
  { label: '周一', value: 2 },
  { label: '周二', value: 3 },
  { label: '周三', value: 4 },
  { label: '周四', value: 5 },
  { label: '周五', value: 6 },
  { label: '周六', value: 7 },
  { label: '周日', value: 1 },
]

export const minuteOfHoursList = eachNum(0, 59, '分')

export const dayOfMonthList = [
  ...eachNum(1, 31, '号'),
  {
    label: '月末',
    value: 'L',
    exclusive: true,
  },
]

export const monthOfYearList = eachNum(1, 12, '月')

export const freqList = [
  { value: 'everyHours', label: '每小时' },
  { value: 'everyday', label: '每天' },
  { value: 'week', label: '每周' },
  { value: 'month', label: '每月' },
  { value: 'year', label: '每年' },
  { value: 'custom', label: '自定义' },
]

const exclusiveDays = dayOfMonthList.filter(d => d.exclusive).map(d => d.value)

export function checkIncludeExclusive(dd) {
  return !!(dd || []).find(d => exclusiveDays.includes(d))
}

export function formatValue(arr, multiple) {
  if (multiple) {
    return arr
  } else if (arr.length > 0) {
    return arr[0]
  } else {
    return ''
  }
}

export function cornFormat(corn, multiple) {
  const value = corn || '0 0 0 * * ? *'
  const cronElements = value.split(' ')
  let [ss, mm, HH, dd, MM, week, yyyy] = cronElements
  let freq
  if (yyyy !== '*' || /[-\/#]/.test(value) || (!multiple && /[,]/.test(value))) {
    freq = 'custom'
  } else if (week !== '?') {
    freq = 'week'
  } else if (MM === '*' && dd === '*' && HH === '*' && mm !== '*' && ss === '0') {
    freq = 'everyHours'
  } else if (MM === '*' && dd === '*') {
    freq = 'everyday'
  } else if (MM === '*') {
    freq = 'month'
  } else if (MM !== '*') {
    freq = 'year'
  }

  return {
    freq,
    stringValue: value,
    ss: parseInt(ss) || 0,
    mm:
      freq === 'everyHours' && !!multiple
        ? mm.split(',').filter(i => !!i)
        : parseInt(mm) || 0,
    HH: parseInt(HH) || 0,
    dd: multiple ? dd.split(',').filter(i => !!i) : dd,
    MM: multiple ? MM.split(',').filter(i => !!i) : MM,
    week: multiple ? week.split(',').filter(i => !!i) : week,
    yyyy,
  }
}

export function cornStringify({ freq, stringValue, ss, mm, HH, dd, MM, week, yyyy }) {
  if (freq === 'custom') {
    return stringValue
  } else if (freq === 'year') {
    week = '?'
    if (!dd || dd.length <= 0) {
      dd = '*'
    }
  } else if (freq === 'month') {
    MM = '*'
    week = '?'
  } else if (freq === 'week') {
    MM = '*'
    dd = '?'
  } else if (freq === 'everyday') {
    MM = '*'
    week = '?'
    dd = '*'
  } else if (freq === 'everyHours') {
    MM = '*'
    week = '?'
    dd = '*'
    HH = '*'
    ss = '0'
  }
  return `${ss} ${mm} ${HH} ${dd} ${MM} ${week} ${yyyy}`
}
