import React from 'react';
import roundFloatStr from '../../../../round-float-str.js';

export default function Frame({frame}) {
    const elements = frame.elements.map((num) => roundFloatStr(num));
    return <table className='matrix'><tbody>
        <tr>
            <td>{elements[0]}</td>
            <td>{elements[4]}</td>
            <td>{elements[12]}</td>
        </tr>
        <tr>
            <td>{elements[1]}</td>
            <td>{elements[5]}</td>
            <td>{elements[13]}</td>
        </tr>
        <tr>
            <td>0</td>
            <td>0</td>
            <td>1</td>
        </tr>
    </tbody></table>
}
