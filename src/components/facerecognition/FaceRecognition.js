import React from 'react';
import './FaceRecognition.css'

//nebude mit state, muzu udelat pure function
const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='detected' src={imageUrl} width='500px' height='auto' />
        <div className='bounding-box' style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}>
          {/* jen pro CSS abych mohl zobrazit ramecek */}
        </div>
      </div>
    </div>
  );
}

export default FaceRecognition;