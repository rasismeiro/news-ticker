(function($) {

  $.newsTicker = function(options) {

    this.defaults = {
      animateSpeed: 10000,
      animateCategorySpeed: 300,
      category: "#news_category",
      link: '#news_links'
    };
    this.timer = null;
    this.selected = null;
    this.selectedCatID = null;
    this.total = null;
    this.categories = new Array();
    this.links = new Array();
    this.linksWidth = null;

    this.defaults = $.extend({}, this.defaults, options);
    this.time = (this.defaults.animateSpeed + this.defaults.animateCategorySpeed + 30);
    this.height = parseInt($(this.defaults.category + ' li').first().height(), 10);

    this.loadCategories = function() {
      var i = 0, cat, $e, c, self = this;
      this.categories = new Array();
      $(this.defaults.category + ' li').each(function(index, element) {
        cat = new Array();
        $e = $(element);
        cat['id'] = $e.attr('id');
        c = $e.attr('class');
        if ('undefined' !== typeof (c)) {
          cat['class'] = c;
        } else {
          cat['class'] = '';
        }
        cat['html'] = $e.html();
        if (typeof (self.categories[cat['id']]) === "undefined") {
          cat['index'] = i++;
          self.categories[cat['id']] = cat;
        }
      });
    };

    this.loadLinks = function() {
      var link, $e, i = 0, self = this;
      this.links = new Array();
      $(this.defaults.link + ' li').each(function(index, element) {
        link = new Array();
        $e = $(element);
        link['html'] = $e.html();
        link['target'] = $e.data('target');
        link['width'] = $e.width();
        link['class'] = $e.attr('class');
        if ('undefined' === typeof (link['class'])) {
          link['class'] = '';
        }
        self.links[i] = link;
        i++;
      });
      this.linksWidth = $(this.defaults.link).width();
      this.selected = 0;
      this.total = $(this.links).length;
      this.selectedCatID = this.categories[this.links[0]['target']]['id'];
    };

    this.start = function() {
      var target, link, self = this;
      this.loadCategories();
      this.loadLinks();
      link = this.links[0];
      target = link['target'];

      $(this.defaults.category).html('<li id="' + this.selectedCatID + '" class="' + this.categories[target]['class'] + '">' + this.categories[target]['html'] + '</li>');
      $(this.defaults.link).html('<li data-target="' + link['target'] + '" class="' + link['class'] + '">' + link['html'] + '</li>');
      $(this.defaults.link + ' li').first().css({width: link['width'] + 'px', marginLeft: (this.linksWidth + 10) + 'px'});

      this.timer = setInterval(function() {
        self.run();
      }, this.time);

      $(this.defaults.link + ' li').first().animate({marginLeft: '-' + (link['width'] + 10) + 'px'}, this.defaults.animateSpeed, 'linear', function() {
      });

    };

    this.moveCategory = function(target, callback) {
      var self = this;
      if (this.selectedCatID !== target) {
        this.height = parseInt($(this.defaults.category + ' li').first().height(), 10);
        $(this.defaults.category).append($('<li id="' + this.categories[target]['id'] + '" class="' + this.categories[target]['class'] + '">' + this.categories[target]['html'] + '</li>'));
        $('#' + this.selectedCatID).animate({marginTop: '-' + this.height + 'px'}, this.defaults.animateCategorySpeed, function() {
          $('#' + self.selectedCatID).remove();
          self.selectedCatID = target;
          if ('function' === typeof(callback)) {
            callback();
          }
        });
      } else {
        if ('function' === typeof(callback)) {
          callback();
        }
      }
    };

    this.run = function() {
      var s = this.selected + 1, link, self = this;
      if (s > (this.total - 1)) {
        s = 0;
      }
      link = this.links[s];
      $(this.defaults.link + ' li').remove();
      this.moveCategory(link['target'], function() {
        $(self.defaults.link).html($('<li data-target="' + link['target'] + '" class="' + link['class'] + '">' + link['html'] + '</li>').css({width: link['width'] + 'px', marginLeft: (self.linksWidth + 10) + 'px'}));
        $(self.defaults.link + ' li').first().animate({marginLeft: '-' + (link['width'] + 10) + 'px'}, self.defaults.animateSpeed, 'linear', function() {
          self.selected = s;
        });
      });
    };

    this.stop = function() {
      clearInterval(this.timer);
    };

    this.start();

  };

})(jQuery);
