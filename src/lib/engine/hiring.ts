import { engineFetch, isEngineOn } from '@/lib/engine';
import type { OfferTerms } from '@/types/application';
import {
  mockCreateOffer,
  mockAcceptOffer,
  mockDeclineOffer,
  mockMarkHired,
  mockMarkNotSelected,
} from '@/lib/applicantStore';

const enabled = process.env.NEXT_PUBLIC_ENABLE_HIRING === 'true';

const headers = { 'content-type': 'application/json' };

export async function createOffer(appId: string, terms: OfferTerms) {
  if (isEngineOn() && enabled) {
    return engineFetch(`/api/applications/${appId}/offer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(terms),
    });
  }
  return mockCreateOffer(appId, terms);
}

export async function acceptOffer(appId: string) {
  if (isEngineOn() && enabled) {
    return engineFetch(`/api/applications/${appId}/accept`, {
      method: 'POST',
      headers,
    });
  }
  return mockAcceptOffer(appId);
}

export async function declineOffer(appId: string) {
  if (isEngineOn() && enabled) {
    return engineFetch(`/api/applications/${appId}/decline`, {
      method: 'POST',
      headers,
    });
  }
  return mockDeclineOffer(appId);
}

export async function markHired(appId: string) {
  if (isEngineOn() && enabled) {
    return engineFetch(`/api/applications/${appId}/hire`, {
      method: 'POST',
      headers,
    });
  }
  return mockMarkHired(appId);
}

export async function markNotSelected(appId: string) {
  if (isEngineOn() && enabled) {
    return engineFetch(`/api/applications/${appId}/reject`, {
      method: 'POST',
      headers,
    });
  }
  return mockMarkNotSelected(appId);
}
