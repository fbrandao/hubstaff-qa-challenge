import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../base/baseComponent';

export class SideBarNav extends BaseComponent {
  protected readonly rootSelector = 'nav[role="navigation"]';

  constructor(page: Page) {
    super(page);
  }

  // Main menu items
  readonly favoritesMenu = this.page.locator('[data-menu-id="favorites"]');
  readonly dashboardMenu = this.page.locator('[data-menu-id="dashboard"]');
  readonly timeEntriesMenu = this.page.locator('[data-menu-id="time_entries"]');
  readonly activitiesMenu = this.page.locator('[data-menu-id="activities"]');
  readonly insightsMenu = this.page.locator('[data-menu-id="insights"]');
  readonly locationsMenu = this.page.locator('[data-menu-id="locations"]');
  readonly projectManagementMenu = this.page.locator('[data-menu-id="project_management"]');
  readonly attendanceMenu = this.page.locator('[data-menu-id="attendance"]');
  readonly reportsMenu = this.page.locator('[data-menu-id="reports"]');
  readonly peopleMenu = this.page.locator('[data-menu-id="people"]');
  readonly financialsMenu = this.page.locator('[data-menu-id="financials"]');
  readonly settingsMenu = this.page.locator('[data-menu-id="settings"]');

  // Submenu items
  readonly favoritesSubmenu = {
    performance: this.page.locator('[data-submenu-id="performance"]'),
    smartNotifications: this.page.locator('[data-submenu-id="smart_notifications"]'),
  };

  readonly timeEntriesSubmenu = {
    viewAndEdit: this.page.locator('[data-submenu-id="organization_time_entries"]'),
    approvals: this.page.locator('[data-submenu-id="organization_timesheets"]'),
  };

  readonly activitiesSubmenu = {
    screenshots: this.page.locator('[data-submenu-id="organization_activities"]'),
    apps: this.page.locator('[data-submenu-id="apps_detailed_organization_activities"]'),
    urls: this.page.locator('[data-submenu-id="urls_detailed_organization_activities"]'),
  };

  readonly insightsSubmenu = {
    highlights: this.page.locator('[data-submenu-id="highlights"]'),
    performance: this.page.locator('[data-submenu-id="performance"]'),
    unusualActivity: this.page.locator('[data-submenu-id="unusual-activity"]'),
    smartNotifications: this.page.locator('[data-submenu-id="smart_notifications"]'),
    output: this.page.locator('[data-submenu-id="output"]'),
  };

  readonly locationsSubmenu = {
    map: this.page.locator('[data-submenu-id="locations_organization_activities"]'),
    jobSites: this.page.locator('[data-submenu-id="organization_job_sites"]'),
  };

  readonly projectManagementSubmenu = {
    projects: this.page.locator('[data-submenu-id="projects"]'),
    todos: this.page.locator('[data-submenu-id="tasks"]'),
    clients: this.page.locator('[data-submenu-id="clients"]'),
  };

  readonly attendanceSubmenu = {
    schedules: this.page.locator('[data-submenu-id="calendar"]'),
    timeOffRequests: this.page.locator('[data-submenu-id="time_off"]'),
  };

  readonly reportsSubmenu = {
    timeAndActivity: this.page.locator('[data-submenu-id="report_custom_time_and_activities"]'),
    dailyTotals: this.page.locator('[data-submenu-id="report_daily"]'),
    amountsOwed: this.page.locator('[data-submenu-id="report_amounts_owed"]'),
    payments: this.page.locator('[data-submenu-id="report_payments"]'),
    allReports: this.page.locator('[data-submenu-id="organization_reports"]'),
  };

  readonly peopleSubmenu = {
    members: this.page.locator('[data-submenu-id="members"]'),
    teams: this.page.locator('[data-submenu-id="teams"]'),
  };

  readonly financialsSubmenu = {
    managePayroll: this.page.locator('[data-submenu-id="member_payment_accounts_organization"]'),
    createPayments: this.page.locator('[data-submenu-id="organization_team_payments"]'),
    pastPayments: this.page.locator('[data-submenu-id="past_organization_team_payments"]'),
    invoices: this.page.locator('[data-submenu-id="invoices"]'),
    expenses: this.page.locator('[data-submenu-id="expenses"]'),
  };

  readonly settingsSubmenu = {
    allSettings: this.page.locator('[data-submenu-id="settings_organization"]'),
    activityAndTracking: this.page.locator('[data-submenu-id="generic_settings_organization"]'),
    enterprise: this.page.locator('[data-submenu-id="device_provisioning_enterprise_settings"]'),
    integrations: this.page.locator('[data-submenu-id="integrations"]'),
    billing: this.page.locator('[data-submenu-id="billing_organization"]'),
  };

  // Methods to interact with menu items
  async clickMenu(menu: Locator) {
    await menu.click();
  }

  async clickSubmenu(submenu: Locator) {
    await submenu.click();
  }

  async toggleMenu(menuId: string) {
    const menu = this.page.locator(`[data-menu-id="${menuId}"]`);
    await menu.click();
  }

  async toggleSubmenu(menuId: string, submenuId: string) {
    await this.toggleMenu(menuId);
    const submenu = this.page.locator(`[data-submenu-id="${submenuId}"]`);
    await submenu.click();
  }

  async isMenuExpanded(menuId: string): Promise<boolean> {
    const menu = this.page.locator(`[data-menu-id="${menuId}"]`);
    return (await menu.getAttribute('aria-expanded')) === 'true';
  }

  async isSubmenuVisible(menuId: string): Promise<boolean> {
    const submenu = this.page.locator(`[data-menu-id="${menuId}"] ul[role="menu"]`);
    return await submenu.isVisible();
  }

  async getFavoriteCount(): Promise<number> {
    const counter = this.page.locator('.fav-counter');
    const text = await counter.textContent();
    return parseInt(text?.match(/\((\d+)\)/)?.[1] || '0');
  }

  async addToFavorites(menuId: string) {
    const addFavButton = this.page.locator(`[data-submenu-id="${menuId}"] .add-fav`);
    await addFavButton.click();
  }

  async removeFromFavorites(menuId: string) {
    const delFavButton = this.page.locator(`[data-submenu-id="${menuId}"] .del-fav`);
    await delFavButton.click();
  }

  public getReadinessChecks() {
    return [
      {
        type: 'assertion' as const,
        description: 'Sidebar navigation is visible',
        assertion: async () => {
          await this.page.waitForSelector(this.rootSelector);
        },
      },
    ];
  }
}
