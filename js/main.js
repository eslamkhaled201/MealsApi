let popUpWindow = $(".popUp-window");
let popUpInnerBox = $(".window-inner");
let CloseIcon = $("#closeIcon");
let nextMealArrow = $("#popUp-next");
let pervMealArrow = $("#popUp-prev");
let images = $(".meal-img");
let arrayOfImages = Array.from(images);
let currentMealIndex;
let categoriesArray = [];
let mealsArray = [];
let mealData ;

/* get request function*/
let getRequest = async (url = '') => {
    try {
        let response = await fetch(url);
        let responseData = await response.json();
        return responseData;
    } catch (error) {
        console.log(error.message);
    }
}

/** get category meals  */
let getCategoryMeals = async (categoryName) => {
    try {
        let categoryMeals = await getRequest(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
        mealsArray = categoryMeals.meals;
    } catch (error) {
        console.log(error.message);
    }
}


/* display categories */
let displayCategories = async () => {
    let getCategories = await getRequest("https://www.themealdb.com/api/json/v1/1/categories.php");
    categoriesArray = getCategories.categories;
    categoriesArray.forEach(item => {
        $("#category-list").append(`<li class="cat-item col-md-3 col-sm-4 ">${item.strCategory}</li>`);
    });
}


/* display meals **/
let displayMeals =  (categoryName) => {
    $("#category-name").text(categoryName);
    let meals = ``;
    mealsArray.forEach((element, index) => {
        meals += `<div  class="meal_card col-md-4 shadow">
        <div class="img-container">
            <img src="${element.strMealThumb}" alt="meal image" class="meal-img">
        </div>
        <div class="meal-info-link flex-column-center">
            <h5 class="meal-name">${element.strMeal}</h5>
            <button meal-index=${index} class="btn btn-orange btnMore">know more</button>
        </div>
    </div>`;
    });
    $(".meals_list .row").html(meals);
    displayMealDetails();
}

/* change meals */
let changeMeals = () => {
    $(".cat-item").click(async function () {
        let categoryName = $(this).text();
        await getCategoryMeals(categoryName);
        displayMeals(categoryName);
    })
}


/* get meal data */
let getMealData = async (mealId)=>{
    let requestData = await getRequest(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    mealData = requestData.meals[0];    
}

/* function display meal details */
let displayMealDetails =  () => {
    $(".btnMore").click(async function () {
        let mealIndex = $(this).attr("meal-index");
        currentMealIndex = mealIndex;
        let meal = mealsArray[mealIndex];
        $(".popUp-img").attr("src", `${meal.strMealThumb}`);
        $(".meal-heading").text(meal.strMeal);
        await getMealData(meal.idMeal);
        displayCookSteps(mealData.strInstructions);
        showPopUp();
    })
}
/** show popup window functioan */
function showPopUp() {
    $(popUpWindow).removeClass("hide").addClass("show");
}

/* slice string to sectences */
let displayCookSteps  = (mealIns) =>{
    let splitedsStr =  mealIns.split("."); 
    let Lenght = splitedsStr.length;
    splitedsStr.forEach((step , index) => {
        if (index == Lenght-1) return;
        $(".details-list")
        .append(`<li><i class="fas fa-check"></i>${step.trim()}.</li>`)
    });
}

/* meals funcitons execution async handling  */
let ExecutionHandling = async () => {
    await displayCategories();
    await getCategoryMeals(categoriesArray[0].strCategory);
     displayMeals(categoriesArray[0].strCategory);
    changeMeals();  
}
ExecutionHandling();



/** close the popup functionality */
// main close funtion
let closePopUp = () => {
    $(popUpWindow).addClass("hide").removeClass("show");
}

// close by close icon 
$(CloseIcon).click((e) => { closePopUp(e) })

// close by click on designbox rounded area
$(popUpWindow).click((e) => {
    let EventTar = e.target;
    if (EventTar == popUpWindow[0]) {
        closePopUp();
    }
})

$(document).keyup((e) => {
    let rightArrowkeycode = 39;
    let leftArrowkeycode = 37;
    let escKeyCode = 27;
    let eventKeyCode = e.keyCode;

    // close popup by esc button 
    if (eventKeyCode == escKeyCode) {
        closePopUp();
    } else if (eventKeyCode == rightArrowkeycode) {
        // change popup image to next images  
        getNextMeal();
    } else if (eventKeyCode == leftArrowkeycode) {
        // change popup image to next images 
        getpervMeal();
    }
});

/** swaping between images functionality */
// function to change current background img to next img 
let getNextMeal = () => {
    currentMealIndex++;
    let nextImg = arrayOfImages[currentMealIndex];
    let imgSrc = nextImg.src;
    if (currentMealIndex == arrayOfImages.length - 1) {
        currentMealIndex = 0;
    }
    $(popUpInnerBox).css("background-image", `url(${imgSrc})`);
}

// function to change current background img to previous img 
let getpervMeal = () => {
    currentMealIndex--;
    if (currentMealIndex <= 0) {
        currentMealIndex = arrayOfImages.length - 1;
    }
    let prevImg = arrayOfImages[currentMealIndex];
    let imgSrc = prevImg.src;
    $(popUpInnerBox).css("background-image", `url(${imgSrc})`);
}

// swap images by popup arrows
$(nextMealArrow).click((e) => { getNextMeal(e) });
$(pervMealArrow).click((e) => { getpervMeal(e) });


