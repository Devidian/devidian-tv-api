export class ItemNotFoundException extends Error {
	constructor(message?: string) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = ItemNotFoundException.name;
	}
}
