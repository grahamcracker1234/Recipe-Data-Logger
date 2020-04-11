/** Static class encapsulating all methods for locally stored array of recipes. */
class RecipeList {
	/** @prop {String} Key	- The get-only key used to access the recipe list localstorage. */
	static get Key() { return "RecipeListKey"; }
	
	/** Exports the recipe list */
	static export() {
		window.prompt("Copy the text and be sure to save it somewhere safe!", JSON.stringify(this.get()));
	}
	
	/** Imports new recipes into the recipe list */
	static import() {
		const recipes = this.get();
		try {
			const data = window.prompt("Paste the saved text here!");
			const parsedData = JSON.parse(data);
			
			if(parsedData === null) return;
			if(Array.isArray(parsedData)); else throw new TypeError("Imported data is not an Array...");
			
			const duplicateRecipes = [];
			for(const data of parsedData)
				for(const recipe of recipes)
					if(data.name === recipe.name) duplicateRecipes.push(recipe);
			
			const filteredRecipes = recipes.removeAll(duplicateRecipes);
			const completeData = parsedData.concat(filteredRecipes);
			
			this.set(completeData);
		} catch (error) {
			console.error(`Error importing...\n${error}`);
			window.alert(`Error importing recipe data: ${error.constructor.name}`);
			this.set(recipes);
		}
		
	}
	
	/**
	 * Get the recipe list
	 * @return {Recipe[]}		- The recipe list.
	 */
	static get() {
		const string = localStorage.getItem(this.Key);
		const json = JSON.parse(string);
		return json || [];
	}
	
	/**
	 * Get the recipe list
	 * @prop {Recipe[]} list	- The list to replace the current recipe list.
	 */
	static set(list) {
		const string = JSON.stringify(list);
		localStorage.setItem(this.Key, string);
		this.reload();
	}
	
	/** Reset the recipe list */
	static reset() {
		localStorage.clear();
		this.reload();
	}
	
	/**
	 * Add recipe to recipe list
	 * @prop {Recipe} recipe	- The recipe to add to recipe list.
	 */
	static add(recipe) {
		const recipes = this.get();
		recipes.push(recipe);
	
		this.set(recipes);
	}
	
	/**
	 * Remove recipe from recipe list
	 * @prop {Recipe} recipe	- The recipe to remove from recipe list.
	 */
	static remove(recipe) {
		const recipes = this.get();
		const filteredRecipes = recipes.remove(recipe);
		this.set(filteredRecipes);
	}
	
	/**
	 * Replace recipe with another recipe
	 * @prop {Recipe} oldRecipe	- The recipe to remove from recipe list.
	 * @prop {Recipe} newRecipe	- The recipe to add to recipe list.
	 */
	static replace(oldRecipe, newRecipe) {
		this.remove(oldRecipe);
		this.add(newRecipe);
	}
	/**
	 * Get the recipe list
	 * @prop {String} name		- The recipe name who's availability is to be checked.
	 * @return {Boolean}		- Whether or the is available or not.
	 */
	static getAvailability(name) {
		if(name); else return false;
		const recipes = this.get();
		for (const recipe of recipes) {
			if (recipe.name == name) return false;
		}
		return true;
	}
	
	/** Reload the recipe list UI */
	static reload(recipeList) {
		$("#recipeContainer").empty();
		const recipes = (recipeList || this.get()).mergeSort(Sort.getDirection(), Sort.Type);

		for(const recipe of recipes) {
			const cogSpan = $("<span>")
				.attr("data-feather", "settings");
			const optionsButton = $("<button>")
				.addClass("btn btn-secondary col-auto ml-1")
				.attr("data-toggle", "dropdown")
				.append(cogSpan);
			const dropdownHeader = $("<h6>")
				.addClass("dropdown-header")
				.text("Options");
			const dropdownEditButton = $("<button>")
				.addClass("dropdown-item")
				.click(() => RecipeForm.edit(recipe))
				.text("Edit");
			const dropdownDeleteButton = $("<button>")
				.addClass("dropdown-item dropdown-danger-item")
				.click(() => RecipeList.remove(recipe))
				.text("Delete");
			const optionsDropdownMenuDiv = $("<div>")
				.addClass("dropdown-menu dropdown-menu-right")
				.append(dropdownHeader)
				.append(dropdownEditButton)
				.append(dropdownDeleteButton);
			const optionsDropdownDiv = $("<div>")
				.addClass("dropdown")
				.append(optionsButton)
				.append(optionsDropdownMenuDiv);
			const viewButton = $("<button>")
				.addClass("btn btn-primary col mr-1")
				.click(() => (new Recipe(recipe)).view())
				.text("View");
			const dayCountUpdated = (() => {
				const dateUpdated = new Date(recipe.dateModified);
				const today = new Date();
				return dateUpdated.differenceInDays(today);
			})();
			const updatedSmallText = (() => {
				if (dayCountUpdated <= -1)	return "Last updated in the future…";
				if (dayCountUpdated == 0) 	return "Last updated today…";
				if (dayCountUpdated == 1) 	return "Last updated yesterday…";
				if (dayCountUpdated <= 6) 	return `Last updated ${dayCountUpdated} days ago…`;
				if (dayCountUpdated <= 13)  return "Last updated 1 week ago…";
				if (dayCountUpdated <= 30)  return `Last updated ${Math.floor(dayCountUpdated / 7)} weeks ago…`;
				if (dayCountUpdated <= 60)  return "Last updated 1 month ago…";
				if (dayCountUpdated <= 364) return `Last updated ${Math.floor(dayCountUpdated / 30)} months ago…`;
				if (dayCountUpdated <= 729) return "Last updated 1 year ago…";
				if (dayCountUpdated >= 730) return `Last updated ${Math.floor(dayCountUpdated / 365)} years ago…`;
				return "";
			})();
			const updatedSmall = $("<small>")
				.text(updatedSmallText);
			const updatedParagraph = $("<p>")
				.addClass("card-text text-muted")
				.append(updatedSmall);
			const dayCountCreated = (() => {
				const dateCreated = new Date(recipe.dateCreated);
				const today = new Date();
				return dateCreated.differenceInDays(today);
			})();
			const createdSmallText = (() => {
				if (dayCountCreated <= -1)	return "Created in the future…";
				if (dayCountCreated == 0) 	return "Created today…";
				if (dayCountCreated == 1) 	return "Created yesterday…";
				if (dayCountCreated <= 6) 	return `Created ${dayCountCreated} days ago…`;
				if (dayCountCreated <= 13)  return "Created 1 week ago…";
				if (dayCountCreated <= 30)  return `Created ${Math.floor(dayCountCreated / 7)} weeks ago…`;
				if (dayCountCreated <= 60)  return "Created 1 month ago…";
				if (dayCountCreated <= 364) return `Created ${Math.floor(dayCountCreated / 30)} months ago…`;
				if (dayCountCreated <= 729) return "Created 1 year ago…";
				if (dayCountCreated >= 730) return `Created ${Math.floor(dayCountCreated / 365)} years ago…`;
				return "";
			})();
			const createdSmall = $("<small>")
				.text(createdSmallText);
			const createdParagraph = $("<p>")
				.addClass("card-text text-muted m-0")
				.append(createdSmall);
			const descriptionParagraph = $("<p>")
				.addClass("card-text")
				.text(recipe.description);
			const categoryHeader = $("<h6>")
				.addClass("card-subtitle mb-2 text-muted")
				.text(recipe.category);
			const recipeNameHeader = $("<h4>")
				.addClass("card-title")
				.text(recipe.name);
			const cardBodyDiv = $("<div>")
				.addClass("card-body")
				.append(recipeNameHeader)
				.append(categoryHeader)
				.append(descriptionParagraph)
				.append(createdParagraph)
				.append(updatedParagraph);
			const cardFooterDiv = $("<div>")
				.addClass("card-footer row mx-0 p-2")
				.append(viewButton)
				.append(optionsDropdownDiv);
			const recipeImage = $("<img>")
				.addClass("card-img-top")
				.prop("src", recipe.imageLink);
			const recipeCard = $("<div>")
				.addClass("card col-12 p-0")
				.append(recipeImage)
				.append(cardBodyDiv)
				.append(cardFooterDiv);
			const recipeCardSpacing = $("<div>")
				.addClass("col-md-6 col-lg-4 col-xl-3 p-1")
				.append(recipeCard);
			$("#recipeContainer").append(recipeCardSpacing);
		}
		
		feather.replace();
	}
}