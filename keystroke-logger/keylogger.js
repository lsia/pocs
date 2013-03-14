/*
 * Code written by Enrique Calot. March 2013
 */

window['Keylogger']=function($selector,callbackEnterFunction,on_end_callback) {
	var
		n=navigator['userAgent'],
		last,
		keystroke,
		bufferstroke,textstroke,delstroke,
		add=function(v) {keystroke+=v;},
		radd=function(v){add(radix2(v))},
		init=function() {
			keystroke=bufferstroke=delstroke=textstroke='';
			last=0;
			add(radix2(n.length)+n);
		}
	init();

	$selector['on']('keydown keyup',function(e){
		radd(e['originalEvent']['location']<<9|e['keyCode']<<1|(e['type']=='keyup'?0:1))
		last=e['timeStamp'];
	});
	$selector['on']('keypress',function(e){
		var eventChar = String.fromCharCode(e.keyCode || e.charCode);
		if (e['keyCode']==8) {
			if (textstroke) {
				delstroke=textstroke.slice(-1)+delstroke;
				textstroke=textstroke.slice(0,-1);
			}
		} else if (e['keyCode']==13){
			callbackEnterFunction(bufferstroke+textstroke,keystroke);

		} else if ( eventChar.length==1){
			if (delstroke) {
				bufferstroke+=textstroke+'<s>'+delstroke+'</s>';
				delstroke=textstroke='';
			}
			textstroke+=eventChar;
		} else {
			textstroke+=' ';
		}
	});
	function radix2(number) {
		var
			out='';
		/** @const */ var
			encode1="0124689qwertyuiopsdfgASDFGHJKLZX",
			encode2="35 ahjklzxcvbnmQWERTYUIOPCVBNM7#";
		while (number>31) {
			out+=encode1.charAt(number & 31);
			number=number>>5;
		}
		return out+encode2.charAt(number);
	}

	return function() {
		on_end_callback(bufferstroke+textstroke,keystroke);
		init();
	}
}
