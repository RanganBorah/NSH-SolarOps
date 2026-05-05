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

export const numberToWordsWithPaise = (amount: number): string => {
  const rupees = Math.floor(amount)
  const paise = Math.round((amount - rupees) * 100)

  if (paise === 0) return numberToWords(rupees)

  return `Rupees ${numberToWords(rupees).replace("Rupees ", "").replace(" Only", "")} and ${paise} paise Only`
}

export const generateInvoiceNumber = (count: number) => {
  const year = new Date().getFullYear()
  const shortYear = String(year).slice(-2)
  const nextYear = String(year + 1).slice(-2)
  return `B2B/${shortYear}-${nextYear}/${count + 1}`
}

export const calculateTaxableRateFromInclusive = (
  rateInclTax: number,
  cgstRate: number,
  sgstRate: number
) => {
  const totalTaxRate = cgstRate + sgstRate
  return Number((rateInclTax / (1 + totalTaxRate / 100)).toFixed(2))
}

export const calculateInvoiceItem = ({
  quantity,
  rateInclTax,
  cgstRate,
  sgstRate,
}: {
  quantity: number
  rateInclTax: number
  cgstRate: number
  sgstRate: number
}) => {
  const taxableRate = calculateTaxableRateFromInclusive(rateInclTax, cgstRate, sgstRate)
  const amount = Number((quantity * taxableRate).toFixed(2))
  const cgstAmount = Number((amount * cgstRate / 100).toFixed(2))
  const sgstAmount = Number((amount * sgstRate / 100).toFixed(2))
  const totalTaxAmount = Number((cgstAmount + sgstAmount).toFixed(2))

  return {
    taxableRate,
    amount,
    cgstAmount,
    sgstAmount,
    totalTaxAmount,
  }
}

export const calculateInvoiceTotals = (
  items: {
    amount: number
    cgstAmount: number
    sgstAmount: number
  }[]
) => {
  const taxableTotal = Number(items.reduce((sum, item) => sum + item.amount, 0).toFixed(2))
  const cgstTotal = Number(items.reduce((sum, item) => sum + item.cgstAmount, 0).toFixed(2))
  const sgstTotal = Number(items.reduce((sum, item) => sum + item.sgstAmount, 0).toFixed(2))

  const grossTotal = Number((taxableTotal + cgstTotal + sgstTotal).toFixed(2))
  const finalTotal = Math.round(grossTotal)
  const roundOff = Number((finalTotal - grossTotal).toFixed(2))

  return {
    taxableTotal,
    cgstTotal,
    sgstTotal,
    roundOff,
    finalTotal,
  }
}