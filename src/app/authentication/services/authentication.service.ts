import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LoginResponse } from "../models/LoginResponse";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class AuthenticationService {
	private loggedIn = new BehaviorSubject<boolean>(false);

	constructor(private _http: HttpClient) {}

	logout(): Observable<any> {
		return this._http.post(`${environment.baseUrl}Auth/Logout`, null);
	}

	login(username: string, password: string): Observable<LoginResponse> {
		let formData = new FormData();
		formData.append("username", username);
		formData.append("password", password);
		return this._http.post<LoginResponse>(`${environment.baseUrl}Auth/Login`, formData);
	}

	removeAuthData() {
		localStorage.removeItem("auth_token");
		localStorage.removeItem("auth_roles");
		localStorage.removeItem("user_name");
		this.loggedIn.next(false);
	}

	addAuthData(loginResponse: LoginResponse) {
		localStorage.setItem("auth_token", loginResponse.Token);
		localStorage.setItem("auth_roles", loginResponse.RoleList.toString());
		localStorage.setItem("user_name", loginResponse.Name);
		this.loggedIn.next(true);
	}

	isLoggedIn() {
		const token = localStorage.getItem("auth_token");
		if (token == undefined || token == "") {
			this.loggedIn.next(false);
			return false;
		} else {
			this.loggedIn.next(true);
			return true;
		}
	}

	get checkLoggedIn() {
		return this.loggedIn.asObservable();
	}
}
