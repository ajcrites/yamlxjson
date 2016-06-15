#!/usr/bin/env node
(function () {
  "use strict";

  var fs = require('fs')
    , filename = process.argv[2]
    , YAML = require('js-yaml')
    ;

  /*
   *
   * Begin real handler
   *
   */

  function printUsage() {
    console.warn("Usages:");
    console.warn("yaml2json example.yml");
    console.warn("cat example.yml | yaml2json");
  }

  function handleInput(err, text) {
    var data
      ;

    if (err) {
      printUsage();
      return;
    }

    data = YAML.safeLoad(text);
    console.info(JSON.stringify(data, null, '  '));
  }

  /*
   *
   * End real handler
   *
   */

  readInput(handleInput, filename);

  //
  // this could (and probably should) be its own module
  //
  function readInput(cb, filename) {

    function readFile() {
      fs.readFile(filename, 'utf8', function (err, text) {
        if (err) {
          console.error("[ERROR] couldn't read from '" + filename + "':");
          console.error(err.message);
          return;
        }

        cb(err, text);
      });
    }

    function readStdin() {
      var text = ''
        , timeoutToken
        , stdin = process.stdin
        ;
      
      stdin.resume();

      // how to tell piping vs waiting for user input?
      timeoutToken = setTimeout(function () {
        cb(new Error('no stdin data'));
        stdin.pause();
      }, 1000);

      stdin.on('data', function (chunk) {
        clearTimeout(timeoutToken);
        text += chunk;
      });
      
      stdin.on('end', function () {
        cb(null, text);
      });
    }

    if (filename) {
      readFile();
    }
    else {
      readStdin();
    }

  }

}());