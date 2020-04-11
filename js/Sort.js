class Sort {
	
	static get TypeEnum() { 
		return Object.freeze({
			name: "name",
			dateCreated: "dateCreated",
			dateModified: "dateModified"
		});
	}
	
	static get Ascension() {
		return Object.freeze({
			name: true,
			dateCreated: false,
			dateModified: false
		});
	}
	
	static get Reverse() {
		return ($("#sort-direction-input").val() === "true");
	}
	
	static set Reverse(value) {
		$("#sort-direction-input").val(value);
		this.updateDirection();
	}
	
	static get Type() {
		return $("#sort-type-input").val();
	}
	
	static set Type(value) {
		$("#sort-type-input").val(value);
	}
	
	static setup() {
		$(".sort-input").each((index, value) => {
			const data = $(value).data("sort");
			$(value)
				.click(() => this.set(data))
				.change(() => this.set(data));
		});

		$("#sort-direction").click(() => {
			this.Reverse = !this.Reverse;
			
			RecipeList.reload();
		})
		
		this.set(this.TypeEnum.name);
	}
	
	static set(sortType, willReload = true) {
		this.Type = sortType;
		this.Reverse = false;
		$(".sort-input").each(function() {
			$(this).prop("checked", false).parent().removeClass("active focus");
			if($(this).data("sort") === sortType) $(this).prop("checked", true).parent().addClass("active");
		});
		if(willReload) RecipeList.reload();
	}
	
	static updateDirection() {
		if(this.Reverse) $("#sort-direction").css("transform", "rotate(0.5turn)");
		else $("#sort-direction").css("transform", "")
	}
	
	static getDirection() {
		return (this.Reverse) ? !this.Ascension[this.Type] : this.Ascension[this.Type];
	}
}