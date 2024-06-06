import { Card } from 'primereact/card'
import React from 'react'

const Summary = ({label,value,color}) => {

  return (
    <div style={{display:'flex',flexDirection:'row'}}>
        <div>
        <Card title={label} style={{width:'15vw',backgroundColor:color }}>
            <p>{value}</p>
        </Card>
        </div>
    </div>
  )
}

export default Summary