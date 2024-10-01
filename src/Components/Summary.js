import { Card } from 'primereact/card'
import React from 'react'

const Summary = ({label,value,color}) => {

  return (
    <div style={{display:'flex',flexDirection:'row'}}>
        <Card style={{width:'16vw',height:'20vh',background: 'linear-gradient(to right, rgb(240,224,248), rgb(243, 237, 247))', border:'0px solid white', borderRadius:'30px' }}>
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
            <div style={{display:'flex',alignItems:'center',fontColor:'d5d5d5'}}>{label}</div>
            <div style={{fontSize:'5vw',color:'rgb(115 112 112)',display:"flex",justifyContent:'flex-end'}}>{value}</div>
          </div>
        </Card>

    </div>
  )
}

export default Summary