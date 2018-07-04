import React from 'react';
import Options from './Options/Options.js';
import Stack from './Stack/Stack.js';
import Graph from './Graph/Graph.js';
import style from './App.css';

export default () => <div className={style.app}>
    <div className={style.top}>
        <Stack />
    </div>
    <div className={style.middle}>
        <div className={style.left}>
            <Options />
        </div>
        <div className={style.right}>
            <Graph />
        </div>
    </div>
</div>
