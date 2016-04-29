$(document).ready(function () {

    // Initially, load the table content
    // GET /api/v1.0/tasks
    update_task_table();

    $('form').submit(function (event) {

        // Check if valid
        var text = $("input[name='description']").val();
        var urgent = $("input[name='urgent']").prop("checked");

        if (text.length < 3) {
            $('div#errorbox').text("Description too short").addClass("text-danger");
            $("input[name='description']").parent().addClass("has-error");
            window.setTimeout(function () {
                $("input[name='description']").parent().removeClass("has-error");
            }, 1000);
            event.preventDefault();
        } else {
            // insert the new element in the DB
            // POST /api/v1.0/tasks
            var json = {description: text, urgent: urgent};
            $.ajax("/api/v1.0/tasks",
                {
                    method: 'POST',

                    contentType: 'application/json',
                    data: JSON.stringify(json),

                    success: function (data, status) {
                        // called when the POST is complete
                        update_task_table();
                    }
                }
            );

            // update (refresh) the table
            // GET /api/v1.0/tasks
            event.preventDefault();
        }

    });

});

function update_task_table() {

    // get the JSON with the list of tasks from the server
    $.ajax(
        '/api/v1.0/tasks',
        {
            method: "GET",
            dataType: "json",
            success: function (data, status) {
                // Replace the table contents with the new data

                // Delete all rows (except the title row)
                $("table#task-list tbody").remove();

                // Add one new row for each data item
                var tasks = data.tasks; // array of tasks
                for (var i = 0; i < tasks.length; i++) {
                    var description = tasks[i].description;
                    var urgent = tasks[i].urgent;

                    var delete_button = '<a class="delete btn btn-default" ><span class="glyphicon glyphicon glyphicon-remove"></span>Delete</a>';

                    $("table#task-list").append("<tr><td>" + description +
                        "</td><td>" + urgent + "</td><td>" +
                        delete_button + "</td></tr>");
                } // table is complete, now


                $("a.delete").click(function (event) {

                    // TODO: implement deletion function
                });
            }
        }
    );

}