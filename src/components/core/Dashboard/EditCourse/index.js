import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import {
  editCourseDetails,
  fetchCourseDetails,
  getFullDetailsOfCourse,
} from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import RenderSteps from "../AddCourse/RenderSteps"

export default function EditCourse() {
  const dispatch = useDispatch()
  const { courseId } = useParams()
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)

  // useEffect(() => {
  //   (async () => {
  //     setLoading(true)
  //     const result = await getFullDetailsOfCourse(courseId, token)
  //     if (result?.courseDetails) {
  //       dispatch(setEditCourse(true))
  //       dispatch(setCourse(result?.courseDetails))
  //     }
  //     setLoading(false)
  //   })()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(()=>{
    const populateCourseDetails=async()=>{
        setLoading(true);
        //mujhe course ki saari ki saari details chahiye
       const result =await 
       getFullDetailsOfCourse(courseId,token); 
       //check if result k andar details present h
       if(result?.courseDetails){
        dispatch(setEditCourse(true)); //edit wala flag ko true mark kr di..[[present in slice]]
        //secondly course ko set kr do..isse course m data aa gyi
        dispatch(setCourse(result?.courseDetails))
       }
       setLoading(false);
    }
    populateCourseDetails();
},[])

if(loading){
  return (
      <div>Loading...</div>

  )
}

return (
  <div className='text-white'   >
  <h1>Edit Course</h1>
  {/* //sare purane logic */}
  <div>
  {/* mere paas course k andar data h to mai us data ko show krunga ...RenderSteps component ko
  and,edit wale flag to true,mark krna pdega
  */}
{/* course k andar ka data,aayega kahhan se to usko-->> call krna padega */}

{
  course?(<RenderSteps/>):(<p>Course Not Found</p>)
}
  </div>
  
  </div>
)
}




