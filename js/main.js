function getDate()
{
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return day + "." + (month < 10 ? "0" + month : month) + "." + year;
}

function Employee(name, id, position, team, section, part, mail, tel)
{
    this.name = name;
    this.id = id;
    this.position = position;
    this.team = team;
    this.section = section;
    this.part = part;
    this.mail = mail;
    this.tel = tel;
}

function getEmployees(callback, argName, argId, argPosition, argTeam, argSection, argPart, argMail, argTel)
{
    this.employees = [];

    var requestEmployees = new XMLHttpRequest();
    requestEmployees.onreadystatechange = function(e)
    {
        if (requestEmployees.readyState === XMLHttpRequest.DONE && requestEmployees.status === 200)
        {
            var elements = requestEmployees.responseXML.getElementsByTagName("person");
            for (var i = 0; i < elements.length; i++)
            {
                var name = elements[i].getElementsByTagName("name")[0].innerHTML;
                if (name.toUpperCase().indexOf(argName.toUpperCase()) === -1)
                    continue;
                var id = elements[i].getElementsByTagName("id")[0].innerHTML;
                if (id.toUpperCase().indexOf(argId.toUpperCase()) === -1)
                    continue;
                var position = elements[i].getElementsByTagName("position")[0].innerHTML;
                if (position.toUpperCase().indexOf(argPosition.toUpperCase()) === -1)
                    continue;
                var team = "";//elements[i].getElementsByTagName("")[0].innerHTML;
                if (team.toUpperCase().indexOf(argTeam.toUpperCase()) === -1)
                    continue;
                var section = "";//elements[i].getElementsByTagName("")[0].innerHTML;
                if (section.toUpperCase().indexOf(argSection.toUpperCase()) === -1)
                    continue;
                var part = "";//elements[i].getElementsByTagName("")[0].innerHTML;
                if (part.toUpperCase().indexOf(argPart.toUpperCase()) === -1)
                    continue;
                var mail = elements[i].getElementsByTagName("mail")[0].innerHTML;
                if (mail.toUpperCase().indexOf(argMail.toUpperCase()) === -1)
                    continue;
                var tel = elements[i].getElementsByTagName("tel")[0].innerHTML;
                if (tel.toUpperCase().indexOf(argTel.toUpperCase()) === -1)
                    continue;
                employees.push(new Employee(name, id, position, team, section, part, mail, tel));
            }
            callback();
        }
    };
    requestEmployees.open("GET", "./data/persons.xml?" + new Date().getDate());
    requestEmployees.send();
}

window.onload = function()
{
    document.getElementById("cross_emp").onclick = clearEmployee;
    document.getElementById("cross_dev").onclick = clearDevice;

    new Page("page_1").load();
    new Page("page_2").load();
    new Page("page_3").load();
    var dateInterval = window.setInterval(
        function() 
        { 
            var dateSpans = document.getElementsByClassName("date");
            if (dateSpans.length > 0)
            {
                for (var i = 0; i < dateSpans.length; i++)
                    dateSpans[i].innerHTML = getDate(); 
                clearInterval(dateInterval);
            }
        }, 1
    );

    var checkboxes = document.getElementsByClassName("accessories");
    for (var i = 0; i < checkboxes.length; i++)
        checkboxes[i].onchange = function(e) 
        {
            var accessories = "";
            for (var i = 0; i < checkboxes.length; i++)
                if (checkboxes[i].checked)
                    accessories += (accessories.length === 0) ? checkboxes[i].id : ", " + checkboxes[i].id;
            if (accessories.length === 0)
                accessories = "---";
            document.getElementById("accessories").innerHTML = accessories;
        };

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
            new List("inp_emp", "emp_list", requestEmployees.responseXML, "person", ["id", "name", "department"]).addEventListener("submit", function(e) { fillEmployee(e); });
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
            devices = new List("inp_dev", "dev_list", requestDevices.responseXML, "device", ["model_id", "sn", "it"]);
            devices.addEventListener("submit", function(e) { fillDevice(e); });
        }
    };
    
    requestDevices.open("GET", "./data/devices.xml?" + new Date().getDate());
    requestDevices.send();
    
    function clearDevice()
    {
        fillElementsByClassName("dev_model", "---");
        fillElementsByClassName("dev_sn", "---");
        fillElementsByClassName("dev_it", "---");
        fillElementsByClassName("dev_wrof", "---");
        fillElementsByClassName("dev_ssd", "---");
        fillElementsByClassName("dev_hdd", "---");
        fillElementsByClassName("dev_lan_mac", "---");
        fillElementsByClassName("wifi_wifi_mac", "---");
    }
    
    function fillDevice(device)
    {
        fillElementsByClassName("dev_model", device.model_id);
        fillElementsByClassName("dev_sn", device.sn);
        fillElementsByClassName("dev_it", device.it);
        fillElementsByClassName("dev_wrof", device.wrof);
        fillElementsByClassName("dev_ssd", device.ssd);
        fillElementsByClassName("dev_hdd", device.hdd);
        fillElementsByClassName("dev_lan_mac", device.lan_mac);
        fillElementsByClassName("dev_wifi_mac", device.wifi_mac);
    }
};