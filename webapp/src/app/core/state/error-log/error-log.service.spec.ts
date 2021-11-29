import { TestBed } from "@angular/core/testing";

import { ErrorLogService } from "./error-log.service";
import { ErrorLogStore } from "./error-log.store";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("ErrorLogService", () => {
	let logService: ErrorLogService;
	let logStore: ErrorLogStore;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ErrorLogService, ErrorLogStore],
			imports: [HttpClientTestingModule],
		});
		logService = TestBed.inject(ErrorLogService);
		logStore = TestBed.inject(ErrorLogStore);
	});

	it("should be created", () => {
		expect(logService).toBeTruthy();
	});
});
