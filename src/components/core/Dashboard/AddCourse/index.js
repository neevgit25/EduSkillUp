import React from 'react'
import RenderSteps from "./RenderSteps"
export default function AddCourse () {
    return (
      <>
          <div className='text-white flex w-full items-start gap-x-6'>
          <div className="flex flex-1 flex-col">
              <h1 className="mb-14 text-3xl font-medium text-richblack-5">Add Course</h1>
              <div className="flex-1">
                {/* Form */}
                  <RenderSteps  />
              </div>
          </div>
    
   <div className='sticky top-10 max-w-[400px] hidden flex-1 rounded-md p-6 border-[1px] border-richblack-700 bg-richblack-800 lg:block'>
   <p className='mb-8 text-lg text-richblack-5'>⚡ Course Upload Tips</p>
    <ul className='ml-5 list-item list-disc space-y-4 text-xs text-richblack-5'>
    <li>Set the Course Price option or make it free.</li>
              <li> Standard size for the course thumbnail is 1024x576.</li>
              <li> Video section controls the course overview video.</li>
              <li> Course Builder is where you create & organize a course.</li>
              <li>
                Add Topics in the Course Builder section to create lessons,
                quizzes, and assignments.
              </li>
              <li>
                Information from the Additional Data section shows up on the
                course single page.
              </li>
              <li> Make Announcements to notify any important</li>
              <li> Notes to all enrolled students at once.</li>
  {/* dafewo4693@comsb.com Abcd@123 */}
    </ul>
   </div>
  
  
      </div>
      </>
    )
  }