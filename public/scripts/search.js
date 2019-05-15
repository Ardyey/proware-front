$(document).ready(function() {
    fillTable();
    var table = '';
    $('#search').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#search').DataTable({
        ajax: {
            url: 'orders.json',
            dataSrc: ''
        },
        columns: [{
                "data": "student_id"
            },
            {
                "data": "date_created"
            },
            {
                "data": "status"
            },
            {
                "data": "trx_id"
            },
            {
                "data": "or_num"
            },
            {
                "data": "expired"
            },
        ],
        dom: 'Bfrtip',
        select: 'single',
        buttons: [
            {
                extend: 'selected', // Bind to Selected row
                text: 'View Items',
                name: 'view', // do not change name
                attr: {
                    id: 'view'
                },
                action: () => {
                let data = table.rows({
                    selected: true
                }).data();
                window.location.href = `/view_items?transaction=${data[0].trx_id}`
                }
            }],
    });
}