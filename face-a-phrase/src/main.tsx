import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/tokens.css'
// If you want the new global grain/gradient utilities, uncomment the next line:
// import './styles/globals.css'

createRoot(document.getElementById("root")!).render(<App />);
