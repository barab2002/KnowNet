// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import './commands';

declare global {
	interface Window {
		__e2eConsoleErrors?: string[];
	}
}

Cypress.on('window:before:load', (win) => {
	win.__e2eConsoleErrors = [];

	const push = (msg: string) => {
		try {
			win.__e2eConsoleErrors?.push(msg);
		} catch {
			// ignore
		}
	};

	const originalError = win.console.error.bind(win.console);
	win.console.error = (...args: unknown[]) => {
		try {
			const msg = args
				.map((a) => {
					if (a instanceof Error) return a.stack || a.message;
					if (typeof a === 'string') return a;
					try {
						return JSON.stringify(a);
					} catch {
						return String(a);
					}
				})
				.join(' ');
			push(msg);
		} catch {
			// ignore logging failures
		}
		originalError(...args);
	};

	win.addEventListener('error', (event) => {
		try {
			const msg =
				event.error instanceof Error
					? event.error.stack || event.error.message
					: event.message;
			push(`window.error: ${msg}`);
		} catch {
			// ignore
		}
	});

	win.addEventListener('unhandledrejection', (event) => {
		try {
			const reason = (event as PromiseRejectionEvent).reason;
			const msg = reason instanceof Error ? reason.stack || reason.message : String(reason);
			push(`unhandledrejection: ${msg}`);
		} catch {
			// ignore
		}
	});
});
