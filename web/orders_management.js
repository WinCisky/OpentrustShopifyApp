import { createClient } from '@supabase/supabase-js';

export const OrdersManagement = {
    supabaseUrl: 'https://gjclmptpvaepykpghadl.supabase.co',
    supabaseKey: "",
    completed: async function (shopDomain, orderData) {

        const parsedData = JSON.parse(orderData);
        const email = parsedData.email;
        if (!email) // error!
            return false;

        const id = parsedData.id;
        if (!id) // error!
            return false;

        const supabase = createClient(this.supabaseUrl, this.supabaseKey);

        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    email: email,
                    shop: shopDomain,
                    order_id: id
                },
            ]);

        if (error)
            return false;
        // console.log(JSON.stringify(data));
        return true;
    },
    shopinfo: async function (shop, shopName, shopEmail, modified = false) {
        const supabase = createClient(this.supabaseUrl, this.supabaseKey);

        if (!shopName)
            return false;

        if (!shopEmail)
            return false;

        {
            // check if default data was already saved
            let { data, error } = await supabase
                .from('stores')
                .select('*')
                .eq(shop, shop)

            if (error || (data?.length > 0 && !modified))
                return;
        }

        let { data, error } = await supabase
            .from('stores')
            .upsert({
                shop: shop,
                name: shopName,
                email: shopEmail,
                modified: modified
            });

        if (error)
            return false;
        console.log(JSON.stringify(data));
        return true;
    },
    getshop: async function(shop) {
        const supabase = createClient(this.supabaseUrl, this.supabaseKey);
        // check if default data was already saved
        let { data, error } = await supabase
        .from('stores')
        .select('name, email')
        .eq("shop", shop)

        if(!error)
            return data;
        return [];
    }
}