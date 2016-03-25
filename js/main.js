function getDate()
{
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return day + "." + (month < 10 ? "0" + month : month) + "." + year;
}

window.onload = function()
{
    new Page("page_1").load();
    new Page("page_2").load();
    new Page("page_3").load();
    var dateInterval = window.setInterval(
        function() 
        { 
            var dateSpans = document.getElementsByClassName("date");
            for (var i = 0; i < dateSpans.length; i++)
                dateSpans[i].innerHTML = getDate(); 
            if (dateSpans.length > 0)
                clearInterval(dateInterval);
        }, 1
    );

    var departments, employees, devices;

    var requestDepartments = new XMLHttpRequest();
    
    requestDepartments.onreadystatechange = function(e)
    {
        if (requestDepartments.readyState === XMLHttpRequest.DONE && requestDepartments.status === 200)
            departments = requestDepartments.responseXML;
    };
    
    requestDepartments.open("GET", "./data/departments.xml?" + new Date().getDate());
    requestDepartments.send();

    var requestEmployees = new XMLHttpRequest();
    requestEmployees.onreadystatechange = function(e)
    {
        if (requestEmployees.readyState === XMLHttpRequest.DONE && requestEmployees.status === 200)
        {
            employees = new List("inp_emp", "emp_list", requestEmployees.responseXML, "person", ["id", "name", "department"]);
            employees.addEventListener("submit", function(e) { fillEmployee(e); });
        }
    };
    requestEmployees.open("GET", "./data/persons.xml?" + new Date().getDate());
    requestEmployees.send();
    
    function fillElementsByClassName(className, content)
    {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++)
            elements[i].innerHTML = content;
    }

    function clearEmployee()
    {
        fillElementsByClassName("emp_name", "---");
        fillElementsByClassName("emp_id", "---");
        fillElementsByClassName("emp_position", "---");
        fillElementsByClassName("emp_team", "---");
        fillElementsByClassName("emp_section", "---");
        fillElementsByClassName("emp_part", "---");
        fillElementsByClassName("emp_department", "---");
        fillElementsByClassName("emp_mail", "---");
        fillElementsByClassName("emp_tel", "---");
    }
    
    function fillEmployee(employee)
    {
        var part = departments.getElementById(employee.deptId);
        var section = part.parentElement;
        var team = section.parentElement;
        part = part.getAttribute("name");
        section = section.getAttribute("name");
        team = team.getAttribute("name");
        var department = employee.position === "Team Leader" ? team : (employee.position === "Section Leader" ? section : part);

        fillElementsByClassName("emp_name", employee.name);
        fillElementsByClassName("emp_id", employee.id);
        fillElementsByClassName("emp_position", employee.position);
        fillElementsByClassName("emp_team", team);
        fillElementsByClassName("emp_section", section);
        fillElementsByClassName("emp_part", part);
        fillElementsByClassName("emp_department", department);
        fillElementsByClassName("emp_mail", employee.mail);
        fillElementsByClassName("emp_tel", employee.tel);
    }
    
    var requestDevices = new XMLHttpRequest();
    requestDevices.onreadystatechange = function(e)
    {
        if (requestDevices.readyState === XMLHttpRequest.DONE && requestDevices.status === 200)
        {
            devices = new List("inp_dev", "dev_list", requestDevices.responseXML, "device", ["model", "sn", "it"]);
            devices.addEventListener("submit", function(e) { fillDevice(e); });
        }
    };
    
    requestDevices.open("GET", "./data/devices.xml?" + new Date().getDate());
    requestDevices.send();
    
    function clearDevice()
    {
        document.getElementById("dev_model").innerHTML = "";
        document.getElementById("dev_sn").innerHTML = "";
        document.getElementById("dev_it").innerHTML = "";
        document.getElementById("dev_wrof").innerHTML = "";
        document.getElementById("dev_ssd").innerHTML = "";
        document.getElementById("dev_hdd").innerHTML = "";
    }
    
    function fillDevice(device)
    {
        document.getElementById("dev_model").innerHTML = device.model;
        document.getElementById("dev_sn").innerHTML = device.sn;
        document.getElementById("dev_it").innerHTML = device.it;
        document.getElementById("dev_wrof").innerHTML = device.wrof;
        document.getElementById("dev_ssd").innerHTML = device.ssd;
        document.getElementById("dev_hdd").innerHTML = device.hdd;
    }
};