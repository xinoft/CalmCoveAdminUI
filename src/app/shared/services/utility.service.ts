import { Injectable } from "@angular/core";
import { ToastMessage } from "../models/ToastMessage";

declare function showLoader(status: boolean): any;
declare function showBootstrapModal(status: boolean, modalId: string): any;
declare function showToastMessage(type: number, message: string, title?: string): any;
declare function toggleDropDownNavigation(id: string, manual: boolean): any;
declare function handleSideNavMouseOver(): any;
declare function handleSideNavMouseOut(): any;
declare function expandSideNavMenu(): any;
declare function collapseSideNavMenu(): any;

@Injectable({
	providedIn: "root",
})
export class UtilityService {
	constructor() {}

	showLoader(status: boolean) {
		showLoader(status);
	}

	showToast(toastMessage: ToastMessage) {
		showToastMessage(toastMessage.Type, toastMessage.Message, toastMessage.Title);
	}

	showModal(status: boolean, modalId: string) {
		showBootstrapModal(status, modalId);
	}

	toggleDropDownMenuNavigation(id: string, manual: boolean) {
		toggleDropDownNavigation(id, manual);
	}

	sideNavMouseOver(): void {
		handleSideNavMouseOver();
	}

	sideNavMouseOut(): void {
		handleSideNavMouseOut();
	}

	expandSideNav() {
		expandSideNavMenu();
	}

	collapseSideNav() {
		collapseSideNavMenu();
	}
}
