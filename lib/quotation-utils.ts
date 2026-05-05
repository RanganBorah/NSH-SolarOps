export const calculateQuotationSubtotal = (
  items: { qty: number; rate: number }[]
) => {
  return items.reduce((sum, item) => sum + item.qty * item.rate, 0)
}

export const calculateRoundedTotal = (amount: number) => {
  return Math.ceil(amount)
}

export const calculateRoundOff = (amount: number) => {
  const rounded = Math.ceil(amount)
  return Number((rounded - amount).toFixed(2))
}

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
]

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
]

const convertTwoDigits = (num: number): string => {
  if (num < 20) return ones[num]
  const ten = Math.floor(num / 10)
  const unit = num % 10
  return tens[ten] + (unit ? `-${ones[unit]}` : "")
}

const convertThreeDigits = (num: number): string => {
  const hundred = Math.floor(num / 100)
  const rest = num % 100
  let result = ""

  if (hundred) result += `${ones[hundred]} Hundred`
  if (rest) result += `${result ? " " : ""}${convertTwoDigits(rest)}`
  return result
}

export const numberToWords = (num: number): string => {
  if (num === 0) return "Rupees Zero Only"

  const crore = Math.floor(num / 10000000)
  num %= 10000000

  const lakh = Math.floor(num / 100000)
  num %= 100000

  const thousand = Math.floor(num / 1000)
  num %= 1000

  const hundredPart = num

  let result = ""

  if (crore) result += `${convertThreeDigits(crore)} Crore `
  if (lakh) result += `${convertThreeDigits(lakh)} Lakh `
  if (thousand) result += `${convertThreeDigits(thousand)} Thousand `
  if (hundredPart) result += `${convertThreeDigits(hundredPart)} `

  return `Rupees ${result.trim()} Only`
}

export const generateQuotationNumber = (count: number) => {
  const year = new Date().getFullYear()
  return `NSH/Q/${String(count + 1).padStart(2, "0")}/${year}`
}