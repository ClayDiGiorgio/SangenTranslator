/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'dragonConlang_blocky\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-u': '&#x259;',
		'icon-U': '&#x26f;',
		'icon-o': '&#x6f;',
		'icon-0': '&#x30;',
		'icon-1': '&#x31;',
		'icon-2': '&#x32;',
		'icon-3': '&#x33;',
		'icon-4': '&#x34;',
		'icon-5': '&#x35;',
		'icon-6': '&#x36;',
		'icon-7': '&#x37;',
		'icon-8': '&#x38;',
		'icon-9': '&#x39;',
		'icon-10': '&#x41;',
		'icon-11': '&#x42;',
		'icon-a': '&#x61;',
		'icon-comma': '&#x2c;',
		'icon-e': '&#x65;',
		'icon-g': '&#x67;',
		'icon-h': '&#x68;',
		'icon-i': '&#x69;',
		'icon-j': '&#x6a;',
		'icon-k': '&#x6b;',
		'icon-n': '&#x6e;',
		'icon-N': '&#x4e;',
		'icon-period': '&#x2e;',
		'icon-s': '&#x73;',
		'icon-S': '&#x283;',
		'icon-T': '&#x3b8;',
		'icon-vowel_holder': '&#x5f;',
		'icon-X': '&#x58;',
		'icon-z': '&#x7a;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
