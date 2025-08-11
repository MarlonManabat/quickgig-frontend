// Facebook SDK integration utility for QuickGig.ph
// Handles Facebook Login, Graph API calls, and SDK initialization

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export interface FacebookUser {
  id: string;
  name: string;
  email: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

export interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: string;
  signedRequest: string;
  userID: string;
}

export interface FacebookLoginResponse {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse?: FacebookAuthResponse;
}

export interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  full_picture?: string;
  permalink_url: string;
  reactions?: {
    summary: {
      total_count: number;
    };
  };
  comments?: {
    summary: {
      total_count: number;
    };
  };
}

class FacebookSDK {
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.loadSDK();
  }

  private loadSDK(): void {
    if (typeof window === 'undefined') return;

    // Load Facebook SDK
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Initialize SDK when loaded
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });

      this.isInitialized = true;
      
      // Resolve any pending initialization promises
      if (this.initPromise) {
        this.initPromise = null;
      }
    };
  }

  public async waitForInit(): Promise<void> {
    if (this.isInitialized) return;

    if (!this.initPromise) {
      this.initPromise = new Promise((resolve) => {
        const checkInit = () => {
          if (this.isInitialized) {
            resolve();
          } else {
            setTimeout(checkInit, 100);
          }
        };
        checkInit();
      });
    }

    return this.initPromise;
  }

  public async getLoginStatus(): Promise<FacebookLoginResponse> {
    await this.waitForInit();
    
    return new Promise((resolve) => {
      window.FB.getLoginStatus((response: FacebookLoginResponse) => {
        resolve(response);
      });
    });
  }

  public async login(permissions: string[] = ['public_profile', 'email']): Promise<FacebookLoginResponse> {
    await this.waitForInit();
    
    return new Promise((resolve) => {
      window.FB.login((response: FacebookLoginResponse) => {
        resolve(response);
      }, { scope: permissions.join(',') });
    });
  }

  public async logout(): Promise<void> {
    await this.waitForInit();
    
    return new Promise((resolve) => {
      window.FB.logout(() => {
        resolve();
      });
    });
  }

  public async getUserInfo(fields: string[] = ['id', 'name', 'email', 'picture']): Promise<FacebookUser> {
    await this.waitForInit();
    
    return new Promise((resolve, reject) => {
      window.FB.api('/me', { fields: fields.join(',') }, (response: FacebookUser) => {
        if (response && !response.error) {
          resolve(response);
        } else {
          reject(response.error || 'Failed to get user info');
        }
      });
    });
  }

  public async getPagePosts(pageId: string, limit: number = 5): Promise<FacebookPost[]> {
    await this.waitForInit();
    
    return new Promise((resolve, reject) => {
      window.FB.api(
        `/${pageId}/posts`,
        {
          fields: 'id,message,story,created_time,full_picture,permalink_url,reactions.summary(total_count),comments.summary(total_count)',
          limit: limit
        },
        (response: { data: FacebookPost[] }) => {
          if (response && response.data) {
            resolve(response.data);
          } else {
            reject('Failed to get page posts');
          }
        }
      );
    });
  }

  public async postToPage(pageId: string, message: string, accessToken: string): Promise<{ id: string }> {
    await this.waitForInit();
    
    return new Promise((resolve, reject) => {
      window.FB.api(
        `/${pageId}/feed`,
        'POST',
        {
          message: message,
          access_token: accessToken
        },
        (response: { id: string; error?: any }) => {
          if (response && response.id) {
            resolve(response);
          } else {
            reject(response.error || 'Failed to post to page');
          }
        }
      );
    });
  }

  public async shareUrl(url: string, quote?: string): Promise<void> {
    await this.waitForInit();
    
    return new Promise((resolve) => {
      window.FB.ui({
        method: 'share',
        href: url,
        quote: quote
      }, () => {
        resolve();
      });
    });
  }
}

// Create singleton instance
export const facebookSDK = new FacebookSDK();

// Utility functions
export const formatFacebookPost = (post: FacebookPost): string => {
  const content = post.message || post.story || '';
  const maxLength = 200;
  
  if (content.length <= maxLength) {
    return content;
  }
  
  return content.substring(0, maxLength) + '...';
};

export const getTimeSince = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const createJobPostMessage = (job: any): string => {
  const location = job.location || 'Remote';
  const budget = job.budget ? `₱${job.budget.toLocaleString()}` : 'Budget negotiable';
  
  return `🚀 New Job Opportunity on QuickGig.ph!

📋 ${job.title}
📍 ${location}
💰 ${budget}

${job.description ? job.description.substring(0, 150) + '...' : ''}

Apply now at QuickGig.ph! 🇵🇭

#QuickGigPH #JobOpportunity #Philippines #Freelance #Work`;
};

export default facebookSDK;

