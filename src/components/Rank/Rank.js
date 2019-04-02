import React from 'react';

//nebude mit state, muzu udelat pure function
const Rank = ({ name, entries }) => {
  return (
    <div>
      <div className='white f3'>
        {`${name}, your current entry count is...`}
        <div className='white f1 '>
          {entries}
        </div>
      </div>
    </div>
  );
}

export default Rank;