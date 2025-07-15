import React,{useState,useEffect} from 'react'


 
 
const Rating = ({intialRating,onRate}) => {

  // State to hold the rating value
  // This will be used to display the stars based on the rating
  const [rating,setRating] = useState(intialRating || 0);

  // Function to handle the rating change
  // This will update the rating state and call the onRate callback if provided
  const handleRating = (value) => {
    setRating(value);
    if (onRate) {
      onRate(value);
    }
  }

  useEffect(() => {
    if(intialRating) {
      setRating(intialRating);
    }
  }, [intialRating]);

  return (
    <div>
         
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          return (
            <span key={index} className={`cursor-pointer text-xl sm:text-2xl transition-colours ${rating >= starValue ? 'text-yellow-500' : 'text-gray-400'}`} onClick={() => handleRating(starValue)}>
              &#9733; {/* Unicode star character */}
            </span>
          )})
        }
    </div>
  )
}

export default Rating