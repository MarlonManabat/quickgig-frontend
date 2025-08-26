function Stripe() {
  return {
    paymentIntents: { create: async () => ({ id: 'pi_stub' }) },
    checkout: { sessions: { create: async () => ({ id: 'cs_stub', url: '#' }) } },
  };
}
module.exports = Stripe;
module.exports.default = Stripe;
module.exports.Stripe = Stripe;
