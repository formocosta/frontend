import Header from "./Header"
import Sidebar from "./Sidebar"

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#f3f4f6]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}