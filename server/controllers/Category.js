const Category = require("../models/Category");
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
		const allCategorys = await Category.find(
			{},
			{ name: true, description: true }
		);
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.categoryPageDetails = async (req, res) => {
  try {
    // category id chahiye
    // get all couses corresponding to that category id-->ek category k multiple courses ho skte h
    // validation
    // get courses for diff category...//recommendation
    // get top selling courses ...
    // return response

    // START
    // category id chahiye
    const { categoryId } = req.body; ///  front-end se fetch kiya


    // get all couses corresponding to that category id-->ek category k multiple courses ho skte h
    const selectedCategory = await Category.findById(categoryId) //category wale collection m se collectio id k dwara search krke...jo v answer ayaa usme courses ko populate krke.. data selected category m store kr liya
      .populate({
        path:"courses",
        match:{status:"Published"},
        populate:["ratingAndReviews","instructor"]
      })
      .exec();

    // validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data not Found",
      });
    }
    // get courses for diff category...//recommendation

    const categoriesExpectedSelected = await Category.find({
      _id: { $ne: categoryId }, //ese category ka course lake do jiski id is CategoryId k equal nhi ho..[$ne] se
    })
    let differentCategory=await Category.findOne(
      categoriesExpectedSelected[getRandomInt(categoriesExpectedSelected.length)]._id
    )
    .populate({
      path: "courses",
      match: { status: "Published"},
      populate: {
        path: "instructor",
      },
    })
    .exec()
 //console.log("Different COURSE", differentCategory)
    //get top 10 selling courses-->[[[[esa number ho-->kon sa course kitni baar bik chuka h]-->uske according mai sort kr paunga..and priority de dunag]]]
    //HW - write it on your own
    //top selling courses
    const allCategories=await Category.find()
    .populate({
      path:"courses",
      match:{
        status:"Published"
      },
      populate:{
        path:"instructor",
      },
    }).exec()

const allCourses = allCategories.flatMap((category)=>category.courses)
const mostSellingCourses=allCourses.sort((a,b)=>b.sold-a.sold)
.slice(0,10)


    // return response
     res.status(200).json({
        success:true,
        data: {
            selectedCategory,
            differentCategory,
            mostSellingCourses,
        },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// exports.categoryPageDetails = async (req, res) => {
// 	try {
// 		const { categoryId } = req.body;

// 		// Get courses for the specified category
// 		const selectedCategory = await Category.findById(categoryId)
// 			.populate({
//         path:"courses",
//         match:{status:"Published"},
//         populate:["ratingAndReviews","instructor"]
//       })
// 			.exec();
// 		console.log(selectedCategory);
// 		// Handle the case when the category is not found
// 		if (!selectedCategory) {
// 			console.log("Category not found.");
// 			return res
// 				.status(404)
// 				.json({ success: false, message: "Category not found" });
// 		}
// 		// Handle the case when there are no courses
// 		if (selectedCategory?.courses?.length === 0) {
// 			console.log("No courses found for the selected category.");
// 			return res.status(404).json({
// 				success: false,
// 				message: "No courses found for the selected category.",
// 			});
// 		}

// 		const selectedCourses = selectedCategory.courses;

// 		// Get courses for other categories
// 		const categoriesExceptSelected = await Category.find({
// 			_id: { $ne: categoryId },
// 		}).populate("courses");
// 		let differentCourses = [];
// 		for (const category of categoriesExceptSelected) {
// 			differentCourses.push(...category.courses);
// 		}

// 		// Get top-selling courses across all categories
// 		const allCategories = await Category.find().populate("courses");
// 		const allCourses = allCategories.flatMap((category) => category.courses);
// 		const mostSellingCourses = allCourses
// 			.sort((a, b) => b.sold - a.sold)
// 			.slice(0, 10);

// 		res.status(200).json({
// 			success:true,
// 			selectedCourses: selectedCourses,
// 			differentCourses: differentCourses,
// 			mostSellingCourses: mostSellingCourses,
// 		});
// 	} catch (error) {
// 		return res.status(500).json({
// 			success: false,
// 			message: "Internal server error",
// 			error: error.message,
// 		});
// 	}
// };