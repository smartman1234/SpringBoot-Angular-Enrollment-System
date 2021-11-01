import { Component, OnInit } from "@angular/core";
import { EnrollmentStatus } from "../../constant/enrollment-status";
import { Enrollment } from "../../models/enrollment.model";

@Component({
	selector: "app-shopping-cart",
	templateUrl: "./shopping-cart.component.html",
	styleUrls: ["./shopping-cart.component.scss"],
})
export class ShoppingCartComponent implements OnInit {

	title = "Shopping Cart";
	subtitle = "Cart for Enrollment";
	enrollmentStatuses = [EnrollmentStatus.IN_CART];

	constructor() {
	}

	ngOnInit(): void {
	}

	asEnrollment(value: any): Enrollment {
		return value as Enrollment;
	}
}
