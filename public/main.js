//intro
$('#divSchema').hide();
$('#intro').show();

if(localStorage.getItem('name1') !== null) {
  $('#firstInput').val(localStorage.getItem('name1').substr(0, localStorage.getItem('name1').indexOf(' ')));
  $('#lastInput').val(localStorage.getItem('name1').substr(localStorage.getItem('name1').indexOf(' ')+1));
  getInfo();
}

$('#introBtn').click(function() {
  getInfo();
});

$('#lastInput').keypress(function(e) {
    if(e.which == 13) {
      getInfo();
    }
});

function getInfo() {
  var firstName = $('#firstInput').val();
  var lastName = $('#lastInput').val();

  if (firstName == '' && lastName == '') {
    $('#welcome').text('Du glömde för och efternamn!').css('color', 'red');
  } else if (firstName == '') {
    $('#welcome').text('Du glömde förnamn!!!1!').css('color', 'red');
  } else if (lastName == '') {
    $('#welcome').text('Du glömde efternamn!').css('color', 'red');
  } else {
    firstName = firstName.substr(0,1).toUpperCase()+firstName.substr(1);
    lastName = lastName.substr(0,1).toUpperCase()+lastName.substr(1);

    var originalFirstName = firstName;
    var originalLastName = lastName;

    firstName = firstName.replace('å', '&#229;');
    lastName = lastName.replace('å', '&#229;');
    firstName = firstName.replace('ä', '&#228;');
    lastName = lastName.replace('ä', '&#228;');
    firstName = firstName.replace('ö', '&#246;');
    lastName = lastName.replace('ö', '&#246;');

    firstName = firstName.replace('Å', '&#197;');
    lastName = lastName.replace('Å', '&#197;');
    firstName = firstName.replace('Ä', '&#196;');
    lastName = lastName.replace('Ä', '&#196;');
    firstName = firstName.replace('Ö', '&#214;');
    lastName = lastName.replace('Ö', '&#214;');

    firstName = firstName.replace('é', '&#233;');
    lastName = lastName.replace('é', '&#233;');
    firstName = firstName.replace('ü', '&#252;');
    lastName = lastName.replace('ü', '&#252;');

    var name = (lastName + ', ' + firstName);

    var req = new XMLHttpRequest();
    req.open('POST', 'http://178.62.210.139/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({name: name}));
    req.addEventListener('load', function() {
      var requestedId = (JSON.parse(req.responseText)).requestedId;
      requestedId = requestedId.substring(requestedId.indexOf('{')+1, requestedId.indexOf('}'));

      if (requestedId !== '') {
        $('#intro').slideUp();
        $('#divSchema').delay(400).fadeIn(1000);

        localStorage.setItem('1', requestedId);
        localStorage.setItem('current', requestedId);

        //nedan: loggar in automatiskt nästa gång appen startas om eftersom
        //name i LS inte kan skapas om inte getInfo() gått igenom
        localStorage.setItem('name1', originalFirstName+' '+originalLastName);

        var nameArr =[];
        for (var i = 0; i < localStorage.length; i++) {
          if (localStorage.key(i).substr(0, 4) == 'name') {
            nameArr.push(localStorage.key(i));
          }
        }

        for (var i = 1; i <= nameArr.length; i++) {
          var name = localStorage.getItem('name'+i);
          var lastName = name.substr(name.indexOf(' ')+1);
          $('.barUl').append('<li class="barLi" id="'+i+'barLi"><p>' + name.substr(0,1) + lastName.substr(0,1) + '</p></li>');
          $('#schemanUl').append('<li class="schemanLi" id="'+i+'schemanLi">'+name+'<span class="meSign">&nbsp;JAG</span><span class="goldMemberSign">&nbsp;GOLD MEMBER</span></li>');
        }

        if (nameArr.length > 1) {
          $('#1barLi').find('p').css('color', 'red');
          restart();
        }

	 if((localStorage.length-1)/2 < $('.barLi').length) {
          location.reload();
          console.log('Y u max the submit btn?');
        }

        //reloadiframes först eftersom resten hämtar från DOM
        reloadIframes();
        $.when($.ajax(appendWeeks())).then(setWeek());
        $.when($.ajax(setWeek())).then(modalRestart());

        addRemoveBtn();
        setColor();

        gold();
        meSign();
      } else {
        $('#welcome').text('Hittade inte ditt schema :-( Kolla stavning och internetanslutning! OBS: Skriv ut ev. flera efternamn & áccéntér.').css({'color': 'red', 'font-size': '16px'});
      }
    });
  }
}

if(localStorage.length > 1) {
  $('#welcome').text('Välkommen tillbaka!');
}

if (localStorage.length < 2) {
  $('#disclaimer').append('<p>Rudebecks.me är fristående från Rudebecks.se, ingen data är följaktligen hämtad från skolans hemsida.</p>');
  $('#disclaimerCreator').append('<p>Thim Högberg</p> <p>hogberg.thim@gmail.com</p>')
}

$('#removeScheduleBtn').click(function() {
  $('.removeSchedule').slideToggle(200);
})

//TA BORT schema
function addRemoveBtn() {
  $('.schemanLi').find('.removeSchedule').remove();
  $('.schemanLi').append('<svg class="removeSchedule" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"> <g id="icomoon-ignore"> </g> <path d="M64 160v320c0 17.6 14.4 32 32 32h288c17.6 0 32-14.4 32-32v-320h-352zM160 448h-32v-224h32v224zM224 448h-32v-224h32v224zM288 448h-32v-224h32v224zM352 448h-32v-224h32v224z"></path> <path d="M424 64h-104v-40c0-13.2-10.8-24-24-24h-112c-13.2 0-24 10.8-24 24v40h-104c-13.2 0-24 10.8-24 24v40h416v-40c0-13.2-10.8-24-24-24zM288 64h-96v-31.599h96v31.599z"></path> </svg> ');

  $('.removeSchedule').click(function() {

    var whichId = $(this).parent().attr('id').substr(0,1);
    //updatera localStorage
    var nameArr =[];
    for (var i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).substr(0, 4) == 'name') {
        nameArr.push(localStorage.key(i));
      }
    }
    //om schemat som tas bort är det sista i localstorage awesome!! annars...
    if (whichId == nameArr.length) {
      localStorage.removeItem(whichId);
      localStorage.removeItem('name'+whichId);
      console.log('removed last localstorage..');
    } else {
      localStorage.removeItem(whichId);
      localStorage.removeItem('name'+whichId);

      //subtraherar 1 från keyn på de med key större än den som togs bort
      for (var i = whichId, l = nameArr.length; i< l; i++) {
        console.log(nameArr.length);
        localStorage.setItem(i, localStorage.getItem(parseInt(i)+1));
        //kan tydligen inte lägga på i localStorage.getitem()
        var iplusone = parseInt(i) + 1;
        localStorage.setItem('name'+i, localStorage.getItem('name' + iplusone));
        localStorage.removeItem(iplusone);
        localStorage.removeItem('name'+iplusone);
        nameArr.length = 0;
        $('#'+iplusone+'schemanLi').attr('id', i + 'schemanLi');
        $('#'+iplusone+'barLi').attr('id', i + 'barLi');

        var currentId = localStorage.getItem('current');
        //currentId mst stå innan set item current
        localStorage.setItem('current', localStorage.getItem('1'));

        //byter oavsett tidigare schema till nr 1
        $('.iframeSchema').each(function() {
            $(this).attr('src', $(this).attr('src').replace(currentId, localStorage.getItem('1')));
        })
        restart();
      }
    }

    $(this).parent().remove();
    $('#'+whichId+'barLi').remove();
    nameArr.length = 0;
    $.when($.ajax()).then(setWeek());

    if($('.barLi').length < 2) {
      location.reload();
      $('#settings').show();
    } else if ($('.barLi').length < 1) {
      location.reload();
    } else {
      $('.barLi').find('p').css('color', 'grey');
      $('.gold').find('p').css('color', '#D4AF37');
      $('#1barLi').find('p').css('color', 'red');
    }
    if(whichId == 1) {
      meSign();
      localStorage.removeItem('color');
    }
  })
}

var today = new Date();
var todayDay = today.getDay();

if (today.getMonth()>6) {var termin='Ht'} else {termin='Vt'};

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

var iframeWeek = today.getWeek();

if (today.getDay() == 6 || today.getDay() == 0) {
  //initial slide blir således måndag
  todayDay = 1;
  $('#divSchema .barName').text('HELG HELG HELG');
  $('#divSchema .barName').hide();
  $('#divSchema .barName').delay(1500).fadeIn().delay(2000).fadeOut();
  setTimeout( function() {
    $('#divSchema .barName').hide();
    $('#divSchema .barName').text('Nästa veckas schema');
    $('#divSchema .barName').fadeIn();
  }, 4500);
}

if(localStorage.length < 4 && today.getDay() !== 6 && today.getDay() !== 0) {
  $('#divSchema .barName').text('Lägg till fler scheman →');
  $('#divSchema .barName').hide();
  $('#divSchema .barName').delay(1500).fadeIn().delay(2000).fadeOut();
  setTimeout( function() {
    $('#divSchema .barName').hide();
    $('#divSchema .barName').text('Schema');
    $('#divSchema .barName').fadeIn();
  }, 4500);
}

if (termin == 'Ht') { var lastDay = new Date(today.getYear(), 11, 31) } else { var lastDay = new Date(today.getYear(), 5, 31) };

//WEEK
function setWeek() {
  $('#weekNo').empty();
  var weekNo = $('#dmon1').attr('src').substring($('#dmon1').attr('src').indexOf('week=')+5, $('#dmon1').attr('src').indexOf('&foot'));
  $('#weekNo').append(weekNo);
  $('.weekModalLi').css('color', 'white');
  $('.modalLiWeek').css('font-weight', 'normal');
  $('#'+ weekNo).css('color', 'red');
  $('#'+ weekNo + ' .modalLiWeek').css('font-weight', 'bold');
}

function appendWeeks() {
  var weekNo = $('#dmon1').attr('src').substring($('#dmon1').attr('src').indexOf('week=')+5, $('#dmon1').attr('src').indexOf('&foot'));
  for (var i = parseInt(weekNo); i < lastDay.getWeek()-1; i++) {
    $('.weekModal ul').append('<li class="weekModalLi" id='+i+'><p><span class="modalLiWeek">Vecka </span><span class="modalLiNo">'+i+'</span></p></li>');
  }
}

function modalRestart() {
  $('.weekModalLi').click(function() {
    $('.iframeSchema').fadeOut(100);
    var week = this.id;

    $('.iframeSchema').each(function() {
      var iframeUrl = $(this).attr('src');
      var weekEW = iframeUrl.substring(iframeUrl.indexOf('week='), iframeUrl.indexOf('&foot'));
      $(this).attr('src', iframeUrl.replace(weekEW, 'week='+week));
      console.log('changed week of iframes');
    });
    setWeek();
    scheduleWNewW();
    $('.weekModal').slideUp(200);
    $('#weekArrow').css('color', 'white');

if(week !== iframeWeek) {
      $('#timeLine, #timeBall, #timeStamp').hide();
      $('#divSchema .barName').hide();
      $('#divSchema .barName').text('Schema för vecka ' + week);
      $('#divSchema .barName').delay(500).fadeIn();
    }
    //eftersom att världen är konstig funkar bara det här (21:06 21 sep 2017)
    if(week == iframeWeek) {
      showTime();
       if (today.getDay() == 6 || today.getDay() == 0) {
        $('#divSchema .barName').text('Nästa veckas schema');
      } else {
        $('#divSchema .barName').text('Schema');
      }
    }
 })
}

modalRestart();

function scheduleWNewW() {
  setTimeout( function() {
    $('.swiper-pagination').css('z-index', '2');
  }, 200);
  $('.iframeSchema').fadeIn(100);
  console.log('new iframe - new week');
}

$('.weekBtn').click(function() {
  if($('.weekModal').css('display') == 'none') {
    $('.swiper-pagination').css('z-index', '0');
    $('#weekArrow').css('color', '#bfbfbf');
  } else {
    setTimeout( function() {
      $('.swiper-pagination').css('z-index', '2');
      $('#weekArrow').css('color', 'white');
    }, 200);
  }
  $('.weekModal').slideToggle(200);
})

$('#reloadBtn').click(function() {
  $('#divSchema .barName').text('Laddar om...');
  location.reload();
})

//settings
$('.settingsBtn').click(function() {
  $('#settings').slideToggle();
  $('#divSchema').slideToggle();
})

$('#goBack').click(function() {
  $('#settings').slideToggle();
  $('#addScheduleModal').slideUp();
  $('#colorInput').slideUp();
  $('.removeSchedule').slideUp();
  $('#divSchema').slideToggle();
  $('#creator').slideDown();
})

$('#addSchedule').click(function() {
  $('#addScheduleModal').slideToggle(150);
  $('#schemeInputFirst').focus();
  $('#creator').slideToggle();
})

$('#scheduleModalBtn').click(function() {
  addSchedule();
})

$('#schemeInputLast').keypress(function(e) {
  if(e.which == 13) {
    addSchedule();
  }
});

$('#capitalizeCheckbox').change(function() {
  if($('#capitalizeCheckbox').is(':checked')) {
    $('#addScheduleModal input').css('text-transform', 'none');
    $('#schemeInputFirst').attr('placeholder', 'förnamn');
    $('#schemeInputLast').attr('placeholder', 'efternamn');
    $('#schemeInputFirst').focus();
  } else {
    $('#addScheduleModal input').css('text-transform', 'capitalize');
    $('#schemeInputFirst').focus();
  }
});

//ADD ANOTHER SCHEDULE
function addSchedule() {
  var firstName = $('#schemeInputFirst').val();
  var lastName = $('#schemeInputLast').val();

  if (firstName == '' && lastName == '') {
    alert('Du glömde för och efternamn!');
  } else if (firstName == '') {
    alert('Du glömde förnamn!1!');
  } else if (lastName == '') {
    alert('Du glömde efternamn!');
  } else {

    if ($('#capitalizeCheckbox').is(':checked') == false) {
      firstName = firstName.substr(0,1).toUpperCase()+firstName.substr(1);
      lastName = lastName.substr(0,1).toUpperCase()+lastName.substr(1);
    }

    var originalFirstName = firstName;
    var originalLastName = lastName;

    firstName = firstName.replace('å', '&#229;');
    lastName = lastName.replace('å', '&#229;');
    firstName = firstName.replace('ä', '&#228;');
    lastName = lastName.replace('ä', '&#228;');
    firstName = firstName.replace('ö', '&#246;');
    lastName = lastName.replace('ö', '&#246;');

    firstName = firstName.replace('Å', '&#197;');
    lastName = lastName.replace('Å', '&#197;');
    firstName = firstName.replace('Ä', '&#196;');
    lastName = lastName.replace('Ä', '&#196;');
    firstName = firstName.replace('Ö', '&#214;');
    lastName = lastName.replace('Ö', '&#214;');
    // NOTE:ADDSCHEDULE
    firstName = firstName.replace('é', '&#233;');
    lastName = lastName.replace('é', '&#233;');
    firstName = firstName.replace('ü', '&#252;');
    lastName = lastName.replace('ü', '&#252;');

    var name = (lastName + ', ' + firstName);

    var req = new XMLHttpRequest();
    req.open('POST', 'http://178.62.210.139/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({name: name}));
    req.addEventListener('load', function() {
      var requestedId = (JSON.parse(req.responseText)).requestedId;
      requestedId = requestedId.substring(requestedId.indexOf('{')+1, requestedId.indexOf('}'));

      if (requestedId !== '') {
        $('#schemeInputFirst').val('');
        $('#schemeInputLast').val('');

        var n = $('.barLi').length + 1;

        $('#schemanUl').append('<li class="schemanLi" id="'+n+'schemanLi">'+originalFirstName+' '+originalLastName+'<span class="meSign">&nbsp;JAG</span><span class="goldMemberSign">&nbsp;GOLD MEMBER</span></li>');

        $('.barUl').append( '<li class="barLi" id="'+n+'barLi"><p>'+
                            originalFirstName.substr(0,1) + originalLastName.substr(0,1) +
                            '</p></li>');
        localStorage.setItem(n, requestedId);
        localStorage.setItem('name' + n, originalFirstName + ' ' + originalLastName);

        var currentId = localStorage.getItem('current');

        if(n < 3) {
          $('#1barLi p').css('color', 'red');
        }

	$('#divSchema .barName').text('Schema');

        restart();
        setWeek();
        addRemoveBtn();
        gold();

      } else {
        alert('Hittade inte ditt schema :-( Kolla stavning och internetanslutning! OBS: Skriv ut ev. flera efternamn & áccéntér.');
      }
    });
  }
}

$('#changeColor').click(function() {
  $('#colorInput').slideToggle(150);
  $('#creator').slideToggle();
})

$('#colorInput').keypress(function(e) {
    if(e.which == 13) {
      var color = $('#colorInput').val();
      $('#colorInput').val('');
      localStorage.setItem('color', color);
      setColor();
    }
});

function setColor() {
  var color = localStorage.getItem('color');
  $('.barTop').css('background-color', color);
}

function restart() {
  $('.barLi').on('click', function() {
    var barLiId = this.id.substr(0,1);
    var id = localStorage.getItem(barLiId);
    var currentId = localStorage.getItem('current');
    localStorage.setItem('current', id);

    function changeEachId() {
      $('.iframeSchema').each(function() {
        $(this).attr('src', $(this).attr('src').replace(currentId, id));
      });
    }
    changeEachId();
    $(this).siblings().find('p').css('color', 'grey');
    $('.gold').find('p').css('color', '#D4AF37');
    $(this).find('p').css('color', 'red');
  });
};
// restart();


//schema append
var days = ['mon','tue','wed','thu','fri'];

function reloadIframes() {
  var id = localStorage.getItem('current');
  var imgHeight = $('body').height()-165;
  var imgWidth = $('body').width()-20;

  var j = 0;
  for (var i = 1; i <= 16; i*=2) {
    var iframeSchema = '<div class="swiper-slide"><iframe id="d' + days[j] + '1" src="http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=93700/sv-se&type=3&id={'+id+'}&period='+termin+'&week='+iframeWeek+'&foot=0&day='+i+'&width='+imgWidth+'&height='+imgHeight+'" class="iframeSchema"></iframe></div>';
    $('#swiper-wrapperVerticalSchema').append(iframeSchema);
  j++;
  }
  showTime();
  reloadSwipe();
}

var dayArr = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre'];

function reloadSwipe() {
  $('.swiper-containerSchema').height($('body').height());
  //initialize swiper when document ready
  var schemaSwiper = new Swiper ('.swiper-containerVerticalSchema', {
    grabCursor: true,
    width: $('body').width(),
    spaceBetween: 10,
    initialSlide: todayDay - 1,
    pagination: '.swiper-pagination',
    paginationClickable: true,
    paginationBulletRender: function (swiper, index, className) {
    return '<span class="' + className + '">' + dayArr[index] + '</span>';
    },
  })

  var swiperH = new Swiper('.swiper-containerSchema', {
    grabCursor: true,
    direction: 'vertical',
    height: $('body').height() * 2/3,
    spaceBetween: 10,
    });
}

var orgWArr = [];
orgWArr.length = 0;
orgWArr.push($('body').width());

$(window).resize(function() {
    if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
        orgWArr.push($('body').width());
    }, 500);
});

$(window).bind('resizeEnd', function() {
  console.log('resized');
  var imgHeight = $('body').height() - 165;
  var imgWidth = $('body').width()-20;
  var heightLength = (imgHeight.toString().length + 8);

  if(orgWArr[orgWArr.length - 1] == (imgWidth+20)) {
    $('.iframeSchema').each(function() {
      $(this).attr('src', $(this).attr('src').replace( $(this).attr('src').substring($(this).attr('src').indexOf('height=')+7, $(this).attr('src').length), imgHeight));
    })
    orgWArr.length = 0;
  } else {
    orgWArr.length = 0;
    orgWArr.push($('body').width());
    location.reload();
  }
  showTime();
});

function showTime() {
  if(today.getHours() > 7 && today.getHours() < 17 && today.getDay() < 6 && today.getDay() > 0) {

    if(today.getMinutes() < 10) {
      var todayMinutes = '0' + today.getMinutes();
      var todayHours = today.getHours();
    } else if (today.getHours() < 10) {
      var todayMinutes = today.getMinutes();
      var todayHours = '0' + today.getHours();
    } else if (today.getMinutes() < 10 && today.getHours() < 10) {
      var todayMinutes = '0' + today.getMinutes();
      var todayHours = '0' + today.getHours();
    } else {
      var todayMinutes = today.getMinutes();
      var todayHours = today.getHours();
    }

    $('.swiper-slide:nth-child('+todayDay+')').append('<div id="timeBall"></div><div id="timeStamp">'+todayHours+':'+todayMinutes+'</div><div id="timeLine"></div>');
    var bottom = 151.25 + (9/408) * ($('body').height() - 165);
    var Hour = ((462.5-160.25)/7/408) * ($('body').height() - 165);
    var hours = (17 - today.getHours())*Hour;
    var minutes = (today.getMinutes()/59) * Hour;
    var place = hours - minutes + bottom;
    $('#timeLine, #timeBall, #timeStamp').css('bottom', ''+place+'px');
    $('#timeLine, #timeBall, #timeStamp').hide();
    $('#timeLine, #timeBall').delay(1000).fadeIn().delay(4000).fadeOut();
    $('#timeStamp').delay(1500).fadeIn().delay(3000).fadeOut();

    /*setTimeout(function() {
      location.reload();
    },5*60000);*/
  }
}

var goldPersonList = ['Joseph Wokil', 'Peter Stahre', 'Oscar Dunnington', 'Emelie Hitzeroth'];

function gold() {
  var goldArr = [];
  var goldPeople = [];
  for (var i = 0; i < localStorage.length; i++) {
    if(localStorage.key(i).substring(0,4) == 'name') {
      goldArr.push(localStorage.key(i));
    }
  }
  for (var i = 1; i <= goldArr.length; i++) {
    goldPeople.push(localStorage.getItem('name' + i));
  }

  var goldN = goldPeople.indexOf(goldPersonList[0]) + 1;

  for (var i = 0; i < goldPersonList.length; i++) {
    $('#' + (goldPeople.indexOf(goldPersonList[i]) + 1) + 'barLi').addClass('gold');
    $('#' + (goldPeople.indexOf(goldPersonList[i]) + 1) + 'schemanLi').addClass('goldListItem');
    $('#' + (goldPeople.indexOf(goldPersonList[i]) + 1) + 'schemanLi').find('.goldMemberSign').show();
  }
  $('.gold').css('color', '#D4AF37');
  $('.goldListItem').css('border-left', '2px solid #D4AF37');
  $('.goldMemberSign').css({'color': '#D4AF37', 'font-size': '12px', 'font-weight': 'bold'});
}

function meSign() {
  $('.schemanLi .meSign').first().show();
  $('.meSign').css({'color': 'red', 'font-size': '12px', 'font-weight': 'bold'})
}

//gillar du min kod?

// NOTE:
$('#blogg').hide();
if(localStorage.length <= 1) {
  $('#firstInput').val('Thim');
  $('#lastInput').val('Högberg');
  getInfo();
  $('#blogg').show();
}
