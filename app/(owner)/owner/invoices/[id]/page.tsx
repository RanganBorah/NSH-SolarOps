"use client"

import Image from "next/image"
import { getInvoices } from "@/lib/invoices"
import { downloadElementAsPdf } from "@/lib/pdf"
import { useParams } from "next/navigation"

export default function OwnerInvoiceViewPage() {
  const params = useParams()
  const invoice = getInvoices().find((item) => item.id === (params.id as string))

  if (!invoice) {
    return (
      <div className="rounded-xl bg-slate-800 p-6 text-white">
        Invoice not found
      </div>
    )
  }

  return (
    <div className="bg-slate-100 p-8">
      <div id="invoice-pdf" className="mx-auto max-w-6xl bg-white p-8 text-black">
        <div className="border border-black">
          <div className="border-b border-black p-4">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <Image
                  src="/logo.png"
                  alt="Nagaon Solar House Logo"
                  width={88}
                  height={88}
                  style={{ width: "auto", height: "auto" }}
                  className="object-contain"
                />
                <div>
                  <h1 className="text-3xl font-bold">Nagaon Solar House</h1>
                  <p className="text-sm">M.D. Road, Nagaon</p>
                  <p className="text-sm">PIN No. 782001</p>
                  <p className="text-sm">GSTIN/UIN: 18AKQPB5642P1ZJ</p>
                  <p className="text-sm">State Name : Assam, Code : 18</p>
                </div>
              </div>

              <div className="text-right">
                <h2 className="text-2xl font-bold">TAX INVOICE</h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-black text-sm">
            <div className="border-r border-black p-4">
              <p className="font-semibold">Consignee (Ship to)</p>
              <p className="mt-2">{invoice.consigneeName}</p>
              <p>{invoice.consigneeAddress}</p>
              <p>GSTIN/UIN : {invoice.consigneeGstin || "-"}</p>
              <p>State Name : Assam, Code : 18</p>
            </div>

            <div className="p-4">
              <p className="font-semibold">Buyer (Bill to)</p>
              <p className="mt-2">{invoice.buyerName}</p>
              <p>{invoice.buyerAddress}</p>
              <p>GSTIN/UIN : {invoice.buyerGstin || "-"}</p>
              <p>State Name : Assam, Code : 18</p>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-black text-sm">
            <div className="border-r border-black p-4">
              <p><span className="font-semibold">Invoice No.</span> {invoice.invoiceNo}</p>
            </div>
            <div className="p-4">
              <p><span className="font-semibold">Dated</span> {invoice.invoiceDate}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-r border-black px-2 py-2">Sl No.</th>
                  <th className="border-b border-r border-black px-2 py-2">Description of Goods</th>
                  <th className="border-b border-r border-black px-2 py-2">HSN/SAC</th>
                  <th className="border-b border-r border-black px-2 py-2">Quantity</th>
                  <th className="border-b border-r border-black px-2 py-2">Rate (Incl. Tax)</th>
                  <th className="border-b border-r border-black px-2 py-2">Taxable Rate</th>
                  <th className="border-b border-black px-2 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border-b border-r border-black px-2 py-2 text-center">{index + 1}</td>
                    <td className="border-b border-r border-black px-2 py-2">{item.description}</td>
                    <td className="border-b border-r border-black px-2 py-2 text-center">{item.hsnSac}</td>
                    <td className="border-b border-r border-black px-2 py-2 text-center">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="border-b border-r border-black px-2 py-2 text-right">{item.rateInclTax.toFixed(2)}</td>
                    <td className="border-b border-r border-black px-2 py-2 text-right">{item.taxableRate.toFixed(2)}</td>
                    <td className="border-b border-black px-2 py-2 text-right">{item.amount.toFixed(2)}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={6} className="border-b border-r border-black px-2 py-2 text-right font-semibold">Taxable Total</td>
                  <td className="border-b border-black px-2 py-2 text-right font-semibold">{invoice.taxableTotal.toFixed(2)}</td>
                </tr>

                <tr>
                  <td colSpan={6} className="border-b border-r border-black px-2 py-2 text-right">CGST</td>
                  <td className="border-b border-black px-2 py-2 text-right">{invoice.cgstTotal.toFixed(2)}</td>
                </tr>

                <tr>
                  <td colSpan={6} className="border-b border-r border-black px-2 py-2 text-right">SGST</td>
                  <td className="border-b border-black px-2 py-2 text-right">{invoice.sgstTotal.toFixed(2)}</td>
                </tr>

                <tr>
                  <td colSpan={6} className="border-b border-r border-black px-2 py-2 text-right">Round Off</td>
                  <td className="border-b border-black px-2 py-2 text-right">
                    {invoice.roundOff >= 0 ? `(+${invoice.roundOff.toFixed(2)})` : `(${invoice.roundOff.toFixed(2)})`}
                  </td>
                </tr>

                <tr>
                  <td colSpan={6} className="border-r border-black px-2 py-2 text-right font-bold">Total</td>
                  <td className="px-2 py-2 text-right font-bold">₹{invoice.finalTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-t border-black p-4 text-sm">
            <p className="font-semibold">Amount Chargeable (in words)</p>
            <p className="mt-1">{invoice.amountInWords}</p>
          </div>

          <div className="border-t border-black p-4 text-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-black px-2 py-2">HSN/SAC</th>
                  <th className="border border-black px-2 py-2">Taxable Value</th>
                  <th className="border border-black px-2 py-2">CGST</th>
                  <th className="border border-black px-2 py-2">SGST</th>
                  <th className="border border-black px-2 py-2">Total Tax Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-black px-2 py-2 text-center">{item.hsnSac}</td>
                    <td className="border border-black px-2 py-2 text-right">{item.amount.toFixed(2)}</td>
                    <td className="border border-black px-2 py-2 text-right">{item.cgstAmount.toFixed(2)}</td>
                    <td className="border border-black px-2 py-2 text-right">{item.sgstAmount.toFixed(2)}</td>
                    <td className="border border-black px-2 py-2 text-right">{item.totalTaxAmount.toFixed(2)}</td>
                  </tr>
                ))}

                <tr>
                  <td className="border border-black px-2 py-2 font-semibold text-center">Total</td>
                  <td className="border border-black px-2 py-2 text-right font-semibold">{invoice.taxableTotal.toFixed(2)}</td>
                  <td className="border border-black px-2 py-2 text-right font-semibold">{invoice.cgstTotal.toFixed(2)}</td>
                  <td className="border border-black px-2 py-2 text-right font-semibold">{invoice.sgstTotal.toFixed(2)}</td>
                  <td className="border border-black px-2 py-2 text-right font-semibold">
                    {(invoice.cgstTotal + invoice.sgstTotal).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mt-4">
              <span className="font-semibold">Tax Amount (in words): </span>
              {invoice.taxAmountInWords}
            </p>
          </div>

          <div className="grid grid-cols-2 border-t border-black text-sm">
            <div className="border-r border-black p-4">
              <p className="font-semibold">Company’s PAN : AKQPB5642P</p>
              <p className="mt-4 font-semibold">Declaration</p>
              <p className="mt-1">
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
              </p>

              <div className="mt-6">
                <p className="font-semibold">Company’s Bank Details</p>
                <p>A/c Holder’s Name : Nagaon Solar House</p>
                <p>Bank Name : BANK OF BARODA CURRENT A/C NO. 63490200000170</p>
                <p>A/c No. : 63490200000170</p>
                <p>Branch & IFS Code : NAGAON & BARB0VJNAGN</p>
              </div>
            </div>

            <div className="p-4 text-right">
              <p>Customer’s Seal and Signature</p>
              <p className="mt-12">for Nagaon Solar House</p>
              <p className="mt-12 font-semibold">Authorised Signatory</p>
            </div>
          </div>

          <div className="border-t border-black p-4 text-center text-sm">
            <p>SUBJECT TO NAGAON JURISDICTION</p>
            <p>This is a Computer Generated Invoice</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl gap-3">
        <button
          onClick={() => window.print()}
          className="rounded-md bg-blue-600 px-5 py-3 text-white"
        >
          Print Tax Invoice
        </button>

        <button
          onClick={() =>
            downloadElementAsPdf(
              "invoice-pdf",
              `${invoice.invoiceNo.replaceAll("/", "-")}.pdf`
            )
          }
          className="rounded-md bg-green-600 px-5 py-3 text-white"
        >
          Download PDF
        </button>
      </div>
    </div>
  )
}