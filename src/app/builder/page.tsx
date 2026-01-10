import React from 'react';
import { BuilderProvider } from './context/BuilderContext';
import { BuilderLayout } from './BuilderLayout';

const BuilderPage: React.FC = () => {
    return (
        <BuilderProvider>
            <BuilderLayout />
        </BuilderProvider>
    );
};

export default BuilderPage;
