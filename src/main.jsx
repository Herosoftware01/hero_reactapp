import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'
import { registerLicense } from '@syncfusion/ej2-base';
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
registerLicense('Ngo9BigBOggjHTQxAR8/V1JGaF5cXGpCf0x0Q3xbf1x2ZFBMYVlbQHBPMyBoS35Rc0RhW3hedXVQQ2heWUB2VEFf');

createRoot(document.getElementById('root')).render(
    <App />
);
