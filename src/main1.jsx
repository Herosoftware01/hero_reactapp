
// import React, { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.jsx';

// // ---------------------------------------
// // Syncfusion styles (Material theme)
// // ---------------------------------------

// // Base + common dependencies
// import '@syncfusion/ej2-base/styles/material.css';
// import '@syncfusion/ej2-buttons/styles/material.css';
// import '@syncfusion/ej2-popups/styles/material.css';

// // React wrappers
// import '@syncfusion/ej2-react-grids/styles/material.css';
// import '@syncfusion/ej2-react-kanban/styles/material.css';
// import '@syncfusion/ej2-react-navigations/styles/material.css';

// // Charts stylesheet MUST come from the core charts package
// import '@syncfusion/ej2-charts/styles/material.css';

// // Icons (needed for expand/collapse arrows and other iconography)
// import '@syncfusion/ej2-icons/styles/material.css';

// // ---------------------------------------

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
// main.jsx (or index.js)

// import React, { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.jsx';

// // -----------------------------
// // Correct Syncfusion Material Theme Imports
// // -----------------------------
// import React, { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.jsx';

// Syncfusion Material Theme - Correct imports (2024+)
// import '@syncfusion/ej2-base/styles/material.css';
// import '@syncfusion/ej2-buttons/styles/material.css';
// import '@syncfusion/ej2-calendars/styles/material.css';
// import '@syncfusion/ej2-dropdowns/styles/material.css';
// import '@syncfusion/ej2-inputs/styles/material.css';
// import '@syncfusion/ej2-lists/styles/material.css';
// import '@syncfusion/ej2-navigations/styles/material.css';
// import '@syncfusion/ej2-popups/styles/material.css';

// import '@syncfusion/ej2-grids/styles/material.css';
// import '@syncfusion/ej2-kanban/styles/material.css';
// import '@syncfusion/ej2-charts/styles/material.css';

// import '@syncfusion/ej2-icons/styles/material.css';
// import React, { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.jsx';

// src/main.jsx

import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { StrictMode } from 'react';
// -----------------------------
// Syncfusion Material Theme - Recommended Simple Way
// -----------------------------

// Option 1: Single line (easiest & recommended)
import '@syncfusion/ej2-material-theme/styles/material.css';

// OR Option 2: Individual imports (if you prefer smaller bundle)
// Uncomment below and comment the line above if needed
/*
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-calendars/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-grids/styles/material.css';
import '@syncfusion/ej2-kanban/styles/material.css';
import '@syncfusion/ej2-charts/styles/material.css';
import '@syncfusion/ej2-icons/styles/material.css';
*/

// -----------------------------
createRoot(document.getElementById('root')).render(
  <App />
);