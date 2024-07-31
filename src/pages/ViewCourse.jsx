import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import Footer from "../components/common/Footer";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";

import VideoDetailsSidebar from "../components/core/viewCourse/VideoDetailsSidebar";
import CourseReviewModal from "../components/core/viewCourse/CourseReviewModal";

const ViewCourse = () => {
  const [reviewModal, setReviewModal] = useState(false);
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token);
      console.log("couurse Data===", courseData);
      console.log("couurse Data= 444==", courseData?.courseDetails);
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
      dispatch(setEntireCourseData(courseData.courseDetails));
      dispatch(setCompletedLectures(courseData.completedVideos));
      let lectures = 0;
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    };
    setCourseSpecificDetails();
  }, [courseId, dispatch, token]);

  return (
    <>
      <div className="hidden relative min-h-[calc(100vh-14rem)] md:flex md:flex-row">
    
       <VideoDetailsSidebar setReviewModal={setReviewModal} />
        {/* For Video */}
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <Outlet /> 
          {/* outlet is for video */}
        </div>
      </div>

{/* for mobile */}
<div className="flex flex-col h-fit relative md:hidden">

{/* sidebar & video */}
<div className="flex flex-col-reverse mt-10 p-4 gap-y-1 mx-auto">
<VideoDetailsSidebar setReviewModal={setReviewModal} />
  {/* For Video */}
  <div className="h-[calc(100vh-3.5rem)] w-[calc(100vw-3.5rem)] normal-case flex-1 overflow-auto">
          <Outlet /> 
          {/* outlet is for video */}
  </div>
        
</div>

</div>

      <Footer/>
      {/* //modal */}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
};

export default ViewCourse;
