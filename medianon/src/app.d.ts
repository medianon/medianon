// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			inpobj;//to move data from the frontend to the backend
			// paramsdata;
		}
		// interface PageData {}
		// interface Platform {}
	}
}
declare module 'js-cookie';

export {};
