import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class ErrorNotificationService {

	constructor(private snackBar: MatSnackBar) {
	}

	open(errorResponse: any,
		 duration: number = 5000,
		 horizontalPosition: MatSnackBarHorizontalPosition = "center",
		 verticalPosition: MatSnackBarVerticalPosition = "top") {

		const error = errorResponse.error || null;

		const message = errorResponse instanceof HttpErrorResponse && error != null
			? error.status + " " + error.error + ": " + error.message
			: errorResponse.message ? errorResponse.message : errorResponse;

		this.snackBar.open(message, "Close", {
			duration: duration,
			horizontalPosition: horizontalPosition,
			verticalPosition: verticalPosition,
			// panelClass: ["mat-toolbar", "mat-warn"],
		});
	}

}
