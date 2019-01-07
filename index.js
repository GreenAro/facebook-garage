var _facebook_params = {
  appId: "554724151584628",
  pageId: "706194782895304"
};

var ecom_pageurl = window.location.href.toLowerCase();

(function(d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

// (function() {
//   var allScripts = document.getElementsByTagName("script");
//   console.log(allScripts);
//   var jQueryAbsent = 1;
//   for (var i = 0; i < allScripts.length; i++) {
//     if (allScripts[i].src === "https://code.jquery.com/jquery-3.3.1.min.js") {
//       jQueryAbsent = 0;
//     }
//   }
//   if (jQueryAbsent) {
//     var s = document.createElement("script");
//     s.type = "text/javascript";
//     s.async = true;
//     s.src = "https://code.jquery.com/jquery-3.3.1.min.js";
//     var x = document.getElementsByTagName("script")[0];
//     x.parentNode.insertBefore(s, x);
//   }
// })();

var goFBCheckBox = function() {
  getUserData();
  renderCheckBox();
};

var getUserData = function() {
  const ecomSessionId = document.getElementById("chatglue-ecom-session-id");
  const customerId = document.getElementById("chatglue-ecom-customer-id");
  const visitorId = document.getElementById("chatglue-ecom-visitor-id");

  _facebook_params.ecomSessionId = ecomSessionId.value;
  _facebook_params.customerId = customerId.value;
  _facebook_params.visitorId = visitorId.value;
  _facebook_params.randomizedUserRef =
    ecomSessionId.value + "." + visitorId.value + "." + new Date().getTime();
  _facebook_params.ref = `sessionId=${
    _facebook_params.ecomSessionId
  }&customerId=${_facebook_params.customerId}&visitorId=${
    _facebook_params.visitorId
  }`;
};

var renderCheckBox = function() {
  // find add to cart buttons
  var addtoCartBtns = document.querySelectorAll(".chatglue-add-to-cart-button");
  if (!addtoCartBtns || addtoCartBtns.length === 0) return;
  else {
    addtoCartBtns.forEach(btn => btn.addEventListener("click", confirmOptIn));
  }

  // add facebook checkbox plugin
  var fbck = document.createElement("div");
  fbck.id = "chatglue-fb-checkbox-plugin";
  fbck.class = "fb-messenger-checkbox";
  fbck.origin = document.location.origin;
  fbck.page_id = "706194782895304";
  fbck.messenger_app_id = "554724151584628";
  fbck.user_ref = _facebook_params.randomizedUserRef;
  fbck.allow_login = true;
  fbck.size = "small";
  fbck.skin = "light";
  fbck.center_align = "true";
  document.body.appendChild(fbck);

  window.fbAsyncInit = function() {
    FB.init({
      appId: _facebook_params.appId,
      xfbml: true,
      version: "v3.2"
    });

    FB.Event.subscribe("messenger_checkbox", function(e) {
      console.log("messenger_checkbox event");
      console.log(e);
      if (e.event == "rendered") {
        console.log("Plugin was rendered");
      } else if (e.event == "checkbox") {
        var checkboxState = e.state;
        console.log("Checkbox state: " + checkboxState);
      } else if (e.event == "not_you") {
        console.log("User clicked 'not you'");
      } else if (e.event == "hidden") {
        console.log("Plugin was hidden");
      }
    });
  };
  window.fbAsyncInit();
};

var confirmOptIn = function() {
  // checkbox confirmation event - tie this to the onclick of "add to cart"
  FB.AppEvents.logEvent("MessengerCheckboxUserConfirmation", null, {
    app_id: _facebook_params.appId,
    page_id: _facebook_params.pageId,
    ref: _facebook_params.ref,
    user_ref: _facebook_params.randomizedUserRef
  });
};

// enable onload
if (window.attachEvent) {
  window.attachEvent("onload", goFBCheckBox);
} else {
  window.addEventListener("load", goFBCheckBox, true);
}
