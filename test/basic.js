
var Jog = require('jog')
  , StdStore = require('../')
  , through = require('through');

describe('StdStore', function(){
  var stream = through(
    function write(data) {
      var self = this;
      process.nextTick(function(){
        self.emit('data', data);
      });
    },
    function end() {
      this.emit('end');
    }
  );

  var store = new StdStore({
    in: stream,
    err: stream,
    out: stream
  });

  describe('#stream()', function(){
    it('should emit "data" and "end" events', function(done){
      var log = new Jog(store);
      log.write('info', 'compiling video', { vid: 'abc' });
      log.write('info', 'uploading video', { vid: 'abc' });

      var stream = log.stream({ interval: 100 });
      var lines = [];

      stream.on('data', function(line){
        lines.push(line);
      }).on('end', function(){
        lines[0].should.have.property('timestamp');
        delete lines[0].timestamp;
        delete lines[1].timestamp;
        lines[0].should.eql({ vid: 'abc', level: 'info', type: 'compiling video' });
        lines[1].should.eql({ vid: 'abc', level: 'info', type: 'uploading video' });
        done();
      });
    });

    describe('when "end" is false', function(){
      it('should remain open', function(done){
        var log = new Jog(store)
          , stream = log.stream({ end: false, interval: 100 })
          , n = 0;

        var id = setInterval(function(){
          log.write('info', 'compiling video', { vid: ++n });
        }, 2);

        stream.on('data', function(line){
          if (line.vid == 20) {
            clearInterval(id);
            done();
          }
        }).on('end', function(){
          done(new Error('called end'));
        });
      });
    });
  });

  describe('#clear(fn)', function(){
    it('should clear the data', function(done){
      var log = new Jog(store);
      log.write('info', 'compiling video', { vid: 'abc' });
      log.write('info', 'uploading video', { vid: 'abc' });
      log.clear(function(err){
        if (err) return done(err);
        var stream = log.stream({ interval: 100 });
        var lines = [];

        stream.on('data', function(line){
          lines.push(line);
        }).on('end', function(){
          lines.should.have.length(0);
          done();
        });
      });
    });
  });
});