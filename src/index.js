import { SpeechProvider } from '@speechly/react-client';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { Provider } from './context/context';
import './index.css';
ReactDOM.render(
    <SpeechProvider appId='c2497989-2b0d-4dab-aa11-bf8c2656e953' language="en-US">
        <Provider>
            <App/>
        </Provider>
    </SpeechProvider>
    , document.getElementById('root')
)