import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';

import { Footer } from '../footer/footer';
import { AuthService } from '../../services/auth-service/auth-service';
import { ADMIN_MENU } from '../../CONSTANT/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, Footer],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  menu = signal<any[]>(ADMIN_MENU);
  currentBasePath = signal('');
  isMobile = false;
  isMobileMenuOpen = false;
  isDropdownOpen = false;

  private router = inject(Router);
  private authService = inject(AuthService);

  // ✅ User getter — template में use करने के लिए
  get user() {
    return this.authService.getUser();
  }

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const segments = this.router.url.split('/');
        this.currentBasePath.set('/' + (segments[1] || ''));
        this.updateActiveMenu(this.router.url);
      });
  }

  updateActiveMenu(currentPath: string) {
    this.menu.set(
      this.menu().map((menu: any) => {
        const isMainActive = menu.path === currentPath;

        const subNav = menu.subNav?.map((sub: any) => {
          const isSubActive = sub.path === currentPath;
          return { ...sub, isActive: isSubActive };
        });

        const isAnySubActive = subNav?.some((s: any) => s.isActive);

        return {
          ...menu,
          isActive: isMainActive || isAnySubActive,
          subNav,
        };
      })
    );
  }

  onMenuItemClick(menuItem: any, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.onSubmenuShow(menuItem);

    if (this.isMobile) {
      this.isMobileMenuOpen = false;
    }
  }

  onSubmenuShow(item: any): void {
    this.isDropdownOpen = false;
    this.updateActiveMenu(item?.path);

    if (item.path) {
      this.router.navigate([item.path]);
    }
  }

  toggleDropdown(state: boolean) {
    this.isDropdownOpen = state;
  }

  // ✅ Logout — AuthService handle करेगा
  logout() {
    this.authService.logout();
  }
}