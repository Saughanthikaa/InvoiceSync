import React from "react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
        
function Dummy(){
    const data=[{
        name:'sau',
        address:'address',
        age:'21'
    },
    {
        name:'aadhi',
        address:'address',
        age:'17'
    },
]
 return(
    <div>
        <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
            <Column field="name" header="Name"></Column>
            <Column field="adress" header="Address"></Column>
            <Column field="age" header="Age"></Column>
        </DataTable>
    </div>
 )
}
export default Dummy;