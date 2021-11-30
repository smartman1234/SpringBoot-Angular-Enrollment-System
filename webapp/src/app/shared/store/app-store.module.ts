import { NgModule } from "@angular/core";
import { environment } from "../../../environments/environment";
import { AkitaNgDevtools } from "@datorama/akita-ngdevtools";
import { persistState } from "@datorama/akita";

const storage = persistState({
	key: "akitaAuth",
	include: ["authentication"],
});

export const akitaProviders = [{ provide: 'persistStorage', useValue: storage }];

@NgModule({
	declarations: [],
	imports: [
		environment.production ? [] : AkitaNgDevtools.forRoot(),
	],
	providers: [],
})
export class AppStoreModule {
}
