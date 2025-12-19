import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
	let token = localStorage.getItem("auth_token");
	if (token) {
		const cloned = req.clone({
			setHeaders: {
				authorization: "Bearer " + token,
			},
		});
		return next(cloned);
	} else {
		return next(req);
	}
};
