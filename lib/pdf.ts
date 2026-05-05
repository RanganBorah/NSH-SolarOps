export const downloadElementAsPdf = async (
  elementId: string,
  fileName: string
) => {
  const element = document.getElementById(elementId)
  if (!element) return

  const logoUrl = `${window.location.origin}/logo.png`

  const printWindow = window.open("", "_blank", "width=900,height=1200")
  if (!printWindow) return

  printWindow.document.open()
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${fileName}</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4;
            margin: 12mm;
          }

          html, body {
            margin: 0;
            padding: 0;
            background: white;
            font-family: "Times New Roman", Times, serif;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
          }

          img {
            max-width: 100%;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            table-layout: fixed;
          }

          th, td {
            box-sizing: border-box;
          }

          #pdf-root {
            width: 100%;
          }

          .print-actions {
            display: none !important;
          }

          @media screen {
            body {
              padding: 0;
            }
          }

          @media print {
            html, body {
              width: 210mm;
              height: auto;
              overflow: visible;
            }

            #pdf-root {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div id="pdf-root">${element.innerHTML}</div>
        <script>
          const imgs = Array.from(document.images)
          let loaded = 0

          const done = () => {
            setTimeout(() => {
              window.focus()
              window.print()
            }, 500)
          }

          if (imgs.length === 0) {
            done()
          } else {
            imgs.forEach((img) => {
              if (img.complete) {
                loaded++
                if (loaded === imgs.length) done()
              } else {
                img.onload = () => {
                  loaded++
                  if (loaded === imgs.length) done()
                }
                img.onerror = () => {
                  loaded++
                  if (loaded === imgs.length) done()
                }
              }
            })
          }
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}