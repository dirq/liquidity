function toTimeAgo (dt) {
	var secs = (((new Date()).getTime() - dt.getTime()) / 1000),
		days = Math.floor(secs / 86400);

	return days === 0 && (
		secs < 60 && "just now" ||
		secs < 120 && "a minute ago" ||
		secs < 3600 && Math.floor(secs / 60) + " minutes ago" ||
		secs < 7200 && "an hour ago" ||
		secs < 86400 && Math.floor(secs / 3600) + " hours ago") ||
		days === 1 && "yesterday" ||
		days < 31 && days + " days ago" ||
		days < 60 && "one month ago" ||
		days < 365 && Math.ceil(days / 30) + " months ago" ||
		days < 730 && "one year ago" ||
		Math.ceil(days / 365) + " years ago";
};

ko.bindingHandlers.timeAgo = {
	update: function (element, valueAccessor) {
		var val = ko.utils.unwrapObservable(valueAccessor()),
			date = new Date(val), // WARNING: this is not compatibile with IE8
			timeAgo = toTimeAgo(date);
		return ko.bindingHandlers.html.update(element, function () {
			return '<time datetime="' + encodeURIComponent(val) + '">' + timeAgo + '</time>';
		});
	}
};
