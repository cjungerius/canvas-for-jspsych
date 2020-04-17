/**
 * jspsych-same-different-canvas
 * Chris Jungerius (modified from Josh de Leeuw)
 *
 * plugin for showing two stimuli sequentially and getting a same / different judgment
 *
 * documentation: TODO
 *
 */

jsPsych.plugins['same-different-canvas'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'same-different-canvas',
    description: '',
    parameters: {
      drawings: {
        type: jsPsych.plugins.parameterType.ARRAY,
        pretty_name: 'Drawings',
        default: undefined,
        array: true,
        description: 'the drawing functions to apply to the canvases, should take the canvas object as argument'
      },
      answer: {
        type: jsPsych.plugins.parameterType.SELECT,
        pretty_name: 'Answer',
        options: ['same', 'different'],
        default: 75,
        description: 'Either "same" or "different".'
      },
      same_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Same key',
        default: 'Q',
        description: ''
      },
      different_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Different key',
        default: 'P',
        description: 'The key that subjects should press to indicate that the two stimuli are the same.'
      },
      first_stim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'First stimulus duration',
        default: 1000,
        description: 'How long to show the first stimulus for in milliseconds.'
      },
      gap_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Gap duration',
        default: 500,
        description: 'How long to show a blank screen in between the two stimuli.'
      },
      second_stim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Second stimulus duration',
        default: 1000,
        description: 'How long to show the second stimulus for in milliseconds.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      interval_disp: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Interval display',
        default: '',
        description: 'HTML content desplayed between the two stimuli (blank by default)'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    display_element.innerHTML = '<div class="jspsych-same-different-stimulus">'+'<canvas id="myCanvas", height = 500, width = 500></canvas>'+'</div>';

    let c = document.getElementById("myCanvas")
    trial.drawings[0](c)

    var first_stim_info;
    if (trial.first_stim_duration > 0) {
      jsPsych.pluginAPI.setTimeout(function() {
        showIntervalScreen();
      }, trial.first_stim_duration);
    } else {
      function afterKeyboardResponse(info) {
        first_stim_info = info;
        showIntervalScreen();
      }
      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: afterKeyboardResponse,
        valid_responses: trial.advance_key,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    function showIntervalScreen() {
      display_element.innerHTML = trial.interval_disp;
      jsPsych.pluginAPI.setTimeout(function() {
        showSecondStim();
      }, trial.gap_duration);
    }

    function showSecondStim() {

      var html = '<div class="jspsych-same-different-stimulus">'+'<canvas id="myCanvas", height = 500, width = 500></canvas>'+'</div>';
      //show prompt here
      if (trial.prompt !== null) {
        html += trial.prompt;
      }
      display_element.innerHTML = html;

      let c = document.getElementById("myCanvas")
      trial.drawings[1](c)
      
      if (trial.second_stim_duration > 0) {
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.innerHTML = trial.interval_disp+trial.prompt;
        }, trial.second_stim_duration);
      }



      var after_response = function(info) {

        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();

        var correct = false;

        var skey = typeof trial.same_key == 'string' ? jsPsych.pluginAPI.convertKeyCharacterToKeyCode(trial.same_key) : trial.same_key;
        var dkey = typeof trial.different_key == 'string' ? jsPsych.pluginAPI.convertKeyCharacterToKeyCode(trial.different_key) : trial.different_key;

        if (info.key == skey && trial.answer == 'same') {
          correct = true;
        }

        if (info.key == dkey && trial.answer == 'different') {
          correct = true;
        }

        var trial_data = {
          "rt": info.rt,
          "answer": trial.answer,
          "correct": correct,
          "drawings": JSON.stringify([trial.drawings[0], trial.drawings[1]]),
          "key_press": info.key
        };
        if (first_stim_info) {
          trial_data["rt_stim1"] = first_stim_info.rt;
          trial_data["key_press_stim1"] = first_stim_info.key;
        }

        display_element.innerHTML = trial.interval_disp;

        jsPsych.finishTrial(trial_data);
      }

      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.same_key, trial.different_key],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });

    }

  };

  return plugin;
})();
