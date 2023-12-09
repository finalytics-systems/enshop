$('.select-category').on('click', function () {
    const queryString = window.location.search
    const new_params = queryString + "&categories=" + encodeURIComponent(this.text.trim())
    window.location = 'shop' + new_params
});

$(() => {
    class Category {
        constructor() {
            this.restore_filters_state();
        }


        restore_filters_state() {
            console.log("{{item_group}}")
        }
    }

    new Category();


});




const getQueryParams = (name, url) => {

    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};