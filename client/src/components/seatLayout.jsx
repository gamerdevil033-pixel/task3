export const SeatLayout = (props) => {
  const { seats,ticketsBooked,selectedSeats,setSelectedSeats,unavailableSeats,maxSeatCount,setMaxSeatCount,show} = props;

  const seatSizes = {
    height: 30,
    width: 30,
    gap: 10,
  };

  const colors = {
  'available': {color: 'transparent' },
  'booked': {color: '#D32F2F' },
  'selected': {color: '#388E3C' },
  'unavailable': {color: '#636363' }, // e.g., selected but not confirmed by others
  };

  function isSeatBooked(seatId){
   return ticketsBooked.some((entity) => {return entity.seatsBooked.includes(seatId)})
  }


  return (
    <svg className="w-[800px] overflow-x-scroll overflow-y-scroll border-2 border-[#636363] p-2" viewBox={`0 0 ${820} ${500}`}>
      {seats.map((arr1, i) =>
        arr1.map((seat, j) => {
          let x;
          if(j>9){
          x = seatSizes.gap * (j) + seatSizes.width * j + 3*seatSizes.gap;
          }else{
          x = seatSizes.gap * (j) + seatSizes.width * j;
          }
         const y = seatSizes.gap * (i) + seatSizes.height * i;

          let seatColor ;

          if(isSeatBooked(seat.id)){
            seatColor = colors['booked'].color
          } else if(selectedSeats.includes(seat.id)){
             seatColor = colors['selected'].color
          } else if(unavailableSeats.includes(seat.id)){
             seatColor = colors['unavailable'].color}
            else{ seatColor = colors['available'].color}

          return (
            <svg key={`seat-${i}-${j}`} transform={`translate(${x}, ${y})`}>
              <rect
                width={seatSizes.width}
                height={seatSizes.height}
                fill={seatColor}
                stroke="gray"
                strokeWidth="2"
                rx="5"
                ry="5"
                className="cursor-pointer hover:border-white border-2 border-[#636363] transition duration-200" onClick={()=>{
                  if(!selectedSeats.includes(seat.id) && !unavailableSeats.includes(seat.id)){
                        if(selectedSeats.length<maxSeatCount){
                    setSelectedSeats(prev=>[...prev,seat.id]);
                    // socket.emit('sendMsg',{
                    //   roomName:show.date+show.slot,
                    //   add:seat.id,
                    // })
                  }

                  if(selectedSeats.length>=maxSeatCount){
                  // socket.emit('sendMsg',{
                  //     roomName:show.date+show.slot,
                  //     add:seat.id,
                  //     remove:selectedSeats[0]
                  //   })
                   const newArray = [...selectedSeats]; // create a shallow copy
                   newArray.splice(0, 1);
                   setSelectedSeats([...newArray,seat.id]);
                  }
                  }

                  if (selectedSeats.includes(seat.id)) {
                    // socket.emit('sendMsg',{
                    //   roomName:show.date+show.slot,
                    //   remove:seat.id
                    // })
                   const newArray = [...selectedSeats]; // create a shallow copy
                   newArray.splice(newArray.indexOf(seat.id), 1);
                   setSelectedSeats(newArray);//removing the selected seat
                }

                  }}
              />
              <text
                x={seatSizes.width / 2}
                y={seatSizes.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="white"
                pointerEvents="none"
                className='select-none'
              >
                {seat.id}
              </text>
            </svg>
          );}))}
    
     <svg transform={`translate(${205}, ${460})`}>
             <rect
                width='410'
                height='40'
                fill='white'
                stroke="gray"
                strokeWidth="2"
                rx="5"
                ry="5"
                className="cursor-pointer"
              />
              <text
                x={410/2}
                y={20}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fill="black"
                pointerEvents="none"
                className='select-none'
              >Screen</text>
      </svg>
    </svg>
  );
};