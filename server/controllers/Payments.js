const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");



exports.capturePayment = async (req, res) => {
    // jb buy now p click
    const {courses}=req.body;
    const userId=req.user.id;
    if(courses.length===0){
      return res.json({success:false,
        message:"Please provide CourseId"})
    }
    //total amount-->Rs.100*5
  
  
  let totalAmount=0;
  for(const course_id of courses){
    let course;
    try {
  
      course=await Course.findById(course_id); //  
      if(!course){
        return res.json({
          success:false,
          message:'Could not find the course',
      });
      }
     
  
  const uid=new mongoose.Types.ObjectId(userId);//createFromHexString
  //chk if user already enrolled
  if(course.studentsEnrolled.includes(uid)){
    return res.json({
      success:false,
      message:'Student is already enrolled',
  });
  }
  totalAmount +=course.price;
  
  
  } catch (error) {
      return res.json({
        success:false,
        message:error.message,
    });
    }
  }
  // const currency="INR";//-*****
  const options={
    amount:totalAmount*100,
    currency:"INR",
    receipt:Math.random(Date.now()).toString(),
  }
  try {
    //create order/response
    const paymentResponse = await instance.orders.create(options);
    res.json({
      success:true,
      data:paymentResponse,
      msg:'order Created [glti..data send always ]'
    })  
  } catch (error) {
    console.log(error);
    return res.status(400).json({
        success:false,
        message:"Could not initiate order",
    });
  }
  }
//2.verify the payment'
// only signatuure verifaction done here--->JO SIGNATURE TUMNE CREATE KIYA AUR, JO RAZORPAY SE AAYA H,KYA WO MATCH KR RHA H...IF YES..CONSIDER A SUCCESSFUL PAYMENT-->BASIS ON that Assign a course
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id=req.body?.razorpay_order_id;
    const razorpay_payment_id=req.body?.razorpay_payment_id;
    const razorpay_signature=req.body?.razorpay_signature;
    const courses =req.body?.courses;
    const userId=req?.user?.id;
    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
      return res.status(401).json({success:false,message:'Payment Failed '});
    }
// FROM RAZORPAY DOC.   //PIPE Optr
let body=razorpay_order_id+"|"+razorpay_payment_id;
const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET)
.update(body.toString())
.digest("hex");
if(expectedSignature === razorpay_signature){
//enroll karwao student
enrollStudents(courses,userId,res)
return res.status(200).json({success:true,message:"Payment Verified"});
//--->1.saare courses p traverse kro har course ki student enrolled andr ki list pr bacche ki userId insert kr do
//--->2.jo user h jisne course/courses buy kiye h ->wo saare k saare course/courses ids us bachche ki v course k list m insert kr do
//return res
}
// return res.status(500).json({success:false,message:"Payment Not Verified"});
}
// 3. after verification..enroll student
const enrollStudents=async(courses,userId,res)=>{
  // a.saare courses  p travel, har "course" ki "StudentsEnrolled" ki list m userId insert kr do bacche ki
  // b.jo user h,jo courses buy kiye h..us bachhe k "coursseList" m ,wo saare "courseId"s insert kr do
  if(!courses || !userId) {
  return res.status(404).json({
    success:false,
    message:"Please provide data for Course ID or UserId"});
}
//ab multiple courses h to har course k andar bacche ko insert krna padega--> 
//to har courses k andar traverse krna padega
for(const courseId of courses){
  try {
    // #NOTE-->push means->insert
  //1. find the course and enroll the student in it
  const enrolledCourse=await Course.findByIdAndUpdate(
    { _id: courseId },
  {$push:{studentsEnrolled:userId}}, // studentEnrolled m unserId ko insert kr di
  {new:true},  //for updated
)
console.log("Enrolled course 1: ", enrolledCourse)
if(!enrolledCourse){
  return res.status(500).json({
    success: false,
    message: "Course not Found",
  }); 
}
console.log("Enrolled course 2: ", enrolledCourse)
//verify payment done hone k baad,uss bachhe ki uss course m progress object create krni pdegi ,initially..
// A.
const courseProgress = await CourseProgress.create({
  courseID:courseId,
  userId:userId,
 completedVideos:[], //array empty at starting
})

// 2. find the student and add the course to their enrolled Courses
const enrolledStudent=await User.findByIdAndUpdate(
  userId, //ye chhuta tha
  {$push:{
    courses:courseId,
  courseProgress:courseProgress._id,//B. courseProgress associate 
  }, //course id m insert krna h
},
{new:true},
//bachhe ko mail send krdo
)

if (!enrolledStudent) {
  return res.status(401).json({
    success: false,
    message: "User Not Found",
  });
}

console.log("Enrolled student: ", enrolledStudent)

const emailResponse =await mailSender(
  enrolledStudent.email,
 `Successfully Enrolled into ${enrolledCourse.courseName}`,
 courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName} ${enrolledStudent.lastName}`) 
);

console.log("Email Sent Successfully ", emailResponse.response)

  } catch (error) {
    console.log("Error while enrolling student in course and vice versa",error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
}

}

exports.sendPaymentSuccessEmail=async(req,res)=>{
  const {orderId,paymentId,amount}=req.body;
  const userId=req.user.id;
  if(!orderId || !userId || !paymentId|| !amount ) return res.status(400).json({success:false, message:"Please provide all the fields"});
//student ko dhundo aur mail send kro usko
try {
  //student ko dhundo 
  const enrolledStudent=await User.findById(userId);
  await mailSender(
    enrolledStudent.email,
    `Payment Recieved`,
    paymentSuccessEmail(`${enrolledStudent.firstName}`,
    amount/100,orderId,paymentId)
  )
} catch (error) {
  console.log("error in sending mail", error)
  return res.status(500).json({success:false, message:"Could not send email"})
}

}


// //initiate the razorpay order
// exports.capturePayment = async(req, res) => {

//     const {courses} = req.body;
//     const userId = req.user.id;

//     if(courses.length === 0) {
//         return res.json({success:false, message:"Please provide Course Id"});
//     }

//     let totalAmount = 0;

//     for(const course_id of courses) {
//         let course;
//         try{
           
//             course = await Course.findById(course_id);
//             if(!course) {
//                 return res.status(200).json({success:false, message:"Could not find the course"});
//             }

//             const uid  = new mongoose.Types.ObjectId(userId);
//             if(course.studentsEnrolled.includes(uid)) {
//                 return res.status(200).json({success:false, message:"Student is already Enrolled"});
//             }

//             totalAmount += course.price;
//         }
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({success:false, message:error.message});
//         }
//     }
//     const currency = "INR";
//     const options = {
//         amount: totalAmount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//     }

//     try{
//         const paymentResponse = await instance.orders.create(options);
//         res.json({
//             success:true,
//             message:paymentResponse,
//         })
//     }
//     catch(error) {
//         console.log(error);
//         return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
//     }

// }
//1.to order initiate


// //verify the payment
// exports.verifyPayment = async(req, res) => {
//     const razorpay_order_id = req.body?.razorpay_order_id;
//     const razorpay_payment_id = req.body?.razorpay_payment_id;
//     const razorpay_signature = req.body?.razorpay_signature;
//     const courses = req.body?.courses;
//     const userId = req.user.id;

//     if(!razorpay_order_id ||
//         !razorpay_payment_id ||
//         !razorpay_signature || !courses || !userId) {
//             return res.status(200).json({success:false, message:"Payment Failed"});
//     }

//     let body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//         .createHmac("sha256", process.env.RAZORPAY_SECRET)
//         .update(body.toString())
//         .digest("hex");

//         if(expectedSignature === razorpay_signature) {
//             //enroll karwao student ko
//             await enrollStudents(courses, userId, res);
//             //return res
//             return res.status(200).json({success:true, message:"Payment Verified"});
//         }
//         return res.status(200).json({success:"false", message:"Payment Failed"});

// }


// const enrollStudents = async(courses, userId, res) => {

//     if(!courses || !userId) {
//         return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
//     }

//     for(const courseId of courses) {
//         try{
//             //find the course and enroll the student in it
//         const enrolledCourse = await Course.findOneAndUpdate(
//             {_id:courseId},
//             {$push:{studentsEnrolled:userId}},
//             {new:true},
//         )

//         if(!enrolledCourse) {
//             return res.status(500).json({success:false,message:"Course not Found"});
//         }

//         const courseProgress = await CourseProgress.create({
//             courseID:courseId,
//             userId:userId,
//             completedVideos: [],
//         })

//         //find the student and add the course to their list of enrolledCOurses
//         const enrolledStudent = await User.findByIdAndUpdate(userId,
//             {$push:{
//                 courses: courseId,
//                 courseProgress: courseProgress._id,
//             }},{new:true})
            
//         ///bachhe ko mail send kardo
//         const emailResponse = await mailSender(
//             enrollStudents.email,
//             `Successfully Enrolled into ${enrolledCourse.courseName}`,
//             courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
//         )    
//         //console.log("Email Sent Successfully", emailResponse.response);
//         }
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({success:false, message:error.message});
//         }
//     }

// }

// exports.sendPaymentSuccessEmail = async(req, res) => {
//     const {orderId, paymentId, amount} = req.body;

//     const userId = req.user.id;

//     if(!orderId || !paymentId || !amount || !userId) {
//         return res.status(400).json({success:false, message:"Please provide all the fields"});
//     }

//     try{
//         //student ko dhundo
//         const enrolledStudent = await User.findById(userId);
//         await mailSender(
//             enrolledStudent.email,
//             `Payment Recieved`,
//              paymentSuccessEmail(`${enrolledStudent.firstName}`,
//              amount/100,orderId, paymentId)
//         )
//     }
//     catch(error) {
//         console.log("error in sending mail", error)
//         return res.status(500).json({success:false, message:"Could not send email"})
//     }
// }


// //capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//     //get courseId and UserID
//     const {course_id} = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid courseID
//     if(!course_id) {
//         return res.json({
//             success:false,
//             message:'Please provide valid course ID',
//         })
//     };
//     //valid courseDetail
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course) {
//             return res.json({
//                 success:false,
//                 message:'Could not find the course',
//             });
//         }

//         //user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)) {
//             return res.status(200).json({
//                 success:false,
//                 message:'Student is already enrolled',
//             });
//         }
//     }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }
    
//     //order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     };

//     try{
//         //initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         });
//     }
//     catch(error) {
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Could not initiate order",
//         });
//     }
    

// };

// //verify Signature of Razorpay and Server

// exports.verifySignature = async (req, res) => {
//     const webhookSecret = "12345678";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum =  crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest) {3
//         console.log("Payment is Authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try{
//                 //fulfil the action

//                 //find the course and enroll the student in it
//                 const enrolledCourse = await Course.findOneAndUpdate(
//                                                 {_id: courseId},
//                                                 {$push:{studentsEnrolled: userId}},
//                                                 {new:true},
//                 );

//                 if(!enrolledCourse) {
//                     return res.status(500).json({
//                         success:false,
//                         message:'Course not Found',
//                     });
//                 }

//                 console.log(enrolledCourse);

//                 //find the student andadd the course to their list enrolled courses me 
//                 const enrolledStudent = await User.findOneAndUpdate(
//                                                 {_id:userId},
//                                                 {$push:{courses:courseId}},
//                                                 {new:true},
//                 );

//                 console.log(enrolledStudent);

//                 //mail send krdo confirmation wala 
//                 const emailResponse = await mailSender(
//                                         enrolledStudent.email,
//                                         "Congratulations from studynotion",
//                                         "Congratulations, you are onboarded into new studynotion Course",
//                 );

//                 console.log(emailResponse);
//                 return res.status(200).json({
//                     success:true,
//                     message:"Signature Verified and COurse Added",
//                 });


//         }       
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else {
//         return res.status(400).json({
//             success:false,
//             message:'Invalid request',
//         });
//     }


// };