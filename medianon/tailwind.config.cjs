/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			width: {
				'69': '17rem',
				'23': '108px',
				'76': '19rem',
				'84': '21rem',
				'88': '22rem',
				'92': '23rem',
				'100': '25rem',
			},
			height: {
				'84': '21rem',
				'88': '22rem',
				'92': '23rem',
				'100': '25rem',
				'4.5': '18px',
				'1.6': '6px',
				
			},
			top: {
				'13': '53px',
			},
			colors: {
				bgrey: 'rgb(80, 83, 85)',
				bidness: 'rgb(102, 107, 110)',
				home: '#717d83',
				mix: 'rgb(108, 116, 121)',
				default: 'var(--default)', //text only, green
				tabs: 'var(--tabs)',
				history: 'var(--history)',
				custom: 'var(--custom)', //custom text only, blue
				private: 'var(--private)', //private, beige
				audio: 'var(--audio)', //audio, purple
				uibutton: 'rgb(84, 90, 92)',
				ui2: 'var(--ui2)',
				misc: 'rgb(87, 93, 95)',
				speedread: 'rgb(44, 82, 58)',
				listen: 'rgb(85, 68, 97)',
				formbg: 'var(--form-element-background-color)',
				menulines: 'var(--menulines)',
				arrows: 'var(--arrows)',
				field: '#293947',
				bookmark: 'var(--bookmark)',
				subscribe: 'var(--subscribe)',

			},

		}
	},
	plugins: []
};
