import React from 'react';
import {RotationMatrix, ScaleMatrix, TranslationMatrix, ManualMatrix, } from './input-matrices.js';

export default class App extends React.Component {
    render() {
        return <div>
            <RotationMatrix />
            <ScaleMatrix />
            <TranslationMatrix />
            <ManualMatrix />
        </div>
    }
}
