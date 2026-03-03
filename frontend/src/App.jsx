import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Authenticate from './pages/Authenticate';
import Analytics from './pages/Analytics';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/authenticate" element={<Authenticate />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
