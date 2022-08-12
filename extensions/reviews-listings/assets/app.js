const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqY2xtcHRwdmFlcHlrcGdoYWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY3OTQ4OTksImV4cCI6MTk3MjM3MDg5OX0.n-WN4gsTP7HgmXjnupOtu-j0fj2hIiACEhy3NagJZt4";
const anonBearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqY2xtcHRwdmFlcHlrcGdoYWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY3OTQ4OTksImV4cCI6MTk3MjM3MDg5OX0.n-WN4gsTP7HgmXjnupOtu-j0fj2hIiACEhy3NagJZt4";
const supabaseUrl = "https://gjclmptpvaepykpghadl.supabase.co";

async function loadData() {
    if (shopDomain) {
        const { result, err } = await fetch(
            supabaseUrl + `/rest/v1/shop_reviews?shop=eq.${shopDomain}&select=*`,
            {
                method: 'POST',
                headers: {
                    'apikey': apiKey,
                    'Authorization': anonBearer,
                    'Range': '0-9'
                },
            }
        )
        console.log(err);
        console.log(result);
        return true;
    }
    return false;
}


document.addEventListener('DOMContentLoaded', (event) => {
    loadData()
        .then((result) => {
            if (!result)
                return;
            var splide = new Splide('.splide', {
                type: 'loop',
                focus: 'center',
                arrows: false,
                drag: 'free',
                snap: true,
                perPage: 3,
                gap: 10,
                breakpoints: {
                    1040: {
                        perPage: 2,
                    },
                    640: {
                        perPage: 1,
                    },
                }
            });

            splide.on('click', function (slide, e) {
                splide.go(slide.index);
            });

            splide.mount();
        });
})