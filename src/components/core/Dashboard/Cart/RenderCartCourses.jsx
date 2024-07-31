// import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import {GiNinjaStar} from "react-icons/gi"
// import {RiDeleteBin6Line} from "react-icons/ri"
// import { removeFromCart } from '../../../../slices/cartSlice'
// import ReactStars from "react-rating-stars-component";

// const RenderCartCourses = () => {

//     const {cart} = useSelector((state) => state.cart);
//     const dispatch = useDispatch();


//   return (
//     <div>
//     {
//         cart.map((course, index) => (
//             <div>
//                 <div>
//                     <img src={course?.thumbnail} />
//                     <div>
//                         <p>{course?.courseName}</p>
//                         <p>{course?.category?.name}</p>
//                         <div>
//                             <span>4.8</span>
//                             <ReactStars
//                                 count={5}
//                                 size={20}
//                                 edit={false}
//                                 activeColor="#ffd700"
//                                 emtpyIcon={<GiNinjaStar />}
//                                 fullIcon={<GiNinjaStar />}
//                             /> 

//                             <span>{course?.ratingAndReviews?.length} Ratings</span>

//                         </div>
//                     </div>
//                 </div>

//                 <div>
//                     <button
//                     onClick={() => dispatch(removeFromCart(course._id))}
//                     >
//                         <RiDeleteBin6Line/>
//                         <span>Remove</span>
//                     </button>

//                     <p>Rs {course?.price} </p>
//                 </div>
//             </div>
//         ))
//     }
      
//     </div>
//   )
// }

// export default RenderCartCourses
import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {RiDeleteBin6Line} from "react-icons/ri"
import { FaStar } from "react-icons/fa";
import { removeFromCart } from "../../../../slices/cartSlice";
import ReactStars from "react-rating-stars-component";
import GetAvgRating from "../../../../utils/avgRating";
const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart); //data fetch
 const dispatch=useDispatch();
  return (
    <div className="flex flex-1 flex-col">
      {cart.map((course, index) => {
        const count=GetAvgRating(course?.ratingAndReviews);
        const avgReviewCount=count;

     return (
      <div
        key={index}
        >
        {/* left section */}
          <div className="flex flex-1 flex-col gap-4 lg:flex-row">
            <img src={course?.thumbnail} 
            className="h-[148px] w-[148px] rounded-lg object-cover"
            alt={course.name} />
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-medium text-richblack-5">{course.courseName}</p>
              <p className="text-sm text-richblack-300">{course?.category?.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-5">{avgReviewCount ||0} </span>
                <ReactStars
                  count={5}
                  value={avgReviewCount ||0}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<AiOutlineStar />}
                  halfIcon={<FaStar />}
                  fullIcon={<AiFillStar />}
                />

                <span className="text-richblack-400">{course?.ratingAndReviews?.length} Ratings</span>
              </div>
            </div>
          </div>
       {/* right section */}
        <div className="flex flex-col items-end space-y-2">
            <button
            onClick={()=>dispatch(removeFromCart(course._id))
            
            }
            className="flex items-center gap-x-1 rounded-md border-b-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200 "
            >
                <RiDeleteBin6Line/>
                <span>Remove</span>
            </button>
            <p className="mb-6 text-3xl font-medium text-yellow-100">Rs.{course?.price} </p>
        </div>


        </div>

     )


      })}



    </div>
  );
};

export default RenderCartCourses;
