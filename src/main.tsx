import { createRoot } from 'react-dom/client';
import { preconnect } from 'react-dom';
import App from './App';
import './styles/globals.css';

preconnect('https://eu.acc01.titanos.tv');
createRoot(document.getElementById('root')!).render(<App />);
