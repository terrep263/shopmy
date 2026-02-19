'use client'

import Link from 'next/link'

export default function AdminToolsPage() {
  const tools = [
    {
      id: 'importer',
      name: 'Business Importer',
      icon: '📥',
      description: 'Import businesses from Google Places by city and category',
      path: '/admin/tools/importer',
      category: 'Operations'
    },
    {
      id: 'dealguard',
      name: 'DealGuard',
      icon: '🛡️',
      description: 'Generate deals for vendors with active subscriptions',
      path: '/admin/tools/dealguard',
      category: 'Operations'
    },
    {
      id: 'cities',
      name: 'City Manager',
      icon: '🏙️',
      description: 'Manage cities and geographic locations',
      path: '/admin/tools/cities',
      category: 'Content'
    },
    {
      id: 'categories',
      name: 'Category Manager',
      icon: '🏷️',
      description: 'Manage business categories and types',
      path: '/admin/tools/categories',
      category: 'Content'
    },
    {
      id: 'vendors',
      name: 'Vendor Manager',
      icon: '🏪',
      description: 'Manage vendor accounts and subscriptions',
      path: '/admin/tools/vendors',
      category: 'Management'
    },
    {
      id: 'vouchers',
      name: 'Voucher Manager',
      icon: '🎫',
      description: 'View and manage all vouchers in the system',
      path: '/admin/tools/vouchers',
      category: 'Management'
    },
    {
      id: 'logs',
      name: 'Admin Logs',
      icon: '📋',
      description: 'View admin activity and system logs',
      path: '/admin/tools/logs',
      category: 'Reports'
    }
  ]

  const categories = ['Operations', 'Content', 'Management', 'Reports']

  return (
    <div className="container-fluid p-4">
      <div className="mb-4">
        <h1 className="h3 mb-2">🔧 Admin Tools</h1>
        <p className="text-muted">Select a tool to manage your platform</p>
      </div>

      {categories.map(category => {
        const categoryTools = tools.filter(t => t.category === category)
        if (categoryTools.length === 0) return null

        return (
          <div key={category} className="mb-5">
            <h2 className="h5 mb-3">{category}</h2>
            <div className="row g-3">
              {categoryTools.map(tool => (
                <div key={tool.id} className="col-md-6 col-lg-4">
                  <Link href={tool.path} className="text-decoration-none">
                    <div className="card h-100 hover-shadow" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <span className="fs-2 me-3">{tool.icon}</span>
                          <h3 className="h5 mb-0">{tool.name}</h3>
                        </div>
                        <p className="text-muted mb-0">{tool.description}</p>
                      </div>
                      <div className="card-footer bg-transparent border-top-0">
                        <span className="btn btn-sm btn-outline-primary">
                          Launch Tool →
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
