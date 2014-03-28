jQuery.fn.extend({
  ajaxForm: function(options) {
    options = options || {};
    var settings = {
      callback: null
    };
    options = jQuery.extend(settings, options);
    var ajaxIframeName = "__ajax_iframe__",
      timeoutHandle = null;
    if ( jQuery("#" + ajaxIframeName).length === 0 )
    {
      jQuery("body").append('<iframe name="' + ajaxIframeName + '" id="' + ajaxIframeName + '" style="display:none;"></iframe>');
    }
    jQuery("#" + ajaxIframeName).off().on("load",function() {
        clearTimeout(timeoutHandle);
        $(".mask").remove();
        var ret = jQuery(this).contents().find("body").text();
        ret = jQuery.parseJSON(ret);
        if ( ret && ret.code !== undefined )
        {
          switch (ret.code)
          {
            case 200:
              break;
            case 401:
              alert("Authentication required");
              document.location.href = ret.location;
              break;
            case 404:
              alert("Not found");
              break;
            case 405:
              alert("Method not allow");
              break;
            case 500:
              alert("Internal error");
              break;
          }
        }
        jQuery("#" + ajaxIframeName).remove();
        if ( jQuery.isFunction(options.callback) )
        {
          options.callback(ret);
        }
    });
    var url = location.pathname + ".action";
    jQuery(this).attr({action: url, method: "POST", enctype: "multipart/form-data", target: ajaxIframeName});
    var ajaxIframeFlagName = "__AJAX_IFRAME__";
    if ( jQuery("#" + ajaxIframeFlagName).length === 0 )
    {
      jQuery(this).append('<input type="hidden" name="' + ajaxIframeFlagName + '" id="' + ajaxIframeFlagName + '" />');
    }
    $("body").append('<div class="mask"><div class="mask-wraper"><div class="loading"></div></div></div>');
    $(".mask").width($(window).width()).height($(window).height());
    $(window).on("resize", function() {
      $(".mask").width($(window).width()).height($(window).height());
    });
    jQuery(this)[0].submit();
    timeoutHandle = setTimeout(function  () {
      jQuery("#" + ajaxIframeName).off().remove();
      $(".mask").remove();
      alert('Time out!');
    },TIMEOUT);
  }
});