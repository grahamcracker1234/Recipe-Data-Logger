"use strict";

//const Ingredients = new FormList("#recipeFormIngredients", "ingredient");
//const Directions = new FormList("#recipeFormDirections", "direction");
Object.defineProperties(RecipeForm, {
	Ingredients: {
		value: new FormList("#recipeFormIngredients", "ingredient")
	},
	
	Directions: {
		value: new FormList("#recipeFormDirections", "direction")
	}
})
/** Run on document.ready */
$(() => {
	feather.replace(); // Render icons
	
	RecipeList.reload();
	
	RecipeForm.setup();
	
	Sort.setup();
	
	Search.setup();
});
