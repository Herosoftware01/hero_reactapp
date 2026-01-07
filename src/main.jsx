import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'

// Syncfusion CSS imports (Material)
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-react-grids/styles/material.css';
import '@syncfusion/ej2-react-kanban/styles/material.css';
import '@syncfusion/ej2-react-navigations/styles/material.css';
// import '@syncfusion/ej2-charts/styles/material.css';
import '@syncfusion/ej2-icons/styles/material.css';

import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
    <App />
);
