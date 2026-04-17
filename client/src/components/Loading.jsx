import React from 'react'
import '../styling/Loading.css'

function Loading() {
  return (
    <main className="page">
        <div className="blobA" aria-hidden="true" />
        <div className="blobB" aria-hidden="true" />
        <section className="loading-card">
            <h1 className='title'>Loading...</h1>            
        </section>
    </main>
  )
}

export default Loading
