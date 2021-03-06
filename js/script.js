/*!
 * Start Bootstrap - Agnecy Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1000, 'easeInOutCubic');
        event.preventDefault();
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// Adapted from http://stackoverflow.com/a/35090719/3857959
$(function () {
    $("[data-lazy-load-image]").each(function (index, element) {
        var img = new Image();
        img.src = $(element).data('lazy-load-image');
        img.className = 'img-responsive img-circle';
        img.alt = 'member image';
        $(element).append(img);
    });
});

$(".expandable").on("click", function() {
  console.log($(this));
  $(this).next().slideToggle(200);
});

// Load schedule
axios.post("https://thd-api.herokuapp.com/events/get").then((response) => {
  const platforms = ["Other", "Zoom", "Hopin", "Discord", "Other"];
  for (let event of response.data) {
    const timestamp = parseInt(event.timestamp);
    let startDate = new Date(timestamp * 1000);
    const luxStart = luxon.DateTime.fromJSDate(startDate);
    startDate = luxStart.toFormat("MMM dd, yyyy hh:mm a")

    const duration = event.duration;
    let endDate = new Date((timestamp + duration) * 1000);
    const luxEnd = luxon.DateTime.fromJSDate(endDate);
    endDate = luxEnd.toFormat("MMM dd, yyyy hh:mm a");

    const container = $("<div>");
    container.addClass("event");

    const title = $("<h4>");
    title.text(event.name);
    container.append(title);

    const dateLabel = $("<h6>");
    let dateString = startDate;
    if (duration != 0) {
      dateString = startDate + " - " + endDate;
    }
    dateLabel.text(dateString);
    container.append(dateLabel);

    let location = "Location: In Person";
    let locationLabel = $("<h6>");
    locationLabel.text(location);
    // Add url to zoom if virtual
    if (!event.is_in_person) {
      const url = $("<a>");
      url.attr("target", "_blank");
      url.attr("href", event.zoom_link);
      url.text(platforms[event.access_code]);
      location = "Location: ";
      locationLabel.text(location);
      locationLabel.append(url);
    }
    container.append(locationLabel);
    
    const text = $("<p>");
    text.text(event.description);
    container.append(text);

    $("#schedule-container").append(container);
  }
});

// Load checkin items
axios.post("https://thd-api.herokuapp.com/checkin/get").then((response) => {
  for (let checkin of response.data) {
    const timestamp = parseInt(checkin.date);
    const date = new Date(timestamp * 1000);
    const luxDate = luxon.DateTime.fromJSDate(date);
    const dateStr = luxDate.toFormat("MMM dd, yyyy hh:mm a")

    const container = $("<div>");
    container.addClass("checkin-item");

    const title = $("<h4>");
    title.text(checkin.name);
    container.append(title);

    const dateLabel = $("<h6>");
    dateLabel.text(dateStr);
    container.append(dateLabel);

    const points = checkin.points;
    const text = $("<p>");
    text.text(`${points} points`);
    container.append(text);

    $("#checkin-container").append(container);
  }
});