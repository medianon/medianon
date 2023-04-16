let intersectionObserver;

function ensureIntersectionObserver() {
	if (intersectionObserver) return;

  intersectionObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach(entry => {
				const eventName = entry.isIntersecting ? 'enterViewport' : 'exitViewport';
				entry.target.dispatchEvent(new CustomEvent(eventName));
			});
		}
	);
}

export default function viewport(element) {
	ensureIntersectionObserver();

	intersectionObserver.observe(element);

	return {
		destroy() {
			intersectionObserver.unobserve(element);
		}
	}
}
//NOT MY CODE. SOURCE: https://svelte.dev/repl/c6a402704224403f96a3db56c2f48dfc?version=3.57.0
//here is the accompanying README.md:
/*
# `use:viewport`

📹 https://youtu.be/1SKKzdHVvcI

📚  Related Resources
- Tutorials https://svelte.dev/tutorial/actions
- IntersectionObserver API https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

🔗  Want to learn more from me? Check out these links: 

- Twitter: https://twitter.com/lihautan
- Blog: https://lihautan.com/
- Newsletter: https://lihautan.com/newsletter

#svelte #svelteactions
*/