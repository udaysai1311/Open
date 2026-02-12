import { Outlet } from "react-router-dom"
import Navbar from "../Navbar/Navbar"
import "./Layout.css"

const Layout = () => {
    return (
        <div className="client-layout">
            <Navbar />
            <main className="client-main-content">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
