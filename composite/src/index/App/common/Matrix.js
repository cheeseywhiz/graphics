import React from 'react';

export default function Matrix({matrix}) {
    const {xi, yi, ox, xj, yj, oy} = {
        xi: 1, yi: 0, ox: 0,
        xj: 0, yj: 1, oy: 0,
        ...matrix,
    };
    return <table className='matrix'><tbody>
        <tr>
            <td>{xi}</td>
            <td>{yi}</td>
            <td>{ox}</td>
        </tr>
        <tr>
            <td>{xj}</td>
            <td>{yj}</td>
            <td>{oy}</td>
        </tr>
        <tr>
            <td>0</td>
            <td>0</td>
            <td>1</td>
        </tr>
    </tbody></table>
}
