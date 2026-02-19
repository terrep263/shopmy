import Link from "next/link"

export default function DealCard({ deal }: { deal: any }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h2 className="card-title h5 text-primary">{deal.title}</h2>
        <p className="text-muted small mb-2">{deal.vendor?.business?.name}</p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-bold fs-5 text-success">${deal.price}</span>
          <Link href={`/deals/${deal.id}`} className="btn btn-primary btn-sm">
            View Deal
          </Link>
        </div>
      </div>
    </div>
  )
}
