				import worker, * as OTHER_EXPORTS from "/home/user/dev/nix_test/lib/workers/PorcoRosso85/lib/web/src/route/route.ts";
				import * as __MIDDLEWARE_0__ from "/home/user/dev/nix_test/lib/workers/node_modules/.pnpm/wrangler@3.57.1/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts";
import * as __MIDDLEWARE_1__ from "/home/user/dev/nix_test/lib/workers/node_modules/.pnpm/wrangler@3.57.1/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts";
				
				worker.middleware = [
					__MIDDLEWARE_0__.default,__MIDDLEWARE_1__.default,
					...(worker.middleware ?? []),
				].filter(Boolean);
				
				export * from "/home/user/dev/nix_test/lib/workers/PorcoRosso85/lib/web/src/route/route.ts";
				export default worker;