import { persistState } from "@datorama/akita";

const storage = persistState({
	key: "akitaAuth",
	include: ["authentication"],
});

export const akitaProviders = [{ provide: 'persistStorage', useValue: storage }];
