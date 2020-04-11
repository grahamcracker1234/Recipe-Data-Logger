/** Static class encapsulating all methods for the recipe form. */
class RecipeForm {
	/** @prop {Object} TypeEnum	- The get-only Enumerations used to determine whether which form is being used. */
	static get TypeEnum() { 
		return Object.freeze({
			edit: 0,
			add: 1
		});
	}
	
	/** Initializes the recipe form. */
	static setup() {
		$(".custom-file-input").on("change", function() {
			const fileName = $(this).val().split("\\").pop();
			$(this).prev(".custom-file-label").addClass("selected").text(fileName);
		});
		
		$("#addRecipe").click(() => this.add());

		$("#recipeFormAddIngredient").click(() => this.Ingredients.addInput());
		$("#recipeFormRemoveIngredient").click(() => this.Ingredients.removeInput());

		$("#recipeFormAddDirection").click(() => this.Directions.addInput());
		$("#recipeFormRemoveDirection").click(() => this.Directions.removeInput());

		$("#recipeForm").submit((event) => RecipeForm.submit(event));
		$("#recipeFormSubmit").click(() => $("#recipeForm").submit());
	}
	
	/** Readies the form for adding a recipe. */
	static add() {
		$("#recipeFormType").val(this.TypeEnum.add);
		$("#recipeFormHeader").text("Add Recipe");
		$("#recipeFormSubmit").text("Create");
		$(".custom-file-label").text("Choose Image…");

		$("#recipeFormName").prop("disabled", false);

		this.Ingredients.reset();
		this.Directions.reset();
		$("#recipeForm").get(0).reset();
		
		$("#recipeFormModal").modal("show");
	}
	
	/** Readies the form for editing a recipe. */
	static edit(recipe) {
		$("#recipeFormType").val(this.TypeEnum.edit);
		$("#recipeFormHeader").text("Edit Recipe");
		$("#recipeFormSubmit").text("Save Changes");

		$("#recipeForm").get(0).reset();

		if(recipe); else return;

		$("#recipeFormName")
			.val(recipe.name)
			.prop("disabled", true);

		$("#recipeFormCategory").val(recipe.category);

		$("#recipeFormDescription").val(recipe.description);

		const ingredientsCount = (recipe.ingredients.length > this.Ingredients.defaultInputCount) ? recipe.ingredients.length : this.Ingredients.defaultInputCount;
		this.Ingredients.reset(ingredientsCount);
		for(let i = 0; i < ingredientsCount; i++)
			$("#recipeFormIngredients").children().eq(i).val(recipe.ingredients[i]);

		const directionsCount = (recipe.directions.length > this.Directions.defaultInputCount) ? recipe.directions.length : this.Directions.defaultInputCount;
		this.Directions.reset(directionsCount);
		for(let i = 0; i < directionsCount; i++)
			$("#recipeFormDirections").children().eq(i).val(recipe.directions[i]);

		if(recipe.imageLink) $(".custom-file-label").text("Change Image…?");
		else $(".custom-file-label").text("Choose Image…");

		recipe.dateModified = new Date();
		
		$("#recipeFormModal").modal("show");
	}
	
	/** Submits the recipe form. */
	static submit(event) {
		event.preventDefault();

		const recipeName = $("#recipeFormName").prop('disabled', false).val();
		const formType = $("#recipeFormType").val();
		if (RecipeList.getAvailability(recipeName)); else if (formType == this.TypeEnum.add) {
			alert("This recipe name is already in use...\nPlease pick a new name.");
			return;
		}

		const formDataArray = $("#recipeForm").serializeArray();

		let formData = {};
		$(formDataArray).each(function (index, obj) {
			formData[obj.name] = obj.value;
		});

		formData = this.Ingredients.arrayConcatenation(formData);
		formData = this.Directions.arrayConcatenation(formData);
		
		const recipe = new Recipe(formData);

		if(formType == this.TypeEnum.edit) {
			const oldRecipe = ((name) => {
				const recipes = RecipeList.get();
				for(const r of recipes)
					if(r.name === recipe.name) return r;
			})();
			
			recipe.imageLink = oldRecipe.imageLink;
			recipe.dateCreated = oldRecipe.dateCreated;
			recipe.dateModified = new Date();
			
			RecipeList.replace(oldRecipe, recipe);
		} else {
			RecipeList.add(recipe);
		}
		
		try {
			const file = $("#recipeFormImage").get(0).files[0];
			if (file) recipe.getImgurLink(file);
		} catch(error) {
			console.error(error);
		}


		$("#recipeFormModal").modal("hide");
	}
}