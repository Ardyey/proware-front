let params = new URLSearchParams(document.location.search.substring(1));
let trx = params.get('transaction');

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#view').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#view').DataTable({
        language: {
            emptyTable: "No data available in table"
        },
        ajax: {
            url: `items.json?transaction=${trx}`,
            dataSrc: ''
        },
        columns: [{
                "data": "trx_id",
            },
            {
                "data": "item_code"
            },
            {
                "data": "item_description"
            },
            {
                "data": "quantity"
            },
            {
                "data": "sub_total"
            },
        ],
        dom: 'Bfrtip',
        select: 'single',
        buttons: [
             {
                text: 'Back to Previous',
                name: 'back', // do not change name
                attr: {
                    id: 'back'
                },
                action: () => {
                window.history.back();
                }
            }],
    });
}