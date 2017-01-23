var eventListDom = $('#content');

var Event = Backbone.Model.extend({});

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
  },

  tomorrowRoute: function() {
    var eventListTomorrow = new EventListTomorrow();
    var tomorrowView = new EventListView({collection: eventListTomorrow});
    eventListTomorrow.fetch();
  }
});

var appRouter = new AppRouter();
Backbone.history.start();
