export default function Stripe() {
  return {
    paymentIntents: { create: async () => ({ id: 'pi_stub' }) },
    checkout: { sessions: { create: async () => ({ id: 'cs_stub', url: '#' }) } },
  };
}
export { Stripe };
