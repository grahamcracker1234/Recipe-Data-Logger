/** 
  * Class representing a recipe object that contains all information about a recipe.
  * @prop {Date} dateCreated			- The date of creation.
  * @prop {Date} dateModified			- The date of the last modification.
  * @prop {String} name					- The name of the recipe.
  * @prop {String} category				- The category of the recipe.
  * @prop {String[]} description		- The description of the recipe.
  * @prop {String[]} ingredients		- The list of ingredients for the recipe.
  * @prop {String[]} directions			- The list of directions for the recipe.
  * @prop {String} imageLink			- The link to the image of the recipe.
  */
class Recipe {
	/** Creates a recipe. */
	constructor({dateCreated = new Date(), dateModified = new Date(), name = null, category = null, description = null, ingredients = null, directions = null, imageLink = undefined}) {
		this.dateCreated = dateCreated;
		this.dateModified = dateModified;
		this.name = (String.isString(name)) ? name.toTitleCase() : name;
		this.category = (String.isString(category)) ? category.toTitleCase() : category;
		this.description = description;
		this.ingredients = ingredients;
		this.directions = directions;
		this.imageLink = imageLink;
	}
	
	/**
	 * Retrieves an Imgur link from the Imgur API
	 * @param {File} file	- Image file to be sent to Imgur API.
	 * @return {Boolean} 	- A Boolean which shows whether link retreival was successful or not.
	 */
	getImgurLink(file) {
		// Begin file upload
		console.log("Uploading file to Imgur...");

		const clientId = "c854ccedd1c74ec";

		const settings = {
			crossDomain: true,
			processData: false,
			contentType: false,
			type: "POST",
			url: "https://api.imgur.com/3/image",
			mimeType: "multipart/form-data",
			headers: {
				Authorization: `Client-ID ${clientId}`,
				Accept: "application/json"
			}
		};
		
		const formData = new FormData();
		formData.append("image", file);
		settings.data = formData;

		// Response contains stringified JSON
		$.ajax(settings).then((data) => {
			console.log("Received image link from Imgur...");

			const json = JSON.parse(data);
			const link = json.data.link;

			const recipes = RecipeList.get();
			for (const recipe of recipes) {
				if (recipe.name == this.name); else continue;
				recipe.imageLink = link;
				RecipeList.set(recipes);
				break;
			}

			RecipeList.reload();
		});
	}
	
	/** Creates a modal for recipe viewing and displays it to the user. */
	view() {
		// Resets display CSS
		$("#viewRecipeBody").children().css("display", "block");
		
		// Checks each DOM element to see if it should be displaed.
		if(this.name)
			$("#viewRecipeName").text(this.name);
		else
			$("#viewRecipeName").css("display", "none");

		if(this.imageLink) {
			$("#viewRecipeImage")
				.prop("src", this.imageLink)
				.prop("alt", this.title);
		} else 
			$("#viewRecipeImage").get(0).style.setProperty("display", "none", "important");

		if(this.category) 
			$("#viewRecipeCategory").text(this.category);
		else 
			$("#viewRecipeCategory").css("display", "none");


		if(this.description) 
			$("#viewRecipeDescription").text(this.description);
		else 
			$("#viewRecipeDescription").css("display", "none");

		if(this.ingredients && this.ingredients.length) {
			$("#viewRecipeIngredients").empty();
			for(const ingredient of this.ingredients) {
				$(document.createElement("li"))
					.addClass("list-group-item")
					.text(ingredient)
					.appendTo("#viewRecipeIngredients");
			}
		} else {
			$("#viewRecipeIngredients").css("display", "none");
			$("#viewRecipeIngredientsHeader").css("display", "none");
		}

		if(this.directions && this.directions.length) {
			$("#viewRecipeDirections").empty();
			for(const direction of this.directions) {
				$(document.createElement("li"))
					.addClass("list-group-item")
					.text(direction)
					.appendTo("#viewRecipeDirections");
			}
		} else {
			$("#viewRecipeDirections").css("display", "none");
			$("#viewRecipeDirectionsHeader").css("display", "none");
		}

		$("#viewRecipeModal").off("hidden.bs.modal");

		$("#viewRecipeEdit").click(() => {
			$("#viewRecipeModal").modal("hide");
			$("#viewRecipeModal").on("hidden.bs.modal", () => RecipeForm.edit(this));
		});

		$("#viewRecipeDelete").click(() => {
			$("#viewRecipeModal").modal("hide");
			$("#viewRecipeModal").on("hidden.bs.modal", () => RecipeList.remove(this));
		})

		$("#viewRecipeModal").modal("show");
	}
}