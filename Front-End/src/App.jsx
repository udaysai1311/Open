import LoginForm from './components/Admin/LoginForm/LoginForm'
import ClientRegistration from './components/Admin/ClientRegistrationForm/ClientRegistration'
import ClientLoginForm from './components/Client/LoginForm/ClientLoginForm'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CustomerRegistration from './components/Client/CustomerRegistration/CustomerRegistration'
import UserManagement from './components/Client/UserManagement/UserManagement'
import Layout from './components/Client/Layout/Layout'
import Materials from './components/Client/MaterialMaster/Material/Materials'
import Machinery from './components/Client/MaterialMaster/Machinery/Machinery'
// import ProcessPricing from './components/Client/MaterialMaster/ProcessPricing/ProcessPricing'
import QuotationMaster from './components/Client/QuotationMaster/QuotationMaster'
import MetalWeightCalculator from './components/Client/MetalWeightCalculator/MetalWeightCalculator'
import Home from './components/Client/Home/Home'
import { UserProvider } from './context/UserContext'
function App() {
	return (
		<UserProvider>
			<BrowserRouter>
				<Routes>
					<Route element={<Layout />}>
						<Route path="/customer_registration" element={<CustomerRegistration />} />
						<Route path="/users" element={<UserManagement />} />
						<Route path="/materials" element={<Materials />} />
						<Route path="/machinery" element={<Machinery />} />
						{/* <Route path="/process_pricing" element={<ProcessPricing />} /> */}
						<Route path="/quotation-master" element={<QuotationMaster />} />
						<Route path="/metal-weight-calculator" element={<MetalWeightCalculator />} />
						<Route path="/" element={<Home />} />
					</Route>
					<Route path="/login" element={<ClientLoginForm />} />
					<Route path="admin/login" element={<LoginForm />} />
					<Route path="admin/client_register" element={<ClientRegistration />} />
				</Routes>
			</BrowserRouter>
		</UserProvider>
	)
}

export default App
