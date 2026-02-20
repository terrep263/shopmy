export interface NavItem {
  label: string
  href: string
  icon?: string
  role?: "public" | "vendor" | "admin"
  visible: boolean
}

export const navigation: NavItem[] = [
  {
    label: "Home",
    href: "/",
    visible: true,
    role: "public",
  },
  {
    label: "Businesses",
    href: "/explore",
    visible: true,
    role: "public",
  },
  {
    label: "Deals",
    href: "/deals",
    visible: true,
    role: "public",
  },
  {
    label: "Blog",
    href: "/blog",
    visible: true,
    role: "public",
  },
  {
    label: "Dashboard",
    href: "/vendor/dashboard",
    visible: true,
    role: "vendor",
  },
  {
    label: "Admin",
    href: "/admin/dashboard",
    visible: true,
    role: "admin",
  },
]
