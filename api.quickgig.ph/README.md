# QuickGig API

Simple PHP API providing authentication and profile endpoints.

## Environment

```
DB_HOST=localhost
DB_NAME=quickgig
DB_USER=...
DB_PASS=...
JWT_SECRET=change_me
INSTALL_TOKEN=run_once_secret
ADMIN_TOKEN=your_admin_secret
```

## Deployment

1. Upload files to host (e.g. Hostinger) under `public_html/api`.
2. Set the environment variables above.
3. Install dependencies with `composer install --no-dev`.
4. Run the migrations once via:
   `https://api.quickgig.ph/tools/install.php?token=RUN_ONCE_SECRET`

## Verify

```bash
BASE=https://api.quickgig.ph
ADMIN=YOUR_ADMIN_TOKEN
curl -i "$BASE/status"
curl -i "$BASE/tools/install.php?token=RUN_ONCE"

# seed one event with GA/VIP
curl -s -X POST "$BASE/admin/events/create.php" \
 -H "X-Admin-Token: $ADMIN" -H 'Content-Type: application/json' \
 --data '{"slug":"launch-party","title":"Launch Party","venue":"Makati","start_time":"2025-09-10 19:00:00","status":"published","tickets":[{"name":"GA","price_cents":50000,"quantity_total":100},{"name":"VIP","price_cents":120000,"quantity_total":20}]}' | jq

# public fetch/show
curl -s "$BASE/events/index.php" | jq
curl -s "$BASE/events/show.php?slug=launch-party" | jq

# create order for 2x GA
EVENT_ID=$(curl -s "$BASE/events/show.php?slug=launch-party" | jq -r '.event.id')
GA_ID=$(curl -s "$BASE/events/show.php?slug=launch-party" | jq -r '.tickets[] | select(.name=="GA").id')
CREATE=$(curl -s -X POST "$BASE/orders/create.php" -H 'Content-Type: application/json' \
 --data "{\"event_id\":$EVENT_ID,\"buyer\":{\"email\":\"you@example.com\",\"name\":\"You\"},\"items\":[{\"ticket_type_id\":$GA_ID,\"quantity\":2}]}")

echo "$CREATE" | jq
ORDER_ID=$(echo "$CREATE" | jq -r '.order_id')

# mark paid (admin)
curl -s -X POST "$BASE/admin/orders/mark_paid.php" -H "X-Admin-Token: $ADMIN" -H 'Content-Type: application/json' \
 --data "{\"order_id\":$ORDER_ID}" | jq

# status
curl -s "$BASE/orders/status.php?order_id=$ORDER_ID" | jq
```

Auth flow:

```bash
curl -i -X POST "$BASE/auth/register.php" -H 'Content-Type: application/json' \
  --data '{"email":"you+demo@quickgig.ph","password":"P@ssw0rd!","name":"Marlon"}' --cookie-jar c.txt
curl -s "$BASE/auth/me.php" --cookie c.txt
```
