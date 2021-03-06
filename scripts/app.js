var eventListDom = $('#content');

var Event = Backbone.Model.extend({
  initialize: function() {
    this.formatTime();
  },

  // I am sure there is a cleaner way of doing this but I am not as familiar with javascript's datetime helpers as I am with Ruby's
  // and it doesn't appear as if strftime is supported by javascript without importing another library
  formatTime: function() {
    var startTime = new Date(this.get('begin_time'));

    this.set('start_time', startTime.toLocaleTimeString().replace(/:\d+ /, ' '));
  }
});

var EventListToday = Backbone.Collection.extend({
  model: Event,
  url: 'http://do512.com/events/today.json',

  sync : function(method, collection, options) {
    options.dataType = "jsonp";
    return Backbone.sync(method, collection, options);
  },

  parse: function(response) {
    return response.events;
  },
});

var EventListTomorrow = Backbone.Collection.extend({
  model: Event,
  url: 'http://do512.com/events/tomorrow.json',

  sync : function(method, collection, options) {
    options.dataType = "jsonp";
    return Backbone.sync(method, collection, options);
  },

  parse: function(response) {
    return response.events;
  }
});

var EventListView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('reset', this.render, this);
		this.collection.on('add', this.addOne, this);
  },

  render: function() {
    this.collection.forEach(this.addOne, this);
    eventListDom.html(this.$el);
  },

  addOne: function(evnt) {
    var eventView = new EventView({model: evnt});
    this.$el.append(eventView.render().el);
  }
})

var EventView = Backbone.View.extend({
  template: Handlebars.compile( $("#event-template").html() ),
  initialize: function() {
    this.render();
  },

  render: function() {
    var attr = this.model.toJSON();
    this.$el.html(this.template(attr));

    return this;
  }
});

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'todayRoute',
    'today': 'todayRoute',
    'tomorrow': 'tomorrowRoute'
  },

  todayRoute: function() {
    var eventListToday = new EventListToday();
    var todayView = new EventListView({collection: eventListToday});
    eventListToday.fetch();

    // I had sworn that bootstrap took care of adding and removing the '.active' class on links but a little jquery never hurt anyone
    $('#today-route').addClass('active');
    $('#tomorrow-route').removeClass('active');
    $('#day-label').html("<h4>Today's Events</h4>");
  },

  tomorrowRoute: function() {
    var eventListTomorrow = new EventListTomorrow();
    var tomorrowView = new EventListView({collection: eventListTomorrow});
    eventListTomorrow.fetch();
    $('#tomorrow-route').addClass('active');
    $('#today-route').removeClass('active');
    $('#day-label').html("<h4>Tomorrow's Events</h4>");
  }
});

var appRouter = new AppRouter();
Backbone.history.start();
