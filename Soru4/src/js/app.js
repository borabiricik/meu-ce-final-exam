var searchBtn = document.getElementById("searchBtn");
var searchInput = document.getElementById("searchInput");
var table = document.getElementById("tbody");
var lowestName = document.getElementById("lowestName");
var lowestNote = document.getElementById("lowestNote");
var highestName = document.getElementById("highestName");
var highestNote = document.getElementById("highestNote");
var studentForm = document.getElementById("myForm");
var studentName = document.getElementById("name");
var surname = document.getElementById("surname");
var number = document.getElementById("number");
var visa = document.getElementById("visa");
var final = document.getElementById("final");
let kanvas = document.getElementById("ilk");

var request = new XMLHttpRequest();
var url = "http://127.0.0.1:5500/Soru4/db.json";
var students;

searchStudent = async () => {

    await fetch("../../students.json")
        .then(response => response.json())
        .then(data => students = data)

    var searchedStudents = students.find(student => student.no === searchInput.value)


    if (searchedStudents !== undefined) {
        console.log(searchedStudents);
    }
    else {
        $("#myModal").modal("show");
    }
}

searchBtn.addEventListener("click", () => {
    searchStudent();
})

$(document).ready(() => {
    loadData();
});

studentForm.addEventListener("submit", (e) => {
    e.preventDefault();
})

addStudent = async (e) => {
    var bilgiler = {
        "no": "number.value",
        "name": "studentName.value",
        "surname": "surname.value",
        "visa": parseInt(visa.value),
        "final": parseInt(final.value)

    }

    // request.onload = function () {
    //     console.log(request.status);
    //     console.log(request.readyState);

    // }
    // request.open("PUT", url, true);
    // request.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    // request.send(JSON.stringify(bilgiler));
    await fetch("../../students.json", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bilgiler)
    }).then(response => console.log(response))



}



loadData = () => {

    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            dataHandler(myArr);
        }
    };

    request.open("get", url, true);
    request.send();

    dataHandler = (data) => {
        var out = "";
        var ogrNotlari = [];
        var ogrNames = [];
        for (let i = 0; i < data.length; i++) {
            ogrNotlari.push(ortalamaBul(data[i].visa, data[i].final));
            ogrNames.push(data[i].name);

        }
        for (let i = 0; i < data.length; i++) {
            var visa = data[i].visa;
            var final = data[i].final;
            var min = Math.min(...ogrNotlari);
            var max = Math.max(...ogrNotlari);
            var maxOgr;
            var minOgr;
            out += `<tr>
                        <td>${data[i].no}</td>
                        <td>${data[i].name}</td>
                        <td>${data[i].surname}</td>
                        <td>${visa}</td>
                        <td>${final}</td>
                        <td>${ortalamaBul(visa, final)}</td>
                        <td>${harfNotuBul(visa, final)}</td>
                    </tr>`
            if (ortalamaBul(visa, final) == min) {
                minOgr = data[i];
            }

            else if (ortalamaBul(visa, final) == max) {
                maxOgr = data[i];
            }

        }





        table.innerHTML = out;
        lowestName.innerHTML = `${minOgr.name + " " + minOgr.surname}`;
        lowestNote.innerHTML = ortalamaBul(minOgr.visa, minOgr.final);
        highestName.innerHTML = `${maxOgr.name + " " + maxOgr.surname}`;
        highestNote.innerHTML = ortalamaBul(maxOgr.visa, maxOgr.final);

        let grafik = new Chart(kanvas, {
            type: 'bar',
            responsive: true,
            data: {
                labels: ogrNames,
                datasets: [{
                    label: 'Öğrenci Not Ortalamaları',
                    data: ogrNotlari,
                    order: 2,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)"
                    ],
                },
                {
                    label: 'Çizgi Not Ortalamaları',
                    data: ogrNotlari,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0)",
                    ],
                    order: 1,
                    type: 'line'
                }],

            }
        });
    }

    ortalamaBul = (s1, s2) => {
        return (s1 * 0.4) + (s2 * 0.6);

    }

    harfNotuBul = (s1, s2) => {
        var ortalama = ortalamaBul(s1, s2);

        if (ortalama >= 75) {
            return "A";
        }

        else if (ortalama >= 50 && ortalama < 75) {
            return "B";
        }

        else if (ortalama >= 25 && ortalama < 50) {
            return "C";
        }

        else {
            return "D";
        }
    }



}










