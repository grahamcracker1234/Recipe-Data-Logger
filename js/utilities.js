"use strict";

Object.defineProperty(String, "isString", {
	value: function(obj) {
		return (Object.prototype.toString.call(obj) === "[object String]");
	}
});

Object.defineProperty(Date.prototype, "differenceInDays", {
	value: function(date) {
		const millisecondsPerDay = 1000 * 60 * 60 * 24;

		// Discard the time and time-zone information.
		const utc1 = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getMilliseconds());
		const utc2 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getMilliseconds());
		
		return Math.floor((utc2 - utc1) / millisecondsPerDay);
	}
});

Object.defineProperties(String.prototype, {
	getAllWords: {
		value: function() {
			return this.match(/[\w\d\’\'-]+/g);
		}
	},
	
	countInstances: {
		value: function(subString) {
			return this.split(subString).length - 1;
		}
	},
	
	toTitleCase: {
		value: function() {
			return this.replace(/[A-Za-zÀ-ú\']+/g,
				(txt) => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
			);
		}
	}
});

Object.defineProperties(Array.prototype, {
	remove: {
		value: function(value) {
			return this.filter((element) => JSON.stringify(element) !== JSON.stringify(value));
		}
	},
	
	removeAll: {
		value: function(array) {
			let newArray = this;
			
			for(const element of array) {
				newArray = newArray.remove(element);
			}
			
			return newArray;
		}
	},
	
	mergeSort: {
		value: function(isAscending, key) {
			if (this.length <= 1) return this;

			const mid = Math.floor(this.length / 2);

			const left = this.slice(0, mid);
			const right = this.slice(mid);

			return merge(left.mergeSort(isAscending, key), right.mergeSort(isAscending, key));

			function merge(left, right) {
				let array = [];
				let li = 0; // Left Index
				let ri = 0; // Right Index

				while (li < left.length && ri < right.length) {

					const comparison = (() => {
						try {
							if (isAscending) {
								if (key) return (left[li][key] < right[ri][key]);
								else return (left[li] < right[ri]);
							} else {
								if (key) return (left[li][key] > right[ri][key]);
								else return (left[li] > right[ri]);
							}
						} catch (error) {
							console.error("Invalid 'key'");
							console.error(error);
						}
					})();

					if (comparison) {
						array.push(left[li]);
						li++;
					} else {
						array.push(right[ri]);
						ri++;
					}
				}

				return array
					.concat(left.slice(li))
					.concat(right.slice(ri));
			}
		}
	}
});