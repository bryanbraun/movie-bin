/**
 * All methods and properties being used by our application.
 * @type {Object}
 */
var app = {

    config: {
        STATIC_URL: "/static/",
        expandTime: 800,
        populateDelay: 0.8,
        populateDuration: 0.3
    },

    appendMoviesToDOM: function(data) {
        var source   = $("#movie-template").html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('.movies').append(html);
    },

    triggerMovieTransitions: function() {
        var appear,
            delay,
            disappear,
            i,
            ii,
            offset,
            len,
            ref,
            longest = 0;

        // Movie animation inspired by Google's Material Design. We calculate
        // transition durations and delays, based via their left and top offsets
        // in the grid of movies.
        ref = $('.movie');
        len = ref.length;
        for (i = 0; i < len; i++) {
            ii = ref[i];
            offset = ii.offsetLeft + ii.offsetTop;
            totalDelay = (offset / 1000) * this.config.populateDelay;
            $(ii).css({
              'transition-delay': "" + totalDelay + "s",
              'transition-duration': "" + this.config.populateDuration + "s"
            });
            if (longest < delay) {
                longest = delay;
            }
        }

        // Trigger Material Design transitions.
        $('.movie').addClass('after');

        // We reset classes/properties after the transition because, because we
        // don't need them, and they create stacking contexts that make Z-index
        // positioning difficult. See:
        // http://philipwalton.com/articles/what-no-one-told-you-about-z-index/
        setTimeout((function() {
            $('.movie').removeAttr('style');
            $('.movie').removeClass('before after');
        }), longest);
    },

    buildDOM: function() {
        var that = this;
        $.getJSON(that.config.STATIC_URL + "starter/data/movies.json", function(json) {
            that.appendMoviesToDOM(json);

            // Once all images have loaded, trigger the DOMBuilt event.
            $('.movies').imagesLoaded(function() {
                $.event.trigger({
                    type: "DOMBuilt",
                    time: new Date()
                });
            });
        });
    },

    expandMovie: function(e) {
        var $thisCard = $(e.target).closest('.card');
        var $thisPoster = $thisCard.find('.poster');
        var $thisDetail = $thisCard.find('.detail');
        var oLeft = $thisCard[0].offsetLeft;
        var oTop = $thisCard[0].offsetTop;
        var oWidth = $thisCard[0].offsetWidth;
        var scrollTop = $(window).scrollTop();

        $('.poster-img').removeClass('scale-fx');
        $('.lights').addClass('dim');

        $thisCard.css({
            position: 'fixed',
            'z-index': 1,
            width: "" + oWidth + "px",
            left: "" + oLeft + "px",
            top: "" + oTop - scrollTop + "px"
        });

        $thisPoster.animate({
            padding: "30px"
        }, this.config.expandTime, 'swing');

        $thisCard.animate({
            left: '50%',
            width: '60%',
            'margin-left': '-30%'
        }, this.config.expandTime, 'swing', function(){
            // Animation Complete. Show movie details.
            $thisDetail.css({
                display: 'block'
            });
        });
    },

    collapseMovie: function(e) {
        var $thisCard = $(e.target).closest('.card');
        var $thisHole = $(e.target).closest('.movie');
        var $thisPoster = $thisCard.find('.poster');
        var $thisDetail = $thisCard.find('.detail');
        var oLeft = $thisHole[0].offsetLeft;
        var oTop = $thisHole[0].offsetTop;
        var oWidth = $thisHole[0].offsetWidth;
        var scrollTop = $(window).scrollTop();

        $('.poster-img').addClass('scale-fx');
        $('.lights').removeClass('dim');

        $thisDetail.css({
            display: 'none'
        });

        $thisPoster.animate({
            padding: "0px"
        }, this.config.expandTime, 'swing');

        $thisCard.animate({
            width: "" + oWidth + "px",
            left: "" + oLeft + "px",
            top: "" + oTop - scrollTop + "px",
            'margin-left': '0px'
        }, this.config.expandTime, 'swing', function() {
            $thisCard.css({
                position: '',
                'z-index': '',
            });
        });
    }
};

// Run the application.
(function(){
    app.buildDOM();

    $(document).on("DOMBuilt", function(e) {

        app.triggerMovieTransitions();

        // Listener for showing a movie's detailed information.
        $('.poster-link').click(function(event) {
            event.preventDefault();
            app.expandMovie(event);
        });

        // Listener for hiding a movie's detailed information.
        $('.close').click(function(event) {
            event.preventDefault();
            app.collapseMovie(event);
        });
    });
}());
