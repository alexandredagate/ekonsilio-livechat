import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import App from './App.tsx'

import './index.css'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

createRoot(document.getElementById('root')!).render(
    <MantineProvider>
      <Notifications />
      <ModalsProvider />
      <App />
    </MantineProvider>,
)
