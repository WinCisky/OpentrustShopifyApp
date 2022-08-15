const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqY2xtcHRwdmFlcHlrcGdoYWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY3OTQ4OTksImV4cCI6MTk3MjM3MDg5OX0.n-WN4gsTP7HgmXjnupOtu-j0fj2hIiACEhy3NagJZt4";
const anonBearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqY2xtcHRwdmFlcHlrcGdoYWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY3OTQ4OTksImV4cCI6MTk3MjM3MDg5OX0.n-WN4gsTP7HgmXjnupOtu-j0fj2hIiACEhy3NagJZt4";
const supabaseUrl = "https://gjclmptpvaepykpghadl.supabase.co";

function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        if (interval < 2)
            return "1 month";
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        if (interval < 2)
            return "1 day";
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        if (interval < 2)
            return "1 hour";
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        if (interval < 2)
            return "1 minute";
        return Math.floor(interval) + " minutes";
    }
    if (interval < 2)
        return "1 second";
    return Math.floor(seconds) + " seconds";
}


async function loadData() {
    if (shopDomain) {
        const response = await fetch(
            supabaseUrl + `/rest/v1/shop_reviews?shop=eq.${shopDomain}&select=*`,
            {
                headers: {
                    'apikey': apiKey,
                    'Authorization': anonBearer,
                    'Range': '0-9'
                },
            }
        )
        let result = "";
        const responseData = await response.json();
        responseData.forEach(review => {
            let stars = "";
            for (let i = 0; i < 5; i++) {
                stars += `<span${(review.score - 1) >= i ? " class='active'" : ""}>&#9733;</span>`
            }
            result += `
            <li class="splide__slide review" style="border-color: {{ block.settings.accent_color_inactive }}">
                <div class="stars">
                    ${stars}
                </div>
                <div class="content">
                    ${review.description}
                </div>
                <div class="name">
                    ${review.name}
                </div>
                <div class="time">
                    ${timeSince(new Date(review.created_at))} ago
                <div>
            </li>
            `;
        });
        document.getElementById("reviewsList").innerHTML = result;
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