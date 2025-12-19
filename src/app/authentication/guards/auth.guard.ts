import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
	const router = inject(Router);
	const checkUserHasPermission = (route: ActivatedRouteSnapshot) => {
		let roles = route.data["roles"] as Array<string>;
		let userRoles = localStorage.getItem("auth_roles")?.split(",");
		if (!roles) {
			return true;
		} else {
			return getMatchingPermissionCount(roles, userRoles);
		}
	};

	const getMatchingPermissionCount = (permission: Array<string>, userPermission: Array<string> | null | undefined) => {
		if (!userPermission) return false;
		let intersection = permission.filter((element) => userPermission.includes(element));
		if (intersection.length > 0) {
			return true;
		} else {
			router.navigate(["error/unauthorized"]);
			return false;
		}
	};

	if (!!localStorage.getItem("auth_token")) {
		return checkUserHasPermission(route);
	} else {
		router.navigate(["error/unauthorized"]);
		return false;
	}
};
