import { TestBed } from "@angular/core/testing";

import { LoadingService } from "./loading.service";
import { LoadingStore } from "./loading.store";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("LoadingService", () => {
	let loadingService: LoadingService;
	let loadingStore: LoadingStore;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [LoadingService, LoadingStore],
			imports: [HttpClientTestingModule],
		});

		loadingService = TestBed.inject(LoadingService);
		loadingStore = TestBed.inject(LoadingStore);
	});

	it("should be created", () => {
		expect(loadingService).toBeTruthy();
	});
});
