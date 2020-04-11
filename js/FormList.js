/** 
  * Class representing a form object that can contain multiple text-field inputs.
  * @prop {String} id					- The id of the html DOM element.
  * @prop {String} name					- The name of the form list. A singular noun should be used.
  * @prop {String} placeholder			- The placeholder text for each html input field.
  * @prop {String} defaultInputCount	- The amount of input fields displayed when initialized. 
  * @prop {String} plural				- The plural name of the form list.
  */
class FormList {
	/** Creates a form list. */
	constructor(id, name, placeholder, defaultInputCount = 3, plural = name + "s") {
		this.id = id;
		this.name = name;
		this.placeholder = placeholder;
		this.defaultInputCount = defaultInputCount;
		this.plural = plural;
	}
	
	/** 
	 * Resets the text-field inputs. 
	 * @param {Number} amount	- An amount of inputs to use.
	 */
	reset(amount = this.defaultInputCount) {
		$(this.id).empty();
		for(let i = 0; i < amount; i++) this.addInput();
		this.updateInputs();
	}
	
	/** Adds a new text-field input. */
	addInput() {
		$(document.createElement("input"))
			.attr({
				type: "text",
				placeholder: this.placeholder
			})
			.addClass(`form-control my-3 ${this.name}`)
			.appendTo(this.id);
		this.updateInputs();
	}
	
	/** Removes the last text-field input. */
	removeInput() {
		// Continue if there is greater than 1 input field, otherwise exit function.
		if($(this.id).children().length > 1); else return;
		
		// Remove last inpur field.
		$(this.id).children().last().remove();
	}
	
	/** Updates all inputs' name attribute such that form serialization suceeds. */
	updateInputs() {
		// Get form list's name because "this" is redefined inside $.each() function.
		const name = this.name;
		$(this.id).children().each(function(index) {
			// Set each inputs' name attribute to the form list's name followed by the input's index.
			// This will allow simple location of input's index by removing the form list's name when parsing the name attribute.
			$(this).prop("name", name + index);
		});
	}
	
	/**
	 * Takes a dictionary of input values and concatenates this into an array of values. 
	 * @param {Object} data		- A dictionary containing key value pairs of input values.
	 * @return {Object} 		- The sorted and concatenated dictionary.
	 */
	arrayConcatenation(data) {
		let array = [];
		for (const [key, value] of Object.entries(data)) {
			// Continue next iteration if key is not apart of this form list.
			if(key.includes(this.name)); else continue;
			
			// Remove name, leaving only the numeric index.
			const index = key.replace(this.name, "");
			
			// Add value to array at the correct position.
			array[index] = value;
		}
		
		// Filter data such that it doesn't includes keys from this form list.
		Object.keys(data)
			.filter(key => key.includes(this.name))
			.forEach(key => delete data[key]);
		
		// Remove empty items from the array.
		array = array.filter(Boolean);
		
		// Adds the new array of input value into the data
		data[this.plural] = array;
		
		return data;
	}
}