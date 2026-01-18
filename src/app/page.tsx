import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"

export default function HomePage() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        {/* Dashboard content */}
        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          {/* TODO: Code dashboard here */}
        </main>
      </div>
    </div>
  )
}
