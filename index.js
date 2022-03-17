console.log("%c10FastFingers Hack", "font-size: 35px;color: yellow;font-family:verdana");
console.log("%cHack loaded successfuly!", "font-weight: bold;font-size: 27px;color: #0ea7ed;font-family:verdana");

replaceInput();

let should_space = false;
$("#inputfield").on("keypress", (event) => {
    event.preventDefault();
    let word = $("#row1").children(`[wordnr=${word_pointer}]`).text();
    let ifield = $("#inputfield");
    ifield.parent

    if ((ifield.val() ?? "").length >= word.length){
        should_space = true;
        ifield[0].dispatchEvent(new KeyboardEvent('keyup', {
        key: "Space",
        keyCode: 32,
        code: "KeySpace",
        which: 32,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false
      }));
      return;
    }

    ifield.val(ifield.val() + (word.charAt((ifield.val() ?? "").length) ?? ""))
});

function replaceInput(){
    var el = document.getElementById('inputfield'),
    elClone = el.cloneNode(true);

    el.parentNode.replaceChild(elClone, el);

    var android_spacebar = 0;

    let $inputfield = $("#inputfield");
    
    function selectionCheck(event) {
        selected = event.target.selectionEnd - event.target.selectionStart;
    }

	$inputfield.keydown(selectionCheck);

	$inputfield.keyup(function (event) {
		if (loading == 0) {
			start_countdown();
		}

		if (pre_inputvalue === "" && inputvalue === "")
			inputvalue = $inputfield.val();
		else {
			pre_inputvalue = inputvalue;
			inputvalue = $inputfield.val();
		}

		afk_timer = 0;
		$reloadBtn.show();

		$row1_span_wordnr = $('#row1 span[wordnr="' + word_pointer + '"]');

		var keyid = event.which;
		switch (keyid) {
			case 8:
				correction_counter += compare();
				break;
			case 46:
				correction_counter += compare();
				break;
			default:
				break;
		}
		// only check for selected removed if the input value changed
		if (
			selected &&
			keyid !== 8 &&
			keyid !== 46 &&
			pre_inputvalue !== inputvalue
		) {
			correction_counter += compare() + 1;
		}

		if (event.which == input_key_value && $inputfield.val() == " " && should_space) {
			$inputfield.val("");
            should_space = false;
		} else if (
			((event.which == input_key_value && loading == 0) ||
			android_spacebar == 1) && should_space
		) {
            should_space = false;
			//event.which == 32 => SPACE-Taste

			//evaluate
			var eingabe = $inputfield.val().split(" ");
			user_input_stream += eingabe[0] + " ";

			$row1_span_wordnr.removeClass("highlight-wrong");

			if (eingabe[0] == words[word_pointer]) {
				$row1_span_wordnr.removeClass("highlight").addClass("correct");
				error_correct++;
				error_keystrokes += words[word_pointer].length;
				error_keystrokes++; //für jedes SPACE
			} else {
				$row1_span_wordnr.removeClass("highlight").addClass("wrong");
				error_wrong++;
				error_keystrokes -= Math.round(words[word_pointer].length / 2);
			}

			//process
			word_pointer++;
			$row1_span_wordnr = $('#row1 span[wordnr="' + word_pointer + '"]');

			$row1_span_wordnr.addClass("highlight");

			p = $row1_span_wordnr.position();

			//console.log(p.top+"\n");

			if (p.top > previous_position_top + 10) {
				//"+ 5 ist die Toleranz, damit der Zeilensprung auch funktioniert, wenn User die Schriftart größer gestellt hat, etc."
				row_counter++;
				previous_position_top = p.top;

				var zeilensprung_hoehe = -1 * line_height * row_counter;
				$row1.css("top", zeilensprung_hoehe + "px"); //bei einem zeilensprung wird der text um "line_height" verschoben
				$row1_span_wordnr.addClass("highlight");
			}

			//erase
			$("#inputstream").text(user_input_stream);
			$inputfield.val(eingabe[1]);
		} else {
			//prüfe ob user das wort gerade falsch schreibt (dann zeige es rot an, damit user direkt korrigieren kann)
			//if($inputfield.val().replace(/\s/g, '') == words[word_pointer].substr(0, $inputfield.val().length))
			if (
				$inputfield.val().split(" ")[0] ==
				words[word_pointer].substr(0, $inputfield.val().length)
			)
				$row1_span_wordnr.removeClass("highlight-wrong").addClass("highlight");
			else
				$row1_span_wordnr.removeClass("highlight").addClass("highlight-wrong");
		}
	});
}

//anti afk
setInterval(() => {afk_timer = 0;}, 1000)