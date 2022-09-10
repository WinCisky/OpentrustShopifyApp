import { createClient } from '@supabase/supabase-js';

export const OrdersManagement = {
    supabaseUrl: 'https://gjclmptpvaepykpghadl.supabase.co',
    supabaseKey: "",
    completed: async function (shopDomain, orderData) {

        const parsedData = JSON.parse(orderData);
        // console.log(JSON.stringify(parsedData));
        const email = parsedData.email;
        if (!email) // error!
            return false;

        // just it or en, ...
        const customer_locale = parsedData.customer_locale.substring(0,2);
        if (!customer_locale) // error!
            return false;

        const first_name = parsedData.billing_address.first_name;
        const last_name = parsedData.billing_address.last_name;
        const name = first_name ? first_name : last_name;
        if (!name) // error!
            return false;

        const supabase = createClient(this.supabaseUrl, this.supabaseKey);

        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    email: email,
                    shop: shopDomain,
                    customer_locale: customer_locale,
                    name: name
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

        console.log(shopName + " " + shopEmail);

        // {
        //     // check if default data was already saved
        //     let { data, error } = await supabase
        //         .from('stores')
        //         .select('*')
        //         .eq(shop, shop)

        //     if (error || (data?.length > 0 && !modified))
        //         return;
        // }

        console.log("passed");

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
        .select('*')
        .eq("shop", shop)

        if(!error)
            return data;
        return [];
    },
    updateshop: async function(shop, name, email, url) {
        const supabase = createClient(this.supabaseUrl, this.supabaseKey);

        const { data, error } = await supabase
        .from('stores')
        .update({ shown_name: name, shown_email : email, shown_url: url })
        .eq('shop', shop)

        if(error)
            console.log(error.message);
        else
            console.log(JSON.stringify(data));

        if(!error)
            return data;
        return [];
    }
}
