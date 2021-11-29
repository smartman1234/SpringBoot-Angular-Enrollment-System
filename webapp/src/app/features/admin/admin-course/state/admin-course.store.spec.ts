import { AdminCourseStore } from "./admin-course.store";

describe("AdminCourseStore", () => {
	let store: AdminCourseStore;

	beforeEach(() => {
		store = new AdminCourseStore();
	});

	it("should create an instance", () => {
		expect(store).toBeTruthy();
	});

});
