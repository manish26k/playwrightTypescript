import { expect,Page, Locator } from '@playwright/test';

export class HomeCarePortalPage {
    private page: Page;
    private userName : (name: string) => Locator;
    private clickSignOut: Locator;
    private clickDropDown: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.userName =(name) => this.page.locator(`[aria-label="${name}"]`);
        this.clickSignOut = this.page.locator('a[aria-label="Sign out"]');
        this.clickDropDown = this.page.locator('a[title="Manish Kumar Gupta"]');
    }

    /**
     * 
     * @param {string} buttonName
     */
    async verifyHomeScreenButtonIsVisible(buttonName: string) {
        await expect(this.page.getByRole('link', { name: buttonName })).toBeVisible();
    }
    async verifyUserNameShowsOnHeader(username: string) {
        await expect(this.userName(username)).toContainText(username);
    }
    async clickOnHomeScreenButton(buttonName: string) {
        await this.page.getByRole('link', { name: buttonName }).click();
    }


    async dropDownClick(){
        await this.clickDropDown.click();

    }

    async portalLogout(){
        await this.clickSignOut.click();
        await this.page.waitForURL('https://hah-ce-prbportal.powerappsportals.com/');
    }
};