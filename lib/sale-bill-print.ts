import { Sale, SaleItem } from "@/types/sale"

const formatMoney = (amount: number) => {
  return `₹${Number(amount || 0).toFixed(2)}`
}

const safeText = (value: string | number | undefined | null) => {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

const getDisplayItems = (sale: Sale): SaleItem[] => {
  if (sale.items && sale.items.length > 0) return sale.items

  return [
    {
      id: sale.productId || sale.id,
      productId: sale.productId || "",
      productName: sale.productName || "",
      companyName: sale.companyName || "",
      powerRating: sale.powerRating || "",
      quantity: sale.quantity || 0,
      unitPrice: sale.unitPrice || 0,
      totalAmount: sale.totalAmount || 0,
      warrantyDuration: sale.warrantyDurationMonths || 0,
      warrantyUnit: "months",
      warrantyStartDate: sale.warrantyStartDate || sale.soldDate,
      warrantyExpiryDate: sale.warrantyExpiryDate || "",
    },
  ]
}

export const printSaleBill = (sale: Sale) => {
  const items = getDisplayItems(sale)
  const printWindow = window.open("", "_blank", "width=900,height=1200")

  if (!printWindow) return

  printWindow.document.open()
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Sales Bill ${safeText(sale.id)}</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4;
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: white;
            color: #111;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .bill {
            width: 100%;
            max-width: 800px;
            min-height: calc(297mm - 24mm);
            margin: 0 auto;
            padding: 8px;
            display: flex;
            flex-direction: column;
          }

          .header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            border-bottom: 2px solid #111;
            padding-bottom: 10px;
          }

          .brand {
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }

          .logo {
            width: 54px;
            height: auto;
            object-fit: contain;
          }

          .company-name {
            font-size: 22px;
            font-weight: 800;
            margin: 0 0 4px 0;
          }

          .company-info {
            margin: 0;
            line-height: 1.45;
            font-size: 12px;
          }

          .bill-title {
            text-align: right;
          }

          .bill-title h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 800;
          }

          .bill-title p {
            margin: 4px 0 0 0;
            font-size: 12px;
          }

          .section {
            margin-top: 12px;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .box {
            border: 1px solid #333;
            padding: 8px;
            min-height: 62px;
          }

          .box-title {
            font-weight: 700;
            margin-bottom: 4px;
            font-size: 12px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
          }

          th,
          td {
            border: 1px solid #333;
            padding: 6px 7px;
            vertical-align: top;
            font-size: 12px;
          }

          th {
            background: #f2f2f2;
            text-align: left;
            font-weight: 700;
          }

          .right {
            text-align: right;
          }

          .center {
            text-align: center;
          }

          .totals {
            width: 265px;
            margin-left: auto;
            margin-top: 12px;
            border: 1px solid #333;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 10px;
            border-bottom: 1px solid #333;
            font-size: 12px;
          }

          .total-row:last-child {
            border-bottom: none;
            font-weight: 800;
            font-size: 15px;
          }

          .content-end {
            margin-top: auto;
          }

          .acknowledgement {
            margin-top: 18px;
            font-size: 12px;
            line-height: 1.5;
          }

          .ack-title {
            font-weight: 700;
            margin-bottom: 6px;
          }

          .signature-block {
            margin-top: 50px;
            display: flex;
            justify-content: flex-end;
          }

          .signature-inner {
            width: 245px;
            text-align: center;
          }

          .signature-label {
            margin-bottom: 34px;
            text-align: left;
            font-weight: 700;
          }

          .signature-line {
            border-top: 1px solid #111;
            padding-top: 8px;
            font-size: 12px;
            font-weight: 700;
          }

          .note {
            margin-top: 16px;
            font-size: 10.5px;
            line-height: 1.45;
          }

          .print-actions {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin: 18px 0;
          }

          .print-actions button {
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            background: #111827;
            color: white;
            font-weight: 700;
            cursor: pointer;
          }

          @media print {
            .print-actions {
              display: none;
            }
          }
        </style>
      </head>

      <body>
        <div class="print-actions">
          <button onclick="window.print()">Print Bill</button>
          <button onclick="window.close()">Close</button>
        </div>

        <div class="bill">
          <div>
            <div class="header">
              <div class="brand">
                <img src="/logo.png" class="logo" />
                <div>
                  <h1 class="company-name">Nagaon Solar House</h1>
                  <p class="company-info">
                    M.D. Road, Nagaon - 782001, Assam<br />
                    Phone: 9435160149<br />
                    GSTIN: 18AKQPB5642P1ZJ
                  </p>
                </div>
              </div>

              <div class="bill-title">
                <h2>SALES BILL</h2>
                <p>Bill No: ${safeText(sale.id)}</p>
                <p>Date: ${safeText(sale.soldDate)}</p>
              </div>
            </div>

            <div class="section grid">
              <div class="box">
                <div class="box-title">Bill To</div>
                <div><strong>${safeText(sale.customerName)}</strong></div>
                <div>Customer ID: ${safeText(sale.customerId)}</div>
              </div>

              <div class="box">
                <div class="box-title">Sale Details</div>
                <div>Sold By: ${safeText(sale.soldByEmployeeName)}</div>
                <div>Employee ID: ${safeText(sale.soldByEmployeeId)}</div>
                <div>Payment Status: ${safeText(sale.paymentStatus.toUpperCase())}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th class="center" style="width: 32px;">Sl</th>
                  <th>Product</th>
                  <th style="width: 72px;">Warranty</th>
                  <th style="width: 78px;">Expiry</th>
                  <th class="center" style="width: 48px;">Qty</th>
                  <th class="right" style="width: 72px;">Rate</th>
                  <th class="right" style="width: 88px;">Amount</th>
                </tr>
              </thead>

              <tbody>
                ${items
                  .map(
                    (item, index) => `
                      <tr>
                        <td class="center">${index + 1}</td>
                        <td>
                          <strong>${safeText(item.productName)}</strong><br />
                          Company: ${safeText(item.companyName)}<br />
                          Power/Rating: ${safeText(item.powerRating || "-")}
                        </td>
                        <td>${safeText(item.warrantyDuration)} ${safeText(item.warrantyUnit)}</td>
                        <td>${safeText(item.warrantyExpiryDate || "-")}</td>
                        <td class="center">${safeText(item.quantity)}</td>
                        <td class="right">${formatMoney(item.unitPrice)}</td>
                        <td class="right">${formatMoney(item.totalAmount)}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="totals">
              <div class="total-row">
                <span>Total Amount</span>
                <span>${formatMoney(sale.totalAmount)}</span>
              </div>
              <div class="total-row">
                <span>Paid Amount</span>
                <span>${formatMoney(sale.paidAmount)}</span>
              </div>
              <div class="total-row">
                <span>Balance Amount</span>
                <span>${formatMoney(sale.balanceAmount)}</span>
              </div>
            </div>
          </div>

          <div class="content-end">
            <div class="acknowledgement">
              <div class="ack-title">Customer Acknowledgement</div>
              <div>I have received the above product(s) in good condition.</div>
            </div>

            <div class="signature-block">
              <div class="signature-inner">
                <div class="signature-label">For Nagaon Solar House</div>
                <div class="signature-line">Authorised Signature</div>
              </div>
            </div>

            <div class="note">
              <strong>Note:</strong> Warranty is applicable as mentioned against each product. Physical damage, wrong usage, water damage, burning, and external electrical faults are subject to company warranty rules.
            </div>
          </div>
        </div>

        <script>
          setTimeout(() => {
            window.focus()
          }, 300)
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}