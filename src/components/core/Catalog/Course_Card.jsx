import React, { useEffect, useState } from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const CourseCard = ({course, Height}) => {


    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=> {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])


    
    return (
        <div className="">
          <Link to={`/course/${course._id}`}>
            <div>
              <div className="rounded-lg">
                <img
                  src={course?.thumbnail}
                  alt="thumbnail"
                  className={`${Height} w-full rounded-xl object-cover`}
                />
              </div>
    {/* Details of course */}
              <div className="flex flex-col gap-2 px-1 py-3">
              {/* title */}
                <p className='text-xl text-richblack-5'>{course?.courseName}</p>
                  {/* Instructor Name */}
                <p className='text-sm text-richblack-50'>{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                <div className="flex gap-2 items-center">
                  <span className='text-yellow-5'> {avgReviewCount || 0} </span>
                  <RatingStars Review_Count={avgReviewCount} />
                    {/* how many people alrady given their ratings */}
                  <span className='text-richblack-400'> | {course?.ratingAndReviews?.length} Ratings </span>
                </div>
                <p className='text-xl text-richblack-5'>₹ {course?.price} </p>
              </div>
            </div>
          </Link>
        </div>
      );
}

export default CourseCard
