"use client"

import { getQuotationById } from "@/lib/quotations"
import { downloadElementAsPdf } from "@/lib/pdf"
import { useParams } from "next/navigation"

export default function OwnerQuotationViewPage() {
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
    <div className="bg-slate-100 p-6">
      <div
        id="quotation-pdf"
        className="mx-auto bg-white text-black"
        style={{
          width: "794px",
          minHeight: "1123px",
          padding: "34px 54px 34px 54px",
          fontFamily: '"Times New Roman", Times, serif',
          boxSizing: "border-box",
        }}
      >
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "245px 1fr",
              columnGap: "34px",
              alignItems: "start",
            }}
          >
            <div>
              <img
                src="/logo.png"
                alt="Nagaon Solar House Logo"
                style={{
                  width: "220px",
                  height: "100px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  lineHeight: "1.2",
                  fontWeight: 700,
                  textAlign: "left",
                }}
              >
                <div>M.D. Road, Nagaon – 782001, Assam</div>
                <div>Ph. No: - 9435160149(M), 03672231191(Fax)</div>
              </div>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  width: "320px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    color: "#d40000",
                    fontWeight: 800,
                    fontSize: "24px",
                    lineHeight: "1.02",
                  }}
                >
                  Nagaon Solar House
                </div>

                <div
                  style={{
                    color: "#d40000",
                    fontWeight: 800,
                    fontSize: "13px",
                    lineHeight: "1.15",
                    marginTop: "3px",
                  }}
                >
                  MSME Registered Energy Enterprise
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.22",
                    fontWeight: 700,
                    marginTop: "6px",
                  }}
                >
                  <div>M.D. Road,</div>
                  <div>Near Civil Hospital Rail Gate</div>
                  <div>Nagaon – 782001, Assam</div>
                  <div>
                    Email:{" "}
                    <span style={{ color: "#1d4ed8", textDecoration: "underline" }}>
                      nagaonsolarhouse@gmail.com
                    </span>
                  </div>
                  <div>
                    WebSite:{" "}
                    <span style={{ color: "#1d4ed8", textDecoration: "underline" }}>
                      www.nagaonsolarhouse.in
                    </span>
                  </div>
                  <div>GSTN: - 18AKQPB5642P1ZJ</div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "8px",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: 800,
              lineHeight: "1.05",
            }}
          >
            GeM Seller ID: 4879200001090870
          </div>

          <div
            style={{
              marginTop: "4px",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: 800,
              color: "#d40000",
              lineHeight: "1.05",
            }}
          >
            AN ISO 9001:2008 CERTIFIED ORGANIZATION
          </div>

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "13px",
              fontWeight: 800,
            }}
          >
            <div>No.: {quotation.quotationNo}</div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 800,
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              QUOTATION
            </div>
            <div>Date: {quotation.date}</div>
          </div>
        </div>

        <div style={{ marginTop: "26px", fontSize: "14px", lineHeight: "1.35" }}>
          <div style={{ fontWeight: 700 }}>To,</div>
          <div style={{ marginTop: "10px", paddingLeft: "34px", whiteSpace: "pre-line" }}>
            {quotation.toWhom}
          </div>
        </div>

        <div style={{ marginTop: "18px", fontSize: "14px", lineHeight: "1.35" }}>
          <span style={{ fontWeight: 700 }}>Sub: </span>
          <span>{quotation.subject}</span>
        </div>

        <div style={{ marginTop: "6px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "6px 4px",
                    textAlign: "center",
                    width: "58px",
                    lineHeight: "1.05",
                    fontWeight: 700,
                    verticalAlign: "middle",
                  }}
                >
                  Sl.
                  <br />
                  No.
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "6px 6px",
                    textAlign: "center",
                    width: "300px",
                    fontWeight: 700,
                    verticalAlign: "middle",
                  }}
                >
                  Items
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "6px 4px",
                    textAlign: "center",
                    width: "56px",
                    fontWeight: 700,
                    verticalAlign: "middle",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "6px 4px",
                    textAlign: "center",
                    width: "58px",
                    fontWeight: 700,
                    verticalAlign: "middle",
                  }}
                >
                  Unit
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "6px 4px",
                    textAlign: "center",
                    width: "118px",
                    lineHeight: "1.05",
                    fontWeight: 700,
                    verticalAlign: "middle",
                  }}
                >
                  Rate Offered
                  <br />
                  (Rs.)
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "6px 4px",
                    textAlign: "center",
                    width: "138px",
                    lineHeight: "1.05",
                    fontWeight: 700,
                    verticalAlign: "middle",
                  }}
                >
                  Total Value
                  <br />
                  With GST
                </th>
              </tr>
            </thead>

            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={item.id}>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 4px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      lineHeight: "1.2",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 6px",
                      verticalAlign: "middle",
                      wordBreak: "break-word",
                      lineHeight: "1.2",
                    }}
                  >
                    {item.itemName}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 4px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      lineHeight: "1.2",
                    }}
                  >
                    {String(item.qty).padStart(2, "0")}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 4px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      lineHeight: "1.2",
                    }}
                  >
                    {item.unit}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 6px",
                      textAlign: "right",
                      verticalAlign: "middle",
                      lineHeight: "1.2",
                    }}
                  >
                    {item.rate.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 6px",
                      textAlign: "right",
                      verticalAlign: "middle",
                      lineHeight: "1.2",
                    }}
                  >
                    {item.total.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}

              <tr>
                <td
                  colSpan={5}
                  style={{
                    border: "1px solid #000",
                    padding: "4px 6px",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "13px",
                    lineHeight: "1.2",
                  }}
                >
                  Total
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px 6px",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "13px",
                    lineHeight: "1.2",
                  }}
                >
                  {quotation.subtotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>

              <tr>
                <td
                  colSpan={5}
                  style={{
                    border: "1px solid #000",
                    padding: "4px 6px",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "13px",
                    lineHeight: "1.2",
                  }}
                >
                  Round Off (+{quotation.roundOff.toFixed(2)})
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "4px 6px",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "13px",
                    lineHeight: "1.2",
                  }}
                >
                  {quotation.roundedTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: "8px",
            textAlign: "center",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          ({quotation.amountInWords.replace("Rupees ", "Rs. ").replace(" Only", " Only")})
        </div>

        <div style={{ marginTop: "28px" }}>
          <div
            style={{
              textAlign: "center",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            TERMS AND CONDITIONS
          </div>

          <ol
            style={{
              marginTop: "12px",
              paddingLeft: "56px",
              fontSize: "13px",
              lineHeight: "1.45",
              fontWeight: 700,
            }}
          >
            <li>The quoted price is exclusive of all taxes.</li>
            <li>The offer is valid for 60 days.</li>
            <li>Completion period 20 days.</li>
            <li>Payment Terms:-100% Advance</li>
            <li>Standard force majeure will be applicable.</li>
          </ol>
        </div>

        <div
          style={{
            marginTop: "92px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 700 }}>
            Regards,
          </div>

          <div style={{ textAlign: "right", fontSize: "14px", fontWeight: 700 }}>
            <div style={{ marginTop: "46px" }}>(Biman Borah)</div>
            <div>For, Nagaon Solar House</div>
          </div>
        </div>

        <div
          style={{
            marginTop: "10px",
            textAlign: "right",
            fontSize: "11px",
            color: "#555",
          }}
        >
          1 | P a g e
        </div>
      </div>

      <div className="print-actions mx-auto mt-6 flex w-[794px] gap-3">
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