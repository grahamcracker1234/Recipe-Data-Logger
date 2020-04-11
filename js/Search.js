class Search {
	static get Priority() {
		return Object.freeze({
			name: 10,
			category: 5,
			description: 5,
			ingredients: 3,
			directions: 3
		});
	}
	
	static setup() {
		$("#searchForm").submit((event) => this.submit(event));
	}

	static submit(event) {
		event.preventDefault();

		const searchInput = $("#searchInput").val();
		this.getRelevance(searchInput);

		$("#searchForm").get(0).reset();

		RecipeSort.set(null, false);
	}

	static getRelevance(search) {
		const recipes = RecipeList.get();
		const expressions = search.toUpperCase().getAllWords();
		if(expressions.length === 0) return;
		
		let newRecipeList = []
		for(const recipe of recipes) {
			let relevance = 0;
			for(const string of expressions) {
				relevance += 
					recipe.name.toUpperCase().countInstances(string) 						* this.Priority.name +
					recipe.category.toUpperCase().countInstances(string) 					* this.Priority.category +
					recipe.description.toUpperCase().countInstances(string) 				* this.Priority.description +
					recipe.ingredients.toString().toUpperCase().countInstances(string) 		* this.Priority.ingredients +
					recipe.directions.toString().toUpperCase().countInstances(string) 		* this.Priority.directions;
			}
			recipe.relevance = relevance
			newRecipeList.push(recipe);
		}

		newRecipeList = newRecipeList.filter((recipe) => recipe.relevance !== 0);
		RecipeList.reload(newRecipeList);
	}
}