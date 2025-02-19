import { expect } from '@playwright/test';
import { test } from '../fixtures/testFixtures';
import { MailSlurpHelper } from '../pages/mailSlurp';
import { testConfig } from '../testConfig';
import { ConfigHelper } from '../utils/configHelper';


test.describe("Portal Login Features Functionality", () => {
    
    test("Portal Login Functionality- Using verification Code" , async ({ loginPage, homePage }) =>{
        await homePage.navigateToURL();
        await homePage.clickSignInButton();
        const mailSlurp = new MailSlurpHelper(testConfig.apiKEY);
        const { inboxId, username, password } = ConfigHelper.getCredentials();
        await loginPage.enterLoginEmail(username);
        await loginPage.enterLoginPassword(password);
        await loginPage.clickLoginButton();
        await loginPage.clickSendVerificationCodeButton();
        const verificationCode = await mailSlurp.extractVerificationCode03(inboxId);
        console.log("Sciensus new verificationCode is" +"------>"+ verificationCode);
        if(verificationCode){
        await loginPage.enterVerificationCode(verificationCode);
        }else{
            throw new Error('Verification code not found');
        }    
     
        await loginPage.clickVerifyCodeButton();  
        await loginPage.clickContinueButton();   
        

    })


})