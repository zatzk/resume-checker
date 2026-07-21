'use client'

export function PDFPreviewModal({
  pdfUrl,
  title,
  isOpen,
  onClose
}: {
  pdfUrl: string
  title: string
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen || !pdfUrl) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container border-2 border-primary w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="bg-surface-variant px-4 py-3 border-b border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">picture_as_pdf</span>
            <span className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider">{title}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={pdfUrl}
              download
              className="brutalist-button-primary px-3 py-1 text-xs font-mono font-bold flex items-center gap-1 uppercase"
            >
              <span className="material-symbols-outlined text-sm">download</span> Download
            </a>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary font-mono text-sm font-bold px-2 py-1 uppercase"
            >
              ✕ CLOSE
            </button>
          </div>
        </div>

        {/* PDF Iframe */}
        <div className="flex-1 bg-surface-container-lowest relative">
          <iframe src={pdfUrl} className="w-full h-full border-none" title={title} />
        </div>
      </div>
    </div>
  )
}
