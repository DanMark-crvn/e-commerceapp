import { Container } from "react-bootstrap"
import { Routes, Route } from "react-router-dom"
import { Home } from "./pages/home"
import { Store } from "./pages/store"
import { Navbar } from "./components/Navbar"
import { ShoppingCartProvider } from "./context/ShoppingCartContext"
import { Footer } from "./components/Footer"

function App() {
  return(
    <>
      <ShoppingCartProvider>
        <Navbar />
        <Container className="mb-4">
          <Routes>
            <Route path='/' element={<Home />}  />
            <Route path='/store' element={<Store />}  />
          </Routes>
        </Container>
      </ShoppingCartProvider>
      <Footer />
    </>
  )
}

export default App
