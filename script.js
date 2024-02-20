(() => {
  let count = 0;            //количество студентов
  const TODAY = new Date(); //текущая дата
  let newStud = {           //информация о студенте из формы
    name: '',
    surname: '',
    patronymic: '',
    date: new Date('1900-01-01'),
    yearStart: 2000,
    faculty: '',
  }
  let rowContent = {        //информация о студенте для таблицы
    number: 0,
    fio: '',
    faculty: '',
    birth: new Date('1900-01-01'),
    dr: '',
    yearBegin: '',
    yearEnd: '',
    year: '',
  }
  let masStud = [];         //массив студентов для таблицы
  const KEY = 'Stud';       //ключ для LocalStorage

// создание строки таблицы
  function createNewRow(trContent) {
    let thNum = document.createElement('th');
    let thFio = document.createElement('th');
    let thFac = document.createElement('th');
    let thDr = document.createElement('th');
    let thYear = document.createElement('th');

    thNum.textContent = trContent.number;
    thNum.setAttribute('scope', 'row');
    thFio.textContent = trContent.fio;
    thFac.textContent = trContent.faculty;
    thDr.textContent = trContent.dr;
    thYear.textContent = trContent.year;
    return {
      thNum,
      thFio,
      thFac,
      thDr,
      thYear,
    }
  }

  function reloadTable(array) {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    for (item of array) {
      let tr = document.createElement('tr');
      let temp = createNewRow(item);
      tr.append(temp.thNum);
      tr.append(temp.thFio);
      tr.append(temp.thFac);
      tr.append(temp.thDr);
      tr.append(temp.thYear);
      tbody.append(tr);
    }
  }

// считываем данные из полей и очищаем форму
  function getInformation() {
    let currentStudent = {
      name: '',
      surname: '',
      patronymic: '',
      date: new Date('1900-01-01'),
      yearStart: 2000,
      faculty: '',
    };
    let temp;
    temp = document.getElementById('name');
    currentStudent.name = temp.value;
    temp = document.getElementById('surname');
    currentStudent.surname = temp.value;
    temp = document.getElementById('patronymic');
    currentStudent.patronymic = temp.value;
    temp = document.getElementById('date');
    currentStudent.date = temp.value;
    temp = document.getElementById('start');
    currentStudent.yearStart = temp.value;
    temp = document.getElementById('faculty');
    currentStudent.faculty = temp.value;
    return currentStudent;
  }

  function clearForm() {
    let temp;
    temp = document.getElementById('name');
    temp.value = '';
    temp = document.getElementById('surname');
    temp.value = '';
    temp = document.getElementById('patronymic');
    temp.value = '';
    temp = document.getElementById('date');
    temp.value = '';
    temp = document.getElementById('start');
    temp.value = '';
    temp = document.getElementById('faculty');
    temp.value = '';
  }

  function changeFio(text) {
    let temp = text.trim();
    temp = temp.substr(0, 1).toUpperCase() + temp.substr(1).toLowerCase();
    return temp;
  }

  function changeDate(date) {
    let temp = TODAY - new Date(date);
    temp = temp / 1000 / 60 / 60 / 24 / 365;
    temp = Math.floor(temp);
    let st = `${date}`;
    st = st.split('-').reverse().join('.');
    st = st + ` (${temp} `;
    if (temp % 10 === 1 && temp % 100 !== 11) {
      st = st + 'год)';
    } else {
      if ((temp % 10 === 2 || temp % 10 === 3 || temp % 10 === 4) && (temp % 100 !== 12 && temp % 100 !== 13 &&temp % 100 !== 14)) {
        st = st + 'года)';
      } else {
        st = st + 'лет)';
      }
    }
    return st;
  }

  function changeYear(year1, year2) {
    let temp = String(year1) + '-' + String(year2);
    let yearToday = TODAY.getFullYear();
    let monthToday = TODAY.getMonth();
    if (yearToday > year2 || (yearToday === year2 && monthToday > 8)) {
      temp = temp + ' (закончил)';
    } else {
      if (monthToday > 8) {
        temp = temp + ` (${yearToday - year1 + 1} курс)`;
      } else {
        temp = temp + ` (${yearToday - year1} курс)`;
      }
    }
    return temp;
  }

  function invalidDate(date) {
    const dateStart = new Date('1900-01-01');
    let dateCur = new Date(date);
    return (dateCur < dateStart || dateCur > TODAY);
  }

  function invalidYear(year) {
    let yearToday = TODAY.getFullYear();
    return (year < 2000 || year > yearToday);
  }

// валидация
  function validateForm() {
    let form = document.getElementById('formStud');
    let flag = true;
    let inputs = form.querySelectorAll('input');
    let divs = form.querySelectorAll('.invalid-message');
    for (let item = 0; item < inputs.length; item++) {
      if (inputs[item].value === '')
        divs[item].classList.add('invalid-show');
      else
        if (divs[item].classList.contains('invalid-show'))
          divs[item].classList.remove('invalid-show');
      if (inputs[item].id === 'date' && invalidDate(inputs[item].value))
        divs[item].classList.add('invalid-show');
      if (inputs[item].id === 'start' && invalidYear(inputs[item].value))
        divs[item].classList.add('invalid-show');
    }
    divs = form.querySelectorAll('.invalid-show');
    flag = divs.length === 0;
    return flag;
  }

  // получение массива из LS
  function getMas() {
    let mas = [];
    if (localStorage.getItem(KEY) !== null) {
      mas = JSON.parse(localStorage.getItem(KEY));
      count = mas.length;
    }
    return mas;
  }

  // сортировка
  function sortArray(array, pole) {
    return array.sort((a,b)=> {
      return (a[pole] > b[pole]) ? 1 : ((b[pole] > a[pole]) ? -1 : 0);
    });
  }
  function sortDateArray(array, pole) {
    return array.sort((a,b)=> {
      return (a[pole] > b[pole]) ? -1 : ((b[pole] > a[pole]) ? 1 : 0);
    });
  }

// преобразование данных для отображения в таблице
  function changeContent(number, source) {
    let target = {
      number: 0,
      fio: '',
      faculty: '',
      birth: new Date(),
      dr: '',
      yearBegin: 0,
      yearEnd: 0,
      year: '',
    }
    target.number = number;
    target.fio = changeFio(source.surname) + ' ' + changeFio(source.name) + ' ' + changeFio(source.patronymic);
    target.faculty = source.faculty.trim();
    target.birth = source.date;
    target.dr = changeDate(source.date);
    target.yearBegin = Number(source.yearStart);
    target.yearEnd = target.yearBegin + 4;
    target.year = changeYear(target.yearBegin, target.yearEnd);
    return target;
  }


  document.addEventListener('DOMContentLoaded', () => {
    const TABLE_HEAD = document.querySelectorAll('.mytable');
    const btnOpenForm = document.getElementById('openForm');
    const ADD_FORM = document.getElementById('formStud');

    masStud = getMas();
    if (masStud != undefined) reloadTable(masStud);

    btnOpenForm.addEventListener('click', () => {
      ADD_FORM.classList.remove('myform');
      btnOpenForm.setAttribute('disabled', '');
    })

    // добавление нового студента
    ADD_FORM.addEventListener('submit', function(e) {
      if (!validateForm()) {
        return;
      }
      newStud = getInformation();
      count = count + 1;
      rowContent = changeContent(count, newStud);
      masStud.push(rowContent);
      localStorage.setItem(KEY, JSON.stringify(masStud));
      masStud = getMas();
      reloadTable(masStud);
      ADD_FORM.classList.add('myform');
      clearForm();
      btnOpenForm.removeAttribute('disabled');
    })

    // сортировка
    let newMas = getMas();
    for (let item = 0; item < TABLE_HEAD.length; item++) {
      TABLE_HEAD[item].addEventListener('click', function(event) {
        let target = [];
        switch (event.currentTarget.id) {
          case 'num':
            target = sortArray(newMas,"number");
            reloadTable(target);
            break;
          case 'fio':
            target = sortArray(newMas,"fio");
            reloadTable(target);
            break;
          case 'fac':
            target = sortArray(newMas,"faculty");
            reloadTable(target);
            break;
          case 'dr':
            target = sortDateArray(newMas,"birth");
            reloadTable(target);
            break;
          case 'year':
            target = sortArray(newMas,"year");
            reloadTable(target);
            break;
        }
      })
    }

    // фильтры
    masStud = getMas();
    const FILTER_FIO = document.getElementById('filterFio');
    const FILTER_FAC = document.getElementById('filterFac');
    const FILTER_START = document.getElementById('filterBegin');
    const FILTER_END = document.getElementById('filterEnd');

    let filterMas = [];
    let inputText = null;
    let timeoutID = null;

    FILTER_FIO.addEventListener('input', () => {
      filterMas = [];
      clearTimeout(timeoutID);
      inputText = FILTER_FIO.value;
      timeoutID = setTimeout(() => {
        for (let i = 0; i < masStud.length; i++) {
          if (masStud[i].fio.indexOf(inputText) > -1)
            filterMas.push(masStud[i]);
        }
        if (FILTER_FIO.value !== '') reloadTable(filterMas)
        else reloadTable(masStud);
      }, 500);
    })

    FILTER_FAC.addEventListener('input', () => {
      filterMas = [];
      clearTimeout(timeoutID);
      inputText = FILTER_FAC.value;
      timeoutID = setTimeout(() => {
        for (let i = 0; i < masStud.length; i++) {
          if (masStud[i].faculty.indexOf(inputText) > -1)
            filterMas.push(masStud[i]);
        }
        if (FILTER_FAC.value !== '') reloadTable(filterMas)
        else reloadTable(masStud);
      }, 500);
    })

    FILTER_START.addEventListener('input', () => {
      filterMas = [];
      clearTimeout(timeoutID);
      inputText = Number(FILTER_START.value);
      timeoutID = setTimeout(() => {
        for (let i = 0; i < masStud.length; i++) {
          if (masStud[i].yearBegin === inputText)
            filterMas.push(masStud[i]);
        }
        if (FILTER_START.value !== '') reloadTable(filterMas)
        else reloadTable(masStud);
      }, 500);
    })

    FILTER_END.addEventListener('input', () => {
      filterMas = [];
      clearTimeout(timeoutID);
      inputText = Number(FILTER_END.value);
      timeoutID = setTimeout(() => {
        for (let i = 0; i < masStud.length; i++) {
          if (masStud[i].yearEnd === inputText)
            filterMas.push(masStud[i]);
        }
        if (FILTER_END.value !== '') reloadTable(filterMas)
        else reloadTable(masStud);
      }, 500);
    })
  })


})();
