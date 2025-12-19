import { Component, OnDestroy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthenticationModule } from "./authentication/authentication.module";
import { MainLayoutComponent } from "./shared/components/main-layout/main-layout.component";
import { AuthenticationService } from "./authentication/services/authentication.service";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, AuthenticationModule, MainLayoutComponent, CommonModule],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
})
export class AppComponent implements OnDestroy {
	title = "InkersCoreUI";
	enableMainComponent = false;
	authSubscription!: Subscription;

	constructor(private _authService: AuthenticationService) {
		this.initializeMainComponent();
	}

	initializeMainComponent() {
		this._authService.isLoggedIn();
		this.authSubscription = this._authService.checkLoggedIn.subscribe((isLoggedIn) => {
			this.enableMainComponent = isLoggedIn;
		});
	}

	ngOnDestroy() {
		this.authSubscription.unsubscribe();
	}
}
