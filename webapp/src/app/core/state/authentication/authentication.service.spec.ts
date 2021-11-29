import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { AuthenticationService } from "./authentication.service";
import { AuthenticationStore } from "./authentication.store";

describe("AuthenticationService", () => {
	let authenticationService: AuthenticationService;
	let authenticationStore: AuthenticationStore;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [AuthenticationService, AuthenticationStore],
			imports: [HttpClientTestingModule],
		});

		authenticationService = TestBed.inject(AuthenticationService);
		authenticationStore = TestBed.inject(AuthenticationStore);
	});

	it("should be created", () => {
		expect(authenticationService).toBeDefined();
	});

});
