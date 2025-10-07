import ReactDOM from 'react-dom/client';
import App from './App';
import 'animate.css';

// Create root and render the app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
)