"use client"

import { getQuotationById } from "@/lib/quotations"
import { downloadElementAsPdf } from "@/lib/pdf"
import { useParams } from "next/navigation"

export default function EmployeeQuotationViewPage() {
  const params = useParams()
  const quotation = getQuotationById(params.id as string)

  if (!quotation) {
    return (
      <div className="rounded-xl bg-slate-800 p-6 text-white">
        Quotation not found
      </div>
    )
  }

  return (
    <div className="bg-slate-100 p-8">
      <div id="quotation-pdf" className="mx-auto max-w-5xl bg-white p-8 text-black">
        <div className="border-b pb-4">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src="/logo.png"
                alt="Nagaon Solar House Logo"
                className="h-22 w-22 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold">Nagaon Solar House</h1>
                <p className="mt-1 text-sm">M.D. Road, Nagaon, Assam - 782001</p>
                <p className="text-sm">GSTIN/UIN: 18AKQPB5642P1ZJ</p>
                <p className="text-sm">Contact: +91-XXXXXXXXXX</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">No.: {quotation.quotationNo}</p>
              <p className="text-sm">Date: {quotation.date}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-center text-2xl font-bold tracking-wide">QUOTATION</h2>
        </div>

        <div className="mt-6">
          <p className="font-semibold">To,</p>
          <p className="mt-1 whitespace-pre-line">{quotation.toWhom}</p>
        </div>

        <div className="mt-6">
          <p>
            <span className="font-semibold">Sub:</span> {quotation.subject}
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr>
                <th className="border border-black px-3 py-2">Sl. No.</th>
                <th className="border border-black px-3 py-2">Items</th>
                <th className="border border-black px-3 py-2">Qty</th>
                <th className="border border-black px-3 py-2">Unit</th>
                <th className="border border-black px-3 py-2">Rate Offered (Rs.)</th>
                <th className="border border-black px-3 py-2">Total Value With GST</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-black px-3 py-2 text-center">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="border border-black px-3 py-2">{item.itemName}</td>
                  <td className="border border-black px-3 py-2 text-center">{item.qty}</td>
                  <td className="border border-black px-3 py-2 text-center">{item.unit}</td>
                  <td className="border border-black px-3 py-2 text-right">
                    {item.rate.toFixed(2)}
                  </td>
                  <td className="border border-black px-3 py-2 text-right">
                    {item.total.toFixed(2)}
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={5} className="border border-black px-3 py-2 text-right font-semibold">
                  Total
                </td>
                <td className="border border-black px-3 py-2 text-right font-semibold">
                  {quotation.subtotal.toFixed(2)}
                </td>
              </tr>

              <tr>
                <td colSpan={5} className="border border-black px-3 py-2 text-right font-semibold">
                  Round Off (+{quotation.roundOff.toFixed(2)})
                </td>
                <td className="border border-black px-3 py-2 text-right font-semibold">
                  {quotation.roundedTotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <p className="font-semibold">({quotation.amountInWords})</p>
        </div>

        <div className="mt-8">
          <h3 className="font-bold">TERMS AND CONDITIONS</h3>
          <ol className="mt-2 list-decimal pl-6 text-sm">
            <li>The quoted price is exclusive of all taxes.</li>
            <li>The offer is valid for 60 days.</li>
            <li>Completion period 20 days.</li>
            <li>Payment Terms: 100% Advance.</li>
            <li>Standard force majeure will be applicable.</li>
          </ol>
        </div>

        <div className="mt-12 flex justify-between">
          <div />
          <div className="text-right">
            <p>Regards,</p>
            <p className="mt-10 font-semibold">(Biman Borah)</p>
            <p>For, Nagaon Solar House</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-5xl gap-3">
        <button
          onClick={() => window.print()}
          className="rounded-md bg-blue-600 px-5 py-3 text-white"
        >
          Print Quotation
        </button>

        <button
          onClick={() =>
            downloadElementAsPdf(
              "quotation-pdf",
              `${quotation.quotationNo.replaceAll("/", "-")}.pdf`
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