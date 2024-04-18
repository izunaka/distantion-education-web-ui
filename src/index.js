import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SettingsStore from './store/SettingsStore';

const root = ReactDOM.createRoot(document.getElementById('root'));

export const Context = createContext(null);

root.render(
    <Context.Provider value={{
        settings: new SettingsStore()
    }}>
        <App />
    </Context.Provider>
);
