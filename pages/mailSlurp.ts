import { MailSlurp, MatchOptionFieldEnum, MatchOptionShouldEnum } from 'mailslurp-client';
import { ConfigHelper } from '../utils/configHelper';




interface EmailContent {
  username: string;
  password: string;
}

interface VerificationCode {
  code: string;
}

export class MailSlurpHelper {
  private mailslurp: MailSlurp;
  private apiKey: string;
  

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.mailslurp = new MailSlurp({apiKey});
  }
  
  /******************************createNewInbox***************************************/
  async createNewInbox(): Promise<{ id: string, emailAddress: string }> {
    const inbox = await this.mailslurp.createInbox();
    return { id: inbox.id, emailAddress: inbox.emailAddress };
  }
  
  /******************************extractUsernameAndPassword****************************/
  async extractUsernameAndPassword(inboxId: string): Promise<EmailContent> {
    const email = await this.retry(async () =>{
      const emails = await this.mailslurp.getEmails(inboxId);
      const emailPreview = emails[0];
      //const email = await this.mailslurp.getEmail(emailPreview.id);
      return this.mailslurp.getEmail(emailPreview.id);
    });    

    if (email.body) {
      const usernameMatch = email.body.match(/Username:\s([^\s]+)/);
      const passwordMatch = email.body.match(/Password:\s([^\s]+)/);

      const username = cleanHtmlTags(usernameMatch ? usernameMatch[1] : '');
      const password = cleanHtmlTags(passwordMatch ? passwordMatch[1] : '');

      ConfigHelper.saveCredentials({ inboxId, username, password });

      return { username, password };
    } else {
      return { username: '', password: '' };
    }
  } 
  
  /************************extractVerificationCode**************************************/ 
  async extractVerificationCode(inboxId: string): Promise<string | null> {
    const email = await this.retry(async () => {
      const emails = await this.mailslurp.waitController.waitForMatchingEmails({
        inboxId: inboxId,
        count: 1,
        matchOptions: {
          matches: [{ field: MatchOptionFieldEnum.SUBJECT, should: MatchOptionShouldEnum.CONTAIN, value: "Sciensus account email verification code" }]
        }
      });
      
      
  
      const emailPreview = emails[0];
      return this.mailslurp.getEmail(emailPreview.id);
    });

    if (email.body) {
      const codeMatch = cleanHtmlTags(email.body).match(/Your code is:\s(\d+)/);
      return codeMatch ? codeMatch[1] : null;
    } else {
      return null;
    }
  }


  /************************extractVerificationCode01**************************************/ 

  async extractVerificationCode01(inboxId: string): Promise<string | null> {
      const emails = await this.mailslurp.waitController.waitForMatchingEmails({
       
        inboxId: inboxId,
        count: 1,
        matchOptions: {
          matches: [{ field: MatchOptionFieldEnum.SUBJECT, should: MatchOptionShouldEnum.CONTAIN, value: "Sciensus account email verification code" }]
        }
      });

      if (emails.length === 0) {
        return null;
      }
      
      const emailPreview = emails[0];
      const email = await this.mailslurp.getEmail(emailPreview.id);
   

    if (email.body) {
      const codeMatch = cleanHtmlTags(email.body).match(/Your code is:\s(\d+)/);
      return codeMatch ? codeMatch[1] : null;
    } else {
      return null;
    }
  }

  /************************extractVerificationCode02**************************************/ 

  async extractVerificationCode02(inboxId: string): Promise<string | null> {
    const email = await this.mailslurp.waitController.waitForLatestEmail({
      inboxId: inboxId,
      timeout: 60000,  // 60 seconds timeout
      unreadOnly: true
    });

    if (!email || !email?.subject || !email?.subject.includes("Sciensus account email verification code")) {
      return null;
    }

    if (email?.body) {
      const codeMatch = cleanHtmlTags(email.body).match(/Your code is:\s(\d+)/);
      return codeMatch ? codeMatch[1] : null;
    } else {
      return null;
    }
  }


  /************************extractVerificationCode03**************************************/
  async extractVerificationCode03(inboxId: string): Promise<string | null> {
    const emails = await this.mailslurp.waitController.waitForMatchingEmails({
      inboxId: inboxId,
      count: 1,
      timeout: 60000,  // 60 seconds timeout
      unreadOnly: true,
      matchOptions: {
        matches: [{ field: MatchOptionFieldEnum.SUBJECT, should: MatchOptionShouldEnum.CONTAIN, value: 'Sciensus account email verification code' }]
      }
    });

    if (emails.length === 0) {
      return null;
    }

    for (const emailPreview of emails) {
      const email = await this.mailslurp.emailController.getEmail({emailId: emailPreview.id});
      if (email.subject && email.subject.includes('Sciensus account email verification code') && email.body) {
        const codeMatch = cleanHtmlTags(email.body).match(/Your code is:\s(\d+)/);
        return codeMatch ? codeMatch[1] : null;
      }
    }
    return null;
  }



  











  
  /***************************retry********************************************/ 
  private async retry<T>(fn: () => Promise<T>, retries: number = 3): Promise<T> {
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        await this.delay(1000); // Wait 1 second before retrying
      }
    }
    throw lastError;
  }
  /******************************delay****************************************/ 

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


} 

/*****************************cleanHtmlTags*************************************/ 

function cleanHtmlTags(input: string): string {
  return input.replace(/<br>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
}






