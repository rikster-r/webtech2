$(document).ready(function () {
  $(window).on("scroll", function () {
    const scrollTop = $(window).scrollTop();
    const docHeight = $(document).height() - $(window).height();
    const scrollPercent = (scrollTop / docHeight) * 100;

    $("#scroll-progress").css("height", scrollPercent + "%");
  });
});
