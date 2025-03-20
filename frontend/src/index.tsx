import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/main.css';

// Mount React app to DOM
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}