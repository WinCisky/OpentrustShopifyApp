import { Shopify } from "@shopify/shopify-api";
import { createClient } from '@supabase/supabase-js';

export function setupGDPRWebHooks(path) {
  const supabaseUrl = 'https://gjclmptpvaepykpghadl.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const supabase = createClient(supabaseUrl, supabaseKey);
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this webhook.
   *
   * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  Shopify.Webhooks.Registry.addHandler("CUSTOMERS_DATA_REQUEST", {
    path,
    webhookHandler: async (topic, shop, body) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "orders_requested": [
      //     299938,
      //     280263,
      //     220458
      //   ],
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "data_request": {
      //     "id": 9999
      //   }
      // }

      const customerEmail = payload.customer.email;
      const shopDomain = payload.shop_domain;
      if(!shopDomain || shop != shopDomain || shopDomain == "")
        return { "error" : "Shop domain was not provided or provided incorrectly." };
      if(!customerEmail || customerEmail == "")
        return { "error" : "Customer email was not provided." };
      // TODO: return all orders of user
      let { dataOrders, errorOrders } = await supabase
        .from('orders')
        .select('*')
        .eq(shop, shopDomain)
        .eq(email, customerEmail);
      if(errorOrders)
        return { "error" : errorOrders.message };
      // TODO: return all reviews of user
      let { dataReviews, errorReviews } = await supabase
        .from('user_reviews')
        .select('*')
        .eq(shop, shopDomain)
        .eq(email, customerEmail);
      if(errorReviews)
        return { "error" : errorReviews.message };
      return { "orders" : JSON.stringify(dataOrders), "reviews" : JSON.stringify(dataReviews) };
    },
  });

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this webhook.
   *
   * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  Shopify.Webhooks.Registry.addHandler("CUSTOMERS_REDACT", {
    path,
    webhookHandler: async (topic, shop, body) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "orders_to_redact": [
      //     299938,
      //     280263,
      //     220458
      //   ]
      // }

      const customerEmail = payload.customer.email;
      const shopDomain = payload.shop_domain;
      // TODO: change all orders with customer email to bogus email
      const { dataOrders, errorOrders } = await supabase
        .from('orders')
        .update({ email: 'redacted@opentrust.it' })
        .match({ email: customerEmail, shop: shopDomain })
      if(error)
        return { "error" : errorOrders.message };
      // TODO: change name in all reviews to bogus name or Anon
      const { data, error } = await supabase
        .rpc('gdpr_change_name_in_reviews');
      if(error)
        return { "error" : errorOrders.message };
      return { "result" : "user data removed" };
    },
  });

  /**
   * 48 hours after a store owner uninstalls your app, Shopify invokes this
   * webhook.
   *
   * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  Shopify.Webhooks.Registry.addHandler("SHOP_REDACT", {
    path,
    webhookHandler: async (topic, shop, body) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889, 
      //   "shop_domain": "{shop}.myshopify.com"
      // }

      const shopDomain = payload.shop_domain;
      // TODO: delete shop info
      const { dataShop, errorShop } = await supabase
        .from('stores')
        .delete()
        .match({ shop: shopDomain });
      if(errorShop)
        return { "error" : errorShop.message };
      return { "result" : "shop removed" };
    },
  });
}
