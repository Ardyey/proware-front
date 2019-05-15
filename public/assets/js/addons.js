const searchBar = document.querySelector('#searchBar');
const searchButton = document.querySelector('#searchButton');

$(document).ready(function() {
    catList();
    navBar();

    $(searchBar).keypress(function(e) {
        var key = e.which;
        if (key == 13) // the enter key code
        {
            searchButton.click();
            return false;
        }
    });
});

$(".clean-product-item").on("click", function(e) {
    let itemCode = $(this).find('p').text();
    window.location.href = `/product_page?itemCode=${itemCode}`;
});

$("#searchButton").on("click", function(e) {
    let product = searchBar.value;
    window.location.href = `/search_results?product=${product}`;
});

const catList = () => {
    let selector = '.nav-list li';
    let url = window.location.href;
    let target = url.split('/');
    let tempUrl = [];
    let tempLi = [];
    $(selector).each(function() {
        if (target[target.length - 1].includes('?')) {
            let target2 = target[target.length - 1].split('?')
            for (let i = 0; i < $('.nav-list li').find('a').length; i++) {
                tempUrl[i] = $('.nav-list li').find('a')[i];
                tempLi[i] = $('.nav-list').find('li')[i];
                if ($(tempUrl[i]).attr('href') === ('/' + target2[target2.length - 2])) {
                    $(tempLi[i]).addClass('active');
                }
            }
        }
        if ($(this).find('a').attr('href').includes('/' + target[target.length - 1])) {
            $(this).addClass('active');
        }

    });
}

const navBar = () => {
    let selector = '.navbar-nav li';
    let url = window.location.href;
    let target = url.split('/');
    $(selector).each(function() {
        if (target[target.length - 1].includes('_products')) {
            if ($(this).find('a').attr('href').includes('_products')) {
                $(this).addClass('active');
            }
        } else if ($(this).find('a').attr('href').includes('/' + target[target.length - 1])) {
            $(this).addClass('active');
        }
    });
}

const searchProduct = (num) => {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search.slice(1));
    if (params.has('page')) {
        params.set('page', num);
        window.history.replaceState({}, '', '/search_results?' + params);
        let newUrl = new URL(window.location.href);
        window.location.href = newUrl;
    } else {
        window.location.href = url + '&page=' + num;
    }
}