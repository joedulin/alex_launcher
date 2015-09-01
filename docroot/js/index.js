var apps;

$(function () {
  $.each($('[id]'), function (i,v) {
    window['$' + $(v).attr('id')] = $(v);
    $.each($(v).find('[data-id]'), function (inex,value) {
      window['$' + $(v).attr('id')][$(v).data('id')] = $(value);
    });
  });

  load_apps();
});

function load_apps() {
  $.ajax({
    url: '/apps/get',
    type: 'POST',
    success: function (resp) {
      apps = resp.data;
      for (var i=0,app; app = apps[i]; i++) {
        $skel = skel('app_icon');
        $skel.image
          .attr('src', app.app_image)
          .one('load', function () {
            equal_heights();
          })
        ;
        $skel.title.html(app.app_title);
        $skel.data('app', app);
        $skel.click(function () {
          run_app($(this).data('app').id);
        });
        $skel.mouseover(function () {
          hover_app($(this).data('app').id);
        });
        //$skel.mouseout(default_background);
        $main.append($skel);

        $backgrounds.append('<img data-id="' + app.id + '" src="' + app.app_background + '" style="opacity: 0;">');
      }
    }
  });
}

function run_app(id) {
  $.ajax({
    url: '/app/run',
    type: 'POST',
    data: {
      id: id
    },
    success: function (resp) {
      //location.reload();
    }
  });
}

function skel(name) {
  var $skel = $('#skeleton_' + name).clone();
  $skel.removeAttr('id');
  $.each($skel.find('[data-id]'), function (i,v) {
    $skel[$(v).data('id')] = $(v);
  });
  return $skel;
}

function equal_heights() {
  var height = 0;
  $.each($('.equalheights'), function (i,v) {
    if ($(v).height() > height) {
      height = $(v).height();
    }
  });
  $('.equalheights').height(height);
}

function hover_app(id) {
  $.each($backgrounds.find('img'), function (i,v) {
    $(v).css('opacity', 0);
  });
  $backgrounds.find('[data-id="' + id + '"]').css('opacity', 1);
}

function default_background() {
  $.each($backgrounds.find('img'), function (i,v) {
    $(v).css('opacity', 0);
  });
  $backgrounds.find('img[data-id="default"]').css('opacity', 1);
}
