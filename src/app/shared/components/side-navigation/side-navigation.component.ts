import { AfterViewInit, Component, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterEvent, RouterModule } from "@angular/router";
import { UtilityService } from "../../services/utility.service";

@Component({
	selector: "app-side-navigation",
	standalone: true,
	imports: [RouterModule],
	templateUrl: "./side-navigation.component.html",
	styleUrl: "./side-navigation.component.css",
})
export class SideNavigationComponent implements AfterViewInit {
	currentUrl = "";
	haveSubMenuFlag = false;
	currentLinkParentMenuId = "";
	menuItems: MenuItem[] = [
		{
			Container: "Alpha",
			Links: [
				{
					Name: "Dashboard",
					Route: "/dashboard/overview",
					Icon: "tf-icons ti ti-smart-home",
					Id: "dashboard-menu",
					HaveSubMenu: false,
					Links: [],
				},
				{
					Name: "Bookings",
					Route: "/booking/booking-list",
					Icon: "tf-icons ti ti-article",
					Id: "booking-menu",
					HaveSubMenu: false,
					Links: [],
				},
				{
					Name: "Massage",
					Route: "/massage/massage-list",
					Icon: "tf-icons ti ti-massage",
					Id: "massage-menu",
					HaveSubMenu: false,
					Links: [],
				},
				{
					Name: "Promotion",
					Route: "/promotion/promotion-list",
					Icon: "tf-icons ti ti-gift-card",
					Id: "promotion-menu",
					HaveSubMenu: false,
					Links: [],
				},
				{
					Name: "Customer",
					Route: "/customer/customer-list",
					Icon: "tf-icons ti ti-user",
					Id: "customer-menu",
					HaveSubMenu: false,
					Links: [],
				},
			],
		},
		{
			Container: "User & Access",
			Links: [
				// {
				// 	Name: "User Groups",
				// 	Route: "/user-group/group-list",
				// 	Icon: "tf-icons ti ti-users-group",
				// 	Id: "user-group-menu",
				// 	HaveSubMenu: false,
				// 	Links: [],
				// },
				{
					Name: "User Accounts",
					Route: "/user-account/user-list",
					Icon: "tf-icons ti ti-user",
					Id: "user-group-menu",
					HaveSubMenu: false,
					Links: [],
				},
				// {
				// 	Name: "User Groups-2",
				// 	Route: "/user-group/listtj",
				// 	Icon: "tf-icons ti ti-users-group",
				// 	Id: "user-group-menu-2",
				// 	HaveSubMenu: true,
				// 	Links: [
				// 		{
				// 			Name: "User Groups Remove",
				// 			Route: "/user-group/remove",
				// 			Icon: "tf-icons ti ti-users-group",
				// 			Id: "user-remove-sub-menu-m",
				// 			HaveSubMenu: false,
				// 			Links: [],
				// 		},
				// 	],
				// },
			],
		}
	];

	constructor(private _utilityService: UtilityService, private _router: Router) {
		this.setToggleOptionSubMenu();
	}

	ngAfterViewInit(): void {
		this.toggleSubMenu();
	}

	setToggleOptionSubMenu() {
		this._router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.haveSubMenuFlag = false;
				this.currentLinkParentMenuId = "";
				this.findParentMenuId(this.menuItems, event.url);
				this._utilityService.toggleDropDownMenuNavigation(this.currentLinkParentMenuId, true);
			}
		});
	}

	toggleSubMenu() {
		if (this.haveSubMenuFlag) {
			this._utilityService.toggleDropDownMenuNavigation(this.currentLinkParentMenuId, true);
		}
	}

	toggleDropDownNavigation(id: string) {
		this._utilityService.toggleDropDownMenuNavigation(id, false);
	}

	handleSideNavMouseOver(event: MouseEvent): void {
		event.stopPropagation();
		this._utilityService.sideNavMouseOver();
	}

	handleSideNavMouseOut(event: MouseEvent): void {
		event.stopPropagation();
		this._utilityService.sideNavMouseOut();
	}

	closeSideNavMenu() {
		this._utilityService.collapseSideNav();
	}

	findParentMenuId(menuItems: any[], route: string) {
		for (const container of menuItems) {
			if (this.checkIfLink(container.Links, route)) {
				break;
			}
		}
	}

	checkIfLink(Links: any, route: string): boolean {
		let linkMatch = false;
		for (const link of Links) {
			if (link.Route == route) {
				linkMatch = true;
			} else {
				if (link.HaveSubMenu) {
					this.currentLinkParentMenuId = link.Id;
					this.haveSubMenuFlag = link.HaveSubMenu;
					linkMatch = this.checkIfLink(link.Links, route);
					if (linkMatch == true) return true;
				}
			}
		}
		return linkMatch;
	}
}

interface Link {
	Name: string;
	Route: string;
	Icon: string;
	Id: string;
	HaveSubMenu: boolean;
	Links: Link[];
}

interface MenuItem {
	Container: string;
	Links: Link[];
}
