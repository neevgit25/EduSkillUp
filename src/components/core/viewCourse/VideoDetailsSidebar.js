// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import IconBtn from "../../common/IconBtn";

// const VideoDetailsSidebar = ({ setReviewModal }) => {
//   const [activeStatus, setActiveStatus] = useState("");
//   const [videoBarActive, setVideoBarActive] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { sectionId, subSectionId } = useParams();
//   const {
//     courseSectionData,
//     courseEntireData,
//     totalNoOfLectures,
//     completedLectures,
//   } = useSelector((state) => state.viewCourse);

//   useEffect(() => {
//     const setActiveFlags = () => {
//       if (!courseSectionData?.length) return;
//       const currentSectionIndex = courseSectionData.findIndex(
//         (data) => data._id === sectionId
//       );
//       const currentSubSectionIndex = courseSectionData?.[
//         currentSectionIndex
//       ]?.subSection.findIndex((data) => data._id === subSectionId);
//       const activeSubSectionId =
//         courseSectionData[currentSectionIndex]?.subSection?.[
//           currentSubSectionIndex
//         ]?._id;
//       //set current section here
//       setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
//       //set current sub-section here
//       setVideoBarActive(activeSubSectionId);
//     };
//     setActiveFlags();
//   }, [courseSectionData, courseEntireData, location.pathname]);

//   const handleAddReview = () => {
//     console.log("I am inside Add handleAddReview");
//     setReviewModal(true);
//   };

//   return (
//     <>
//       <div className="text-white">
//         {/* for buttons and headings */}
//         <div>
//           {/* for buttons */}
//           <div>
//             <div
//               onClick={() => {
//                 navigate("/dashboard/enrolled-courses");
//               }}
//             >
//               Back
//             </div>

//             <div>
//               <IconBtn text="Add Review" onclick={() => setReviewModal(true)} />
//             </div>
//           </div>
//           {/* for heading or title */}
//           <div>
//             <p>{courseEntireData?.courseName}</p>
//             <p>
//               {completedLectures?.length} / {totalNoOfLectures}
//             </p>
//           </div>
//         </div>

//         {/* for sections and subSections */}
//         <div>
//           {courseSectionData?.map((course, index) => (
//             <div onClick={() => setActiveStatus(course?._id)} key={index}>
//               {/* section */}

//               <div>
//                 <div>{course?.sectionName}</div>
//                 {/* HW- add icon here and handle rotate 180 logic */}
//               </div>

//               {/* subSections */}
//               <div>
//                 {activeStatus === course?._id && (
//                   <div>
//                     {course.subSection.map((topic, index) => (
//                       <div
//                         className={`flex gap-5 p-5 ${
//                           videoBarActive === topic._id
//                             ? "bg-yellow-200 text-richblack-900"
//                             : "bg-richblack-900 text-white"
//                         }`}
//                         key={index}
//                         onClick={() => {
//                           navigate(
//                             `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
//                           );
//                           setVideoBarActive(topic?._id);
//                         }}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={completedLectures.includes(topic?._id)}
//                           onChange={() => {}}
//                         />
//                         <span>{topic.title}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default VideoDetailsSidebar;

//mk
import { MdOndemandVideo } from "react-icons/md";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { AiOutlineDown } from "react-icons/ai";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

const VideoDetailsSidebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    (() => {
      if (!courseSectionData.length) {
        return;
      }
      // current section index
      const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
      );

      // current subsection index
      const currentSubSectionIndex = courseSectionData?.[
        currentSectionIndex
      ]?.subSection.findIndex((data) => data._id === subSectionId);

      const activeSubSectionId =
        courseSectionData[currentSectionIndex]?.subSection?.[
          currentSubSectionIndex
        ]?._id;

      //setCurrent section
      setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
      //set Current Subsection
      setVideoBarActive(activeSubSectionId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <>
      <div className="h-[calc(100vh-3.5rem)] w-[300px] max-w-[300px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 md:flex hidden">
        {/* For Buttons and heading */}
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          {/* for buttons */}
          <div className="flex w-full items-center justify-between h-fit ">
            <button
              onClick={() => navigate("/dashboard/enrolled-courses")}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
            >
              <MdOutlineArrowBackIosNew className="text-xl font-bold" />
            </button>

            <IconBtn text="Add Review" onclick={() => setReviewModal(true)} />
          </div>

          {/* For headings */}
          <div className="flex flex-col uppercase">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        {/* for sections and subsections */}
        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData?.map((section, index) => (
            <div
              key={index}
              onClick={() => setActiveStatus(section._id)}
              className="mt-2 cursor-pointer text-sm text-richblack-5"
            >
              {/* Section */}
              <div className="flex flex-row normal-case justify-between bg-richblack-600 px-5 py-4">
                {/* name */}
                <div className="w-[70%] font-semibold capitalize">
                  {section.sectionName}
                </div>

                <div className="flex items-center gap-3">
                  <AiOutlineDown
                    className={`${
                      activeStatus?.includes(section._id)
                        ? "rotate-180"
                        : "rotate-0"
                    } transition-all duration-500`}
                  />
                </div>
              </div>

              {/* Subsections */}
              <div className="transition-[height] duration-500 ease-in-out">
                {activeStatus === section?._id && (
                  <>
                    {section?.subSection?.map((topic, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          navigate(
                            `/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${topic._id}`
                          );

                          setVideoBarActive(topic._id);
                        }}
                        className={`flex gap-3 p-5 items-center py-2 ${
                          videoBarActive === topic._id
                            ? "bg-yellow-200 text-richblack-900"
                            : "bg-richblack-900 text-white"
                        } font-semibold capitalize `}
                      >
                        {/* checkbox and subsection name */}
                        <input
                          type="checkbox"                              
                          checked={completedLectures.includes(topic._id)}
                          className="appearance-none checked:bg-[#1ac940] checked:border-0 w-5 h-5 checked:after:content-center checked:after:left-[3.5px] checked:after:top-[1px] relative checked:after:absolute checked:after:mx-auto checked:after:items-center checked:after:content-['✔'] checked:text-caribbeangreen-700 bg-richblack-100 border-blue-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-blue-800 focus:ring-2 dark:bg-blue-700 dark:border-blue-600"                   
                          onChange={() => {}}
                        />
                        <div className="flex flex-row gap-4 justify-between text-md items-center">
                        <MdOndemandVideo className="w-[16px] h-[16px]" />
                        <span className="text-lg">{topic.title}</span>
                        
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex md:hidden w-[calc(100vw-3.5rem)] h-auto flex-col border-[2px] border-richblack-600 bg-richblack-800 mx-auto mb-10">
        {/* For Buttons and heading */}
        <div className="flex flex-col gap-2 gap-y-4 mx-auto items-center border-b border-richblack-600 py-4 text-lg font-bold text-richblack-25 absolute inset-0 h-20 bg-richblack-700 w-screen">
          {/* for buttons */}
          <div className="flex w-11/12 items-center justify-between mx-5">
            <button
              onClick={() => navigate("/dashboard/enrolled-courses")}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
            >
              <MdOutlineArrowBackIosNew className="text-xl font-bold" />
            </button>

            {/* For headings */}
            <div className="gap-4 items-center uppercase text-richblack-50 md:flex hidden">
              <p className="uppercase">{courseEntireData?.courseName}</p>
              <p className="text-sm font-semibold text-richblack-500">
                {completedLectures?.length} / {totalNoOfLectures}
              </p>
            </div>

            <IconBtn text="Add Review" onclick={() => setReviewModal(true)} />
          </div>
        </div>

        {/* for sections and subsections */}
        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {/* For headings */}
          <div className="flex gap-4 items-start sm:items-center justify-between flex-col sm:flex-row m-4 sm:px-4">
            <p className="text-lg text-richblack-25 font-bold">{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-25 ">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
          {courseSectionData?.map((section, index) => (
            <div
              key={index}
              onClick={() => setActiveStatus(section._id)}
              className="mt-2 cursor-pointer text-sm text-richblack-5"
            >
              {/* Section */}
              <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                {/* name */}
                <div className="w-[70%] font-semibold">
                  {section.sectionName}
                </div>

                <div className="flex items-center gap-3">
                  <AiOutlineDown
                    className={`${
                      activeStatus?.includes(section._id)
                        ? "rotate-180"
                        : "rotate-0"
                    } transition-all duration-500`}
                  />
                </div>
              </div>

              {/* Subsections */}
              <div className="transition-[height] duration-500 ease-in-out">
                {activeStatus === section?._id && (
                  <>
                    {section?.subSection?.map((topic, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          navigate(
                            `/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${topic._id}`
                          );

                          setVideoBarActive(topic._id);
                        }}
                        className={`flex gap-3 p-5 py-2 ${
                          videoBarActive === topic._id
                            ? "bg-yellow-200 text-richblack-900"
                            : "bg-richblack-900 text-white"
                        } font-semibold capitalize items-center `}
                      >
                        {/* checkbox and subsection name */}
                        <input
                          type="checkbox"
                    
                          checked={completedLectures.includes(topic._id)}
                          className="appearance-none checked:bg-[#1ac940] checked:border-0 w-5 h-5 checked:after:content-center checked:after:left-[3.5px] checked:after:top-[1px] relative checked:after:absolute checked:after:mx-auto checked:after:items-center checked:after:content-['✔'] checked:text-caribbeangreen-700 bg-richblack-100 border-blue-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-blue-800 focus:ring-2 dark:bg-blue-700 dark:border-blue-600"                   
                          onChange={() => {}}
                        />
                          <div className="flex font-semibold flex-row gap-4 justify-between text-md items-center">
                          <MdOndemandVideo className="w-[16px] h-[16px]" />
                        <span className="text-lg">{topic.title}</span>
                       
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoDetailsSidebar;
