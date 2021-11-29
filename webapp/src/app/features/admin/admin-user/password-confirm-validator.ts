import { ErrorStateMatcher } from "@angular/material/core";
import { AbstractControl, FormControl, FormGroupDirective, NgForm } from "@angular/forms";

/**
 * Custom ErrorStateMatcher which returns true (error exists)
 * when the parent form group is invalid and passwordConfirmMatch returns true
 * used for <mat-error> to display proper error on invalid input
 */
export class PasswordConfirmationMatcher implements ErrorStateMatcher {

	constructor(
		private passwordField: string,
		private passwordConfirmField: string,
	) {
	}

	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isTouchedOrSubmitted = !!((form && form.submitted) || (control && control.touched));
		const invalidControl = !!(control && control.invalid);
		const invalidPasswordConfirm = !!(control && control.parent && control.parent.invalid
			&& !passwordConfirmMatch(control.parent, this.passwordField, this.passwordConfirmField));

		return (isTouchedOrSubmitted && (invalidControl || invalidPasswordConfirm));
	}
}

export const passwordConfirmMatch = (control: AbstractControl, passwordField: string, passwordConfirmField: string) => {
	const password = control.get(passwordField);
	const passwordConfirm = control.get(passwordConfirmField);
	return password && passwordConfirm && password.value === passwordConfirm.value;
};
